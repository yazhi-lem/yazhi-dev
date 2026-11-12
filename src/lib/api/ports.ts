/** YazhiApiPort — the shape a port must have, plus the HTTP port.
 *
 *  Everything above this file talks to the API through one interface:
 *    httpPort(baseUrl)  fetch() any deployment (a partner, a mirror, this site)
 *    localPort()        in-process on the yazhi.dev server — see ./ports-local
 *
 *  This module is deliberately CLIENT-SAFE and has no static edge to any
 *  server module. Turbopack's client-graph checker follows value edges, so an
 *  `import("./local-port")` living here — even a dynamic one — put
 *  `@/lib/circle/session` (server-only) on the client graph the moment a
 *  client component imported `@/lib/api/client`. `localPort()` therefore lives
 *  in ./ports-local, which is the only module that names ./local-port.
 *
 *  Usage from a client component (see /app):
 *
 *    import { createClient } from "@/lib/api/client";
 *    const client = createClient("/");                 // HTTP, same origin
 *    for await (const chunk of client.runBubble(manifest, turns)) { ... }
 *
 *  Server-side code that wants no HTTP hop imports localPort from
 *  "@/lib/api/ports-local".
 */

import type {
  AgentSummary,
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
  StreamFormat,
  TranslateEntryInput,
  TranslateResponse,
  WithdrawInput,
  WithdrawResponse,
} from "./types";

/** Per-call options shared by every port method. */
export interface CallOptions {
  /** "sse" asks the server for text/event-stream. Both wire formats decode to
      the same chunks in the client, so this is a transport preference only. */
  format?: StreamFormat;
  signal?: AbortSignal;
}

export interface YazhiApiPort {
  health(opts?: CallOptions): Promise<HealthResponse>;
  agents(opts?: CallOptions): Promise<AgentSummary[]>;
  listBubbles(query?: ListBubblesQuery, opts?: CallOptions): Promise<ListBubblesResponse>;
  getBubble(name: string, version?: string, opts?: CallOptions): Promise<BubbleVersion>;
  publishBubble(input: PublishInput, opts?: CallOptions): Promise<PublishResponse>;
  reviewBubble(name: string, input: ReviewInput, opts?: CallOptions): Promise<BubbleVersion>;
  withdrawBubble(name: string, input: WithdrawInput | undefined, opts?: CallOptions): Promise<WithdrawResponse>;
  validateManifest(manifest: unknown, opts?: CallOptions): Promise<ManifestCheckResult>;
  /** streamed: { text } chunks then { done: true }, or { error } */
  runBubble(manifest: unknown, messages: RunTurn[], opts?: CallOptions): AsyncIterable<RunChunk>;
  /** streamed: { text } chunks then { done: true }, or { error } */
  translate(locale: string, entries: TranslateEntryInput[], opts?: CallOptions): AsyncIterable<RunChunk>;
  /** the OpenAPI 3.1 document, for docs tooling and partner import */
  openApi(opts?: CallOptions): Promise<unknown>;
}

/* ── httpPort ───────────────────────────────────────────────────────── */

export interface HttpPortOptions {
  /** Extra headers on every request (e.g. an API key for a partner). */
  headers?: Record<string, string>;
  /** fetch to use; defaults to the global fetch (injected in tests) */
  fetchImpl?: typeof fetch;
  /** prefix prepended to every path; default "" (baseUrl already ends at /api) */
  pathPrefix?: string;
}

const join = (baseUrl: string, path: string) => `${baseUrl.replace(/\/+$/, "")}${path}`;

function headersToObject(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

/** Decode a Response body that is NDJSON or SSE into chunks. Shared by
    httpPort and the typed client. */
export async function* decodeStream(body: ReadableStream<Uint8Array>): AsyncIterable<RunChunk> {
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
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        const chunk = parseLine(line);
        if (chunk) yield chunk;
      }
    }
    const tail = parseLine(buffer);
    if (tail) yield tail;
  } finally {
    reader.releaseLock();
  }
}

/** Local copy of the line parser, so ports.ts has no import the client bundle
    would object to; sse.ts exports the same rules and the tests compare them. */
function parseLine(line: string): RunChunk | null {
  let payload = line.trim();
  if (!payload) return null;
  if (payload.startsWith("data:")) payload = payload.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const value = JSON.parse(payload) as { text?: unknown; error?: unknown; done?: unknown };
    if (typeof value?.text === "string") return { text: value.text };
    if (typeof value?.error === "string") return { error: value.error };
    if (value?.done === true) return { done: true };
    return null;
  } catch {
    return null;
  }
}

/** A port over an HTTP deployment of the Yazhi API. Paths are the contract's
    unversioned /api/... paths; pass the base URL that ends at (or before)
    /api. */
