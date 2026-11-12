/** A typed wrapper for the EXISTING POST /api/bubble/run.
 *
 *  That route existed before the kernel and is frozen:
 *  docs/team/BOUNDARIES-20261109.md forbids changing its behaviour, and the
 *  Bubble UI in packages/bubble/src/lib/runtime.ts still calls it directly.
 *  This module adds a typed client path over it — nothing else. If you want
 *  the ?format=sse variant, or the in-process port, use
 *  `createClient(...).runBubble` (src/lib/api/client.ts) instead.
 *
 *  Shape of the route (src/app/api/bubble/run/route.ts):
 *    POST { manifest, messages } → NDJSON lines of ChatChunk
 *    (Content-Type text/plain; text/plain is part of the frozen behaviour —
 *    do not "fix" it here)
 *  Errors are JSON { error } with 400/401/403/503.
 *
 *  Import-safe in the browser: no server-only, no Node built-ins, and the
 *  error type comes from the leaf ./error rather than ./client, so a client
 *  component can use this wrapper without pulling the port machinery. */

import type { BubbleManifest } from "@yazhi/bubble/lib/manifest";
import type { BubbleRuntime } from "@yazhi/bubble/lib/manifest";
import { YazhiApiError } from "./error";
import type { RunChunk, RunTurn } from "./types";

export interface BubbleRunOptions {
  signal?: AbortSignal;
  /** the base URL for the route; "" (same origin) by default */
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

const ROUTE = "/api/bubble/run";

/** Start a run on yazhi-api through the existing route. Errors before the
 *  first byte throw YazhiApiError; mid-stream errors arrive as `{ error }`
 *  chunks (the route's own convention) — collectBubbleRun rethrows them. */
export async function runBubbleOnYazhiApi(
  manifest: Pick<BubbleManifest, "agent" | "runtime" | "permissions"> & { [key: string]: unknown },
  messages: RunTurn[],
  options: BubbleRunOptions = {}
): Promise<ReadableStream<Uint8Array>> {
  const doFetch = options.fetchImpl ?? fetch;
  const res = await doFetch(`${options.baseUrl ?? ""}${ROUTE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manifest, messages }),
    signal: options.signal,
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    let body: { error?: string; code?: string } = { error: text.slice(0, 300) || `Request failed (${res.status})` };
    try {
      const parsed = JSON.parse(text) as { error?: string; code?: string };
      if (parsed && typeof parsed.error === "string") body = parsed;
    } catch {
      // non-JSON body: keep the sliced text
    }
    throw new YazhiApiError(res.status, {
      error: body.error ?? `Request failed (${res.status})`,
      ...(body.code ? { code: body.code as never } : {}),
    });
  }
  return res.body;
}

/** Decode the route's NDJSON body into chunks. */
export async function* decodeBubbleRun(body: ReadableStream<Uint8Array>): AsyncIterable<RunChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let index: number;
      while ((index = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, index).trim();
        buffer = buffer.slice(index + 1);
        if (!line) continue;
        try {
          const chunk = JSON.parse(line) as RunChunk;
          if (chunk && typeof chunk === "object") yield chunk;
        } catch {
          // partial line
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Run to completion and return the whole answer, throwing on a streamed
 *  { error } line. */
export async function collectBubbleRun(
  manifest: Pick<BubbleManifest, "agent" | "runtime" | "permissions"> & { [key: string]: unknown },
  messages: RunTurn[],
  options: BubbleRunOptions = {}
): Promise<string> {
  const body = await runBubbleOnYazhiApi(manifest, messages, options);
  let out = "";
  for await (const chunk of decodeBubbleRun(body)) {
    if ("error" in chunk && typeof chunk.error === "string") {
      throw new YazhiApiError(502, { error: chunk.error, code: "upstream_error" });
    }
    if ("text" in chunk) out += chunk.text;
    else if ("done" in chunk) break;
  }
  return out;
}

/** Thin re-export so a caller can name the runtime it used. */
export type { BubbleRuntime };
