/** createClient — the typed Yazhi API client.
 *
 *  One object, two transports, one error type:
 *
 *    const client = createClient("/");                      // same origin, HTTP
 *    const client = createClient("https://yazhi.dev");      // a partner
 *    const client = createClient(await localPort());        // in-process (server)
 *
 *  The in-process port lives in ./ports-local and is server-only; this module
 *  never names it, so `createClient` is importable from a client component
 *  with no server module on the client graph. Use `createClient("/")` there.
 *
 *  Every method returns the contract's typed body (src/lib/api/types.ts) and
 *  throws YazhiApiError (re-exported here from ./error) on a non-2xx, carrying
 *  status, code, message and the parsed body. 429 (rate limited) and 503
 *  (upstream unavailable) are retried with exponential backoff and jitter —
 *  three attempts by default — because both mean "come back in a moment", not
 *  "you did something wrong".
 *
 *  This file must stay importable from a client component: no `server-only`,
 *  no `node:*`, no eager import of the server handlers. (Checked by the
 *  api-kernel tests and by `grep` in docs/API.md §Testing.) */

import {
  HttpResponseError,
  httpPort,
  type CallOptions,
  type HttpPortOptions,
  type YazhiApiPort,
} from "./ports";
import { YazhiApiError } from "./error";
import type {
  AgentSummary,
  ApiErrorBody,
  ApiErrorCode,
  BubbleVersion,
  HealthResponse,
  ListBubblesQuery,
  ListBubblesResponse,
  ManifestCheckResult,
  PublishInput,
  PublishResponse,
  ReviewInput,
  RunChunk,
  RunTurn,
  TranslateEntryInput,
  WithdrawInput,
  WithdrawResponse,
} from "./types";

/** Re-exported from ./error (a leaf module) so callers keep importing the
    error type from here, while /app-side code can import it from ./error
    without pulling this module's port machinery. */
export { YazhiApiError };

export interface ClientOptions extends HttpPortOptions {
  /** header value sent as `Authorization: Bearer <key>` when given */
  apiKey?: string;
  /** fetch used by the HTTP port (and by retry timing in tests) */
  fetchImpl?: typeof fetch;
  /** attempts for a retryable failure, 1 = no retry. default 3 */
  attempts?: number;
  /** base delay in ms for the exponential backoff. default 400 */
  baseDelayMs?: number;
  /** cap for one delay. default 4000 */
  maxDelayMs?: number;
  /** test hook: replace the sleep (defaults to setTimeout) */
  sleep?: (ms: number) => Promise<void>;
}

/** What a client can be built from. */
export type ClientSource = string | YazhiApiPort | (() => Promise<YazhiApiPort>);

export interface YazhiClient {
  readonly kind: "http" | "local" | "deferred";
  health(opts?: CallOptions): Promise<HealthResponse>;
  agents(opts?: CallOptions): Promise<AgentSummary[]>;
  listBubbles(query?: ListBubblesQuery, opts?: CallOptions): Promise<ListBubblesResponse>;
  getBubble(name: string, version?: string, opts?: CallOptions): Promise<BubbleVersion>;
  publishBubble(input: PublishInput, opts?: CallOptions): Promise<PublishResponse>;
  reviewBubble(name: string, input: ReviewInput, opts?: CallOptions): Promise<BubbleVersion>;
  withdrawBubble(name: string, input: WithdrawInput | undefined, opts?: CallOptions): Promise<WithdrawResponse>;
  validateManifest(manifest: unknown, opts?: CallOptions): Promise<ManifestCheckResult>;
  /** streams text chunks; { done: true } ends it, { error } is thrown */
  runBubble(manifest: unknown, messages: RunTurn[], opts?: CallOptions): AsyncIterable<RunChunk>;
  translate(locale: string, entries: TranslateEntryInput[], opts?: CallOptions): AsyncIterable<RunChunk>;
  openApi(opts?: CallOptions): Promise<unknown>;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** 429/503 wait: honour Retry-After (seconds or an HTTP date) when the server
    sent one, else exponential backoff with full jitter. */
function backoffDelay(attempt: number, opts: ClientOptions, headers?: Record<string, string>): number {
  const base = opts.baseDelayMs ?? 400;
  const max = opts.maxDelayMs ?? 4000;
  const retryAfter = headers?.["retry-after"];
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, max);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), max);
  }
  const ceiling = Math.min(max, base * 2 ** (attempt - 1));
  return Math.floor(Math.random() * ceiling);
}

/** Turn whatever a port threw into a YazhiApiError when it is an API
    failure; return the original error otherwise (a network TypeError, an
    AbortError) so the caller keeps its own semantics. */
