/** Streaming wire formats for the Yazhi API.

    The contract (ROUTE-CONTRACTS §B): every route accepts `?format=sse` to
    stream `text/event-stream` instead of NDJSON; the default is NDJSON. Both
    carry the same lines — { text } | { error } | { done: true } — so an
    existing NDJSON reader keeps working against /api/bubble/run while a
    partner who wants SSE gets it without a second endpoint.

    This module is a plain encoder with no imports, so a Route Handler, the
    in-process port and a `node --test` file all use the same bytes. */

import type { RunChunk, StreamFormat } from "./types";

const encoder = new TextEncoder();

/** Read `?format=` from a query string / URLSearchParams; anything other than
    exactly "sse" is NDJSON (the default, and what an old client gets). */
export function streamFormat(params: { get(name: string): string | null }): StreamFormat {
  return params.get("format") === "sse" ? "sse" : "ndjson";
}

export function contentTypeFor(format: StreamFormat): string {
  return format === "sse" ? "text/event-stream; charset=utf-8" : "application/x-ndjson; charset=utf-8";
}

export function streamHeaders(format: StreamFormat): Record<string, string> {
  return {
    "Content-Type": contentTypeFor(format),
    "Cache-Control": "no-store, no-cache",
    // SSE behind a proxy: stop it buffering the stream
    ...(format === "sse" ? { "X-Accel-Buffering": "no" } : {}),
  };
}

/** One chunk → the bytes that carry it.
    NDJSON: the JSON and a newline.
    SSE:   `data: <json>\n\n`, and `[DONE]` after the final chunk, matching
           OpenAI's SSE convention so an existing SSE reader can consume it. */
export function encodeChunk(chunk: RunChunk, format: StreamFormat): Uint8Array {
  const json = JSON.stringify(chunk);
  if (format === "ndjson") return encoder.encode(`${json}\n`);
  const frame = `data: ${json}\n\n`;
  return encoder.encode(chunk && "done" in chunk && chunk.done ? `${frame}data: [DONE]\n\n` : frame);
}

/** Wrap a stream of chunks in a ReadableStream Response body. */
export function streamFromChunks(
  chunks: AsyncIterable<RunChunk> | Iterable<RunChunk>,
  format: StreamFormat
): ReadableStream<Uint8Array> {
  const iterator = (async function* () {
    try {
      for await (const chunk of chunks) yield encodeChunk(chunk, format);
    } catch (err) {
      // a mid-stream failure is still a documented line, never a torn socket
      yield encodeChunk({ error: err instanceof Error ? err.message : "The stream failed." }, format);
    }
  })();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const step = await iterator.next();
      if (step.done) controller.close();
      else controller.enqueue(step.value);
    },
    async cancel() {
      await iterator.return?.(undefined);
    },
  });
}

/** A stream that carries exactly one chunk (an error, or a single answer). */
export function singleChunkStream(chunk: RunChunk, format: StreamFormat): Response {
  return new Response(streamFromChunks([chunk], format), { headers: streamHeaders(format) });
}

/** Parse one NDJSON line or one SSE `data:` line into a chunk. Returns null
    for heartbeats, `[DONE]`, blank lines and anything unparseable — the same
    tolerance src/lib/chat/backend.ts's parseSseLine() applies upstream.
    Shared by the typed client so browser and partner code agree. */
export function parseChunkLine(line: string): RunChunk | null {
  let payload = line.trim();
  if (!payload) return null;
  if (payload.startsWith("data:")) payload = payload.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const value = JSON.parse(payload) as unknown;
    if (!value || typeof value !== "object") return null;
    const chunk = value as Partial<RunChunk> & { done?: unknown };
    if (typeof (chunk as { text?: unknown }).text === "string") return { text: (chunk as { text: string }).text };
    if (typeof (chunk as { error?: unknown }).error === "string") return { error: (chunk as { error: string }).error };
    if (chunk.done === true) return { done: true };
    return null;
  } catch {
    return null;
  }
}
