import "server-only";

/** The handler core's own types — shared by every file in this folder and by
    the adapters in ./http.ts.

    A handler never touches Next.js. It takes a plain `HandlerInput` (method,
    path params, query, raw body text and — server-side only — who is calling)
    and returns a plain `HandlerResult` (status, headers, JSON, or a stream).
    Route files and `localPort()` both call this, so the two can never drift.
    That is the whole reason the folder exists. */

import type { ApiErrorBody, ApiErrorCode, StreamFormat } from "../types";

/** Who is calling, as the adapter established it. Tokens never appear here. */
export interface Caller {
  accountId: string;
  name?: string;
  email?: string | null;
  /** true when the account is in YAZHI_MAINTAINERS (see ../maintainers.ts) */
  maintainer: boolean;
}

export interface HandlerInput {
  /** dynamic route params, already decoded (e.g. { name: "tamil-tutor" }) */
  params: Record<string, string>;
  /** query string value lookup; absent = null */
  query: { get(name: string): string | null };
  /** raw request body text; "" when there is none */
  body: string;
  /** the caller, or null when anonymous. Adapters fill this in. */
  caller: Caller | null;
  /** ?format= (ndjson unless "sse") */
  format: StreamFormat;
  /** for the same-origin gate: the adapter decides, the handler only reports */
  allowedOrigin: boolean;
}

export interface JsonResult<T = unknown> {
  kind: "json";
  status: number;
  body: T;
  headers: Record<string, string>;
}

export interface StreamResult {
  kind: "stream";
  status: number;
  format: StreamFormat;
  chunks: AsyncIterable<import("../types").RunChunk>;
  headers: Record<string, string>;
  /** cache headers etc.; the content type is set from `format` downstream */
}

export type HandlerResult<T = unknown> = JsonResult<T> | StreamResult;

export function json<T>(status: number, body: T, headers: Record<string, string> = {}): JsonResult<T> {
  return { kind: "json", status, body, headers };
}

/** A JSON error, always in the contract's { error, code? } shape. */
export function fail(status: number, error: string, code?: ApiErrorCode): JsonResult<ApiErrorBody> {
  return json<ApiErrorBody>(status, code ? { error, code } : { error });
}

/** Parse the request body as JSON. An empty body is `null` rather than an
    error — a handler decides whether it needs one. */
export function parseJsonBody(body: string): { ok: true; value: unknown } | { ok: false } {
  if (!body.trim()) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(body) };
  } catch {
    return { ok: false };
  }
}

const STREAM_HEADERS: Record<StreamFormat, Record<string, string>> = {
  ndjson: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store, no-cache" },
  sse: {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store, no-cache",
    "X-Accel-Buffering": "no",
  },
};

export function streamResult(
  chunks: AsyncIterable<import("../types").RunChunk>,
  format: StreamFormat,
  status = 200
): StreamResult {
  return { kind: "stream", status, format, chunks, headers: STREAM_HEADERS[format] };
}

/** A handler: one function per operation, no HTTP framework. */
export type Handler = (input: HandlerInput) => Promise<HandlerResult>;

/** Every handler gets this from its adapter. `allowedOrigin` is false only
    when the adapter saw an explicit cross-site Origin; a same-origin fetch
    (even one without an Origin header) is true. */
export function baseInput(partial: Partial<HandlerInput>): HandlerInput {
  return {
    params: {},
    query: new URLSearchParams(),
    body: "",
    caller: null,
    format: "ndjson",
    allowedOrigin: true,
    ...partial,
  };
}