function normaliseError(err: unknown): unknown {
  if (err instanceof YazhiApiError) return err;
  if (err instanceof HttpResponseError) {
    let body: ApiErrorBody = { error: err.body || `Request failed (${err.status})` };
    try {
      const parsed = JSON.parse(err.body) as Partial<ApiErrorBody>;
      if (parsed && typeof parsed.error === "string") {
        body = {
          error: parsed.error,
          ...(typeof parsed.code === "string" ? { code: parsed.code as ApiErrorCode } : {}),
          ...(typeof parsed.field === "string" ? { field: parsed.field } : {}),
        };
      }
    } catch {
      // not JSON (a proxy's HTML error page): keep the status, generic message
    }
    return new YazhiApiError(err.status, body, err.headers);
  }
  if (err && typeof err === "object" && (err as { name?: unknown }).name === "RegistryError") {
    const shaped = err as { status?: number; code?: string; message?: string };
    return new YazhiApiError(typeof shaped.status === "number" ? shaped.status : 500, {
      error: shaped.message ?? "The bubble registry failed.",
      ...(shaped.code ? { code: shaped.code as ApiErrorCode } : {}),
    });
  }
  return err;
}

/** Which side a client is on, for the UI that shows a runtime badge.
    A deferred source resolves to whichever port it produces. */
function clientKind(source: ClientSource): "http" | "local" | "deferred" {
  if (typeof source === "string") return "http";
  if (typeof source === "function") return "deferred";
  return (source as { kind?: string }).kind === "local" ? "local" : "http";
}

export function createClient(source: ClientSource, options: ClientOptions = {}): YazhiClient {
  const attempts = Math.max(1, options.attempts ?? 3);
  const sleep = options.sleep ?? defaultSleep;

  let resolved: YazhiApiPort | null = typeof source === "string" ? null : typeof source === "function" ? null : source;
  let pending: Promise<YazhiApiPort> | null = null;

  async function port(): Promise<YazhiApiPort> {
    if (typeof source === "string") {
      if (!resolved) {
        const headers = { ...(options.headers ?? {}), ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}) };
        resolved = httpPort(source, { ...options, headers });
      }
      return resolved;
    }
    if (typeof source !== "function") return source;
    pending ??= source().catch((err: unknown) => {
      pending = null; // a failed lazy init can be retried on the next call
      throw err;
    });
    return pending;
  }

  async function call<T>(fn: (p: YazhiApiPort) => Promise<T>): Promise<T> {
    for (let attempt = 1; ; attempt += 1) {
      try {
        return await fn(await port());
      } catch (thrown) {
        const err = normaliseError(thrown);
        if (err instanceof YazhiApiError && err.retryable && attempt < attempts) {
          await sleep(backoffDelay(attempt, options, err.headers));
          continue;
        }
        throw err;
      }
    }
  }

  /** Wrap a stream so a retryable failure before the first byte is retried,
      and an in-band { error } chunk is thrown as a YazhiApiError. */
  function streamed(start: (p: YazhiApiPort) => AsyncIterable<RunChunk>): AsyncIterable<RunChunk> {
    return {
      async *[Symbol.asyncIterator]() {
        let started = false;
        for (let attempt = 1; ; attempt += 1) {
          try {
            const p = await port();
            for await (const chunk of start(p)) {
              started = true;
              // the server reports a mid-stream failure as a line, not a status
              if ("error" in chunk && typeof chunk.error === "string") {
                throw new YazhiApiError(502, { error: chunk.error, code: "upstream_error" });
              }
              yield chunk;
            }
            return;
          } catch (thrown) {
            const err = normaliseError(thrown);
            // once bytes have flowed a retry would duplicate text and answers
            if (
              !started &&
              err instanceof YazhiApiError &&
              err.retryable &&
              attempt < attempts
            ) {
              await sleep(backoffDelay(attempt, options, err.headers));
              continue;
            }
            throw err;
          }
        }
      },
    };
  }

  return {
    kind: clientKind(source),
    health: (opts) => call((p) => p.health(opts)),
    agents: (opts) => call((p) => p.agents(opts)),
    listBubbles: (query, opts) => call((p) => p.listBubbles(query, opts)),
    getBubble: (name, version, opts) => call((p) => p.getBubble(name, version, opts)),
    publishBubble: (input, opts) => call((p) => p.publishBubble(input, opts)),
    reviewBubble: (name, input, opts) => call((p) => p.reviewBubble(name, input, opts)),
    withdrawBubble: (name, input, opts) => call((p) => p.withdrawBubble(name, input, opts)),
    validateManifest: (manifest, opts) => call((p) => p.validateManifest(manifest, opts)),
    runBubble: (manifest, messages, opts) => streamed((p) => p.runBubble(manifest, messages, opts)),
    translate: (locale, entries, opts) => streamed((p) => p.translate(locale, entries, opts)),
    openApi: (opts) => call((p) => p.openApi(opts)),
  };
}

/** Read a run stream to a single string — the common case ("give me the
    answer"). Use runBubble's iterator directly to show text as it arrives. */
export async function collectRun(chunks: AsyncIterable<RunChunk>): Promise<string> {
  let out = "";
  for await (const chunk of chunks) {
    if ("text" in chunk) out += chunk.text;
    else if ("done" in chunk) break;
  }
  return out;
}

/** Re-exported for callers that want to build their own port. */
export { httpPort } from "./ports";
export type { CallOptions, HttpPortOptions, YazhiApiPort } from "./ports";
export type {
  ApiErrorBody,
  ApiErrorCode,
  BubbleVersion,
  HealthResponse,
  ListBubblesResponse,
  ManifestCheckResult,
  PublishResponse,
  RunChunk,
  RunTurn,
  WithdrawResponse,
} from "./types";
