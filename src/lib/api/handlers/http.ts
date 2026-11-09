import "server-only";

/** The Next.js boundary of the API kernel.
 *
 *  Every /api route file is a few lines of glue that calls into here, and so
 *  does `localPort()` (../ports-local.ts → ../local-port.ts) — which is why
 *  the two cannot drift from
 *  each other. This file is the only place that knows about NextRequest,
 *  NextResponse, cookies and the Circle session.
 *
 *  Auth model (docs/API.md §Auth):
 *   - same-origin: sameOrigin() from src/lib/circle/session.ts
 *   - identity: currentAccount() from the same file (httpOnly cookies; the
 *     kernel never sees a token)
 *   - maintainer: YAZHI_MAINTAINERS (../maintainers.ts), fail-closed
 */

import { NextRequest, NextResponse } from "next/server";
import { currentAccount, sameOrigin } from "@/lib/circle/session";
import { CircleCallError } from "@/lib/circle/client";
import { isMaintainer } from "../maintainers";
import { streamFormat, streamFromChunks } from "../sse";
import { BODY_LIMITS, type BodyLimitKind } from "../env";
import type { Handler, HandlerInput, HandlerResult, Caller } from "./core";

export type AuthMode = "required" | "optional" | "public";

/** Resolve the Circle account for this request. A Circle outage (yazhi-api
    unreachable) is a 503 for a gated route, not a silent "you are not signed
    in" — the caller must be able to tell the two apart. */
export async function resolveCaller(): Promise<{ caller: Caller | null } | { error: NextResponse }> {
  let account;
  try {
    account = await currentAccount();
  } catch (err) {
    const message = err instanceof CircleCallError ? err.message : "Circle session check failed.";
    return { error: NextResponse.json({ error: message, code: "upstream_error" }, { status: 503 }) };
  }
  if (!account) return { caller: null };
  return {
    caller: {
      accountId: account.accountId,
      name: account.fullName,
      email: account.email,
      maintainer: isMaintainer({ accountId: account.accountId, email: account.email }),
    },
  };
}

/** The result of reading a request body within its cap. `tooLarge` carries
    the limit so the response can say what was exceeded. */
type BodyRead = { ok: true; body: string } | { ok: false; limit: number };

/** Read a request body, refusing to buffer more than `limit` bytes.

    Two gates, cheapest first:
      1. an honest `Content-Length` over the cap is refused before a single
         byte is read — no allocation at all;
      2. a chunked or dishonest body is still bounded: the stream is read
         chunk by chunk and abandoned the moment it passes the cap, so a
         client that lies about its length cannot make the server buffer more
         than `limit` (plus at most one stream chunk).

    Body text is capped in *bytes*, matching the handlers' own byte checks;
    a Tamil manifest is 3 bytes per character in UTF-8, so the transport cap
    is deliberately above the semantic one (see BODY_LIMITS in ../env.ts). */
export async function readBoundedBody(req: NextRequest, limit: number): Promise<BodyRead> {
  const declared = req.headers.get("content-length");
  if (declared !== null) {
    const length = Number(declared);
    // a malformed or negative length is not trusted; fall through to the
    // streaming guard rather than guessing
    if (Number.isFinite(length) && length > limit) return { ok: false, limit };
  }
  if (!req.body) return { ok: true, body: "" };

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        // stop pulling; the caller answers 413. Cancelling releases the socket.
        await reader.cancel().catch(() => {});
        return { ok: false, limit };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, body: text };
  } finally {
    reader.releaseLock();
  }
}

/** Build the framework-free input from a Next request.
    `limit` is the transport cap for this route (BODY_LIMITS in ../env.ts);
    pass `undefined` only for a route that accepts no body. */
export async function inputFromRequest(
  req: NextRequest,
  params: Record<string, string> = {},
  limit: BodyLimitKind | number = "default"
): Promise<HandlerInput | { tooLarge: true; limit: number }> {
  const url = new URL(req.url);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const cap = typeof limit === "number" ? limit : BODY_LIMITS[limit];

  // The body is read BEFORE authentication, so the cap is what keeps an
  // unauthenticated caller from making the server allocate megabytes.
  // `/api/bubble/run` is the exception: it is the frozen route and still
  // buffers its own body; the kernel's own routes all come through here.
  const read = hasBody ? await readBoundedBody(req, cap) : ({ ok: true, body: "" } as const);
  if (!read.ok) return { tooLarge: true, limit: read.limit };

  return {
    params,
    query: url.searchParams,
    body: read.body,
    caller: null,
    format: streamFormat(url.searchParams),
    allowedOrigin: sameOrigin(req),
  };
}

/** The one-line answer for a body over its cap, in the contract's shape. */
export function tooLargeResponse(limit: number): NextResponse {
  return NextResponse.json(
    { error: `Request body is too large (limit ${limit} bytes).`, code: "too_large" },
    { status: 413 }
  );
}

/** `inputFromRequest` + `respond`, the two calls every route makes. Routes
    that need identity resolution modes still use the pair directly. */
export async function handle(
  req: NextRequest,
  handler: Handler,
  auth: AuthMode,
  opts: { params?: Record<string, string>; limit?: BodyLimitKind | number } = {}
): Promise<Response> {
  const input = await inputFromRequest(req, opts.params ?? {}, opts.limit ?? "default");
  if ("tooLarge" in input) return tooLargeResponse(input.limit);
  return respond(handler, input, auth);
}

/** Run a handler with the caller the auth mode calls for, and render the
    result as a NextResponse. */
export async function respond(handler: Handler, input: HandlerInput, auth: AuthMode): Promise<Response> {
  let prepared = input;
  if (auth !== "public") {
    const resolved = await resolveCaller();
    if ("error" in resolved) return resolved.error;
    prepared = { ...input, caller: resolved.caller };
  }
  try {
    const result: HandlerResult = await handler(prepared);
    if (result.kind === "json") {
      return NextResponse.json(result.body, { status: result.status, headers: result.headers });
    }
    return new Response(streamFromChunks(result.chunks, result.format), {
      status: result.status,
      headers: result.headers,
    });
  } catch (err) {
    console.error("[api] handler failed:", err);
    return NextResponse.json({ error: "Internal error.", code: "internal" }, { status: 500 });
  }
}

/** Awaited dynamic params for a Next 16 route handler. */
export async function routeParams(ctx: { params?: Promise<Record<string, string | string[]>> }): Promise<Record<string, string>> {
  const raw = (await ctx.params) ?? {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    out[key] = Array.isArray(value) ? (value[0] ?? "") : value;
  }
  return out;
}
