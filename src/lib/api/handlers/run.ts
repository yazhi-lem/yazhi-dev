import "server-only";

/** POST /api/bubble/run — the in-process port of the existing route.
 *
 *  src/app/api/bubble/run/route.ts is frozen by the team's boundaries: it is
 *  still what /bubble and the Bubble UI call, and its behaviour must not
 *  change. The kernel therefore carries its own copy of the SAME validations
 *  and the same stream source (streamCompletion), so `localPort().runBubble`
 *  and an HTTP call to the route give the same answers:
 *
 *   1. same-origin            → 403
 *   2. a Circle session        → 401
 *   3. validateManifest()      → 400, problems joined with a space
 *   4. permissions includes
 *      "yazhi-api"            → 403
 *   5. model in the allow-list → 400, listing what is allowed
 *   6. messages an array of
 *      {role, content}        → 400, then the last 40 turns, 8000 chars each
 *   7. streamCompletion()
 *
 *  The route answers "text/plain" NDJSON regardless of ?format=; this handler
 *  honours ?format=sse as the contract requires of every new route. Nothing
 *  else differs.
 */

import { effectiveSystemPrompt, validateManifest, type BubbleManifest } from "@yazhi/bubble/lib/manifest";
import { streamCompletion } from "@/lib/chat/backend";
import { MAX_TURNS, MAX_TURN_CHARS, allowedModelSet } from "../env";
import type { RunChunk, RunRequest } from "../types";
import { fail, parseJsonBody, streamResult, type Handler, type HandlerInput, type HandlerResult } from "./core";

export const runBubble: Handler = async (input: HandlerInput): Promise<HandlerResult> => {
  if (!input.allowedOrigin) return fail(403, "Cross-site request refused.", "cross_site");
  if (!input.caller) {
    return fail(
      401,
      "Sign in with your Circle account to run bubbles on yazhi-api — or switch this bubble to on-device.",
      "unauthorized"
    );
  }

  const parsed = parseJsonBody(input.body);
  if (!parsed.ok) return fail(400, "Request body is not valid JSON.", "invalid_json");
  const body = parsed.value as Partial<RunRequest> | null;

  const problems = validateManifest((body as { manifest?: unknown } | null)?.manifest);
  if (problems.length) return fail(400, `Invalid bubble: ${problems.join(" ")}`, "invalid_manifest");
  const manifest = body!.manifest as BubbleManifest;

  if (!manifest.permissions.includes("yazhi-api")) {
    return fail(403, 'This bubble has not declared the "yazhi-api" permission.', "forbidden");
  }
  const allowed = allowedModelSet();
  if (!allowed.has(manifest.runtime.model)) {
    return fail(
      400,
      `Model "${manifest.runtime.model}" is not available on yazhi-api. Allowed: ${[...allowed].join(", ")}.`,
      "bad_request"
    );
  }
  if (!Array.isArray(body!.messages)) return fail(400, "messages must be an array", "bad_request");

  const messages = (body!.messages as unknown[])
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        typeof m === "object" &&
        ((m as { role?: unknown }).role === "user" || (m as { role?: unknown }).role === "assistant") &&
        typeof (m as { content?: unknown }).content === "string"
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_TURN_CHARS) }));

  const stream = await streamCompletion({
    model: manifest.runtime.model,
    systemPrompt: effectiveSystemPrompt(manifest),
    messages,
    user: input.caller.accountId,
  });
  return streamResult(ndjsonChunks(stream), input.format);
};

/** Re-read the NDJSON stream streamCompletion produces into chunks, so the
    kernel can re-emit them as NDJSON or SSE without changing the upstream
    reader. Malformed lines are dropped, exactly as the route's clients do. */
async function* ndjsonChunks(stream: ReadableStream<Uint8Array>): AsyncIterable<RunChunk> {
  const reader = stream.getReader();
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
          // a partial or non-JSON line is not a chunk
        }
      }
    }
    const tail = buffer.trim();
    if (tail) {
      try {
        yield JSON.parse(tail) as RunChunk;
      } catch {
        // ignore
      }
    }
  } finally {
    reader.releaseLock();
  }
}