export function httpPort(baseUrl: string, options: HttpPortOptions = {}): YazhiApiPort {
  const doFetch = options.fetchImpl ?? fetch;
  const prefix = options.pathPrefix ?? "";

  async function requestJson<T>(path: string, init: RequestInit = {}, opts: CallOptions = {}): Promise<T> {
    const res = await doFetch(join(baseUrl, `${prefix}${path}`), {
      ...init,
      headers: { ...(options.headers ?? {}), ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers ?? {}) },
      signal: opts.signal,
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) throw new HttpResponseError(res.status, text, headersToObject(res.headers));
    return (text ? JSON.parse(text) : null) as T;
  }

  function stream(path: string, body: unknown, opts: CallOptions = {}): AsyncIterable<RunChunk> {
    // an async generator so the fetch starts when the caller iterates, and a
    // non-2xx is thrown into the loop rather than dangling unobserved
    return (async function* () {
      const res = await doFetch(join(baseUrl, `${prefix}${path}`), {
        method: body === undefined ? "GET" : "POST",
        headers: {
          ...(options.headers ?? {}),
          Accept: "application/x-ndjson, text/event-stream",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: opts.signal,
        cache: "no-store",
      });
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new HttpResponseError(res.status, text, headersToObject(res.headers));
      }
      yield* decodeStream(res.body);
    })();
  }

  return {
    async health(opts) {
      return requestJson<HealthResponse>("/api/health", {}, opts);
    },
    async agents(opts) {
      const body = await requestJson<{ agents: AgentSummary[] }>("/api/agents", {}, opts);
      return body.agents;
    },
    async listBubbles(query = {}, opts) {
      const params = new URLSearchParams();
      if (query.q) params.set("q", query.q);
      if (query.lang) params.set("lang", query.lang);
      if (query.domain) params.set("domain", query.domain);
      if (query.status) params.set("status", query.status);
      if (query.mine !== undefined) params.set("mine", String(query.mine));
      if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));
      if (query.pageToken) params.set("pageToken", query.pageToken);
      const qs = params.toString();
      return requestJson<ListBubblesResponse>(`/api/bubbles${qs ? `?${qs}` : ""}`, {}, opts);
    },
    async getBubble(name, version, opts) {
      const qs = version ? `?version=${encodeURIComponent(version)}` : "";
      return requestJson<BubbleVersion>(`/api/bubbles/${encodeURIComponent(name)}${qs}`, {}, opts);
    },
    async publishBubble(input, opts) {
      return requestJson<PublishResponse>("/api/bubbles", { method: "POST", body: JSON.stringify(input) }, opts);
    },
    async reviewBubble(name, input, opts) {
      return requestJson<BubbleVersion>(
        `/api/bubbles/${encodeURIComponent(name)}/reviews`,
        { method: "POST", body: JSON.stringify(input) },
        opts
      );
    },
    async withdrawBubble(name, input, opts) {
      return requestJson<WithdrawResponse>(
        `/api/bubbles/${encodeURIComponent(name)}/withdraw`,
        { method: "POST", body: JSON.stringify(input ?? {}) },
        opts
      );
    },
    async validateManifest(manifest, opts) {
      return requestJson<ManifestCheckResult>(
        "/api/manifest/validate",
        { method: "POST", body: JSON.stringify({ manifest }) },
        opts
      );
    },
    runBubble(manifest, messages, opts) {
      return stream("/api/bubble/run", { manifest, messages }, opts);
    },
    translate(locale, entries, opts) {
      // The route returns one JSON object, not a stream (i18n-core's design).
      // The port contract is a chunk stream, so decode it into one: a { text }
      // per translation, then { done: true } — the same shape the in-process
      // port yields, so a caller cannot tell which side it is on.
      return (async function* () {
        // GET is a lookup; POST writes into the memory. translate() is the
        // POST path — it is Circle-gated, like the route.
        const res = await doFetch(join(baseUrl, `${prefix}/api/translate`), {
          method: "POST",
          headers: { ...(options.headers ?? {}), "Content-Type": "application/json" },
          body: JSON.stringify({ locale, entries }),
          signal: opts?.signal,
          cache: "no-store",
        });
        const text = await res.text();
        if (!res.ok) throw new HttpResponseError(res.status, text, headersToObject(res.headers));
        const body = (text ? JSON.parse(text) : {}) as {
          translations?: { text?: string }[];
          warnings?: string[];
        };
        for (const hit of body.translations ?? []) {
          if (typeof hit.text === "string") yield { text: hit.text } as RunChunk;
        }
        yield { done: true } as RunChunk;
      })();
    },
    async openApi(opts) {
      return requestJson<unknown>("/api/openapi.json", {}, opts);
    },
  };
}

/** The port throws this for a non-2xx response; the typed client turns it into
    a YazhiApiError so callers have one error type whatever the port. */
export class HttpResponseError extends Error {
  readonly status: number;
  readonly body: string;
  readonly headers: Record<string, string>;

  constructor(status: number, body: string, headers: Record<string, string> = {}) {
    super(`HTTP ${status}`);
    this.name = "HttpResponseError";
    this.status = status;
    this.body = body;
    this.headers = headers;
  }
}
