import "server-only";

/** The in-process port's implementation. Loaded only by `localPort()` in
 *  ./ports-local, through a dynamic import, so this file (and the `"use
 *  server"` handler modules under ./handlers) never enter a browser bundle.
 *  Nothing else in src/lib/api names this file, which is what keeps the
 *  client graph free of the Circle session module.
 *
 *  What it does differently from httpPort:
 *   - it calls the SAME handler cores the routes call, so responses cannot
 *     drift between in-process and HTTP
 *   - the caller comes from the live Circle session (currentAccount()), the
 *     same source the routes use
 *   - same-origin always holds (the call never left the process)
 *   - streams are handed over as async iterables, not bytes on a socket
 */

import { currentAccount } from "@/lib/circle/session";
import { CircleCallError } from "@/lib/circle/client";
import { isMaintainer } from "./maintainers";
import type { Caller } from "./handlers/core";
import type { YazhiApiPort } from "./ports";
import type { RunChunk, RunTurn } from "./types";
import { YazhiApiError } from "./error";

/** Resolve the signed-in caller for an in-process call. A Circle outage is
    reported as a 503 YazhiApiError, mirroring the HTTP adapter. */
async function caller(): Promise<Caller | null> {
  try {
    const account = await currentAccount();
    if (!account) return null;
    return {
      accountId: account.accountId,
      name: account.fullName,
      email: account.email,
      maintainer: isMaintainer({ accountId: account.accountId, email: account.email }),
    };
  } catch (err) {
    const message = err instanceof CircleCallError ? err.message : "Circle session check failed.";
    throw new YazhiApiError(503, { error: message, code: "upstream_error" });
  }
}

/** Build a JSON handler call and unwrap its result, raising the same
    YazhiApiError an HTTP caller would get for the same status. */
async function runJson<T>(
  handler: import("./handlers/core").Handler,
  input: Partial<import("./handlers/core").HandlerInput>
): Promise<T> {
  const { baseInput } = await import("./handlers/core");
  const full = baseInput({
    caller: await caller(),
    query: new URLSearchParams(),
    format: "ndjson",
    allowedOrigin: true,
    ...input,
  });
  const result = await handler(full);
  if (result.kind !== "json") throw new YazhiApiError(500, { error: "Expected a JSON response.", code: "internal" });
  if (result.status >= 400) {
    const body = result.body as { error?: string; code?: string };
    throw new YazhiApiError(result.status, { error: body.error ?? "Request failed.", code: body.code as never });
  }
  return result.body as T;
}

const streamFormatOf = (format: string | undefined) => (format === "sse" ? "sse" : "ndjson");

export async function localPortImpl(): Promise<YazhiApiPort & { readonly kind: "local" }> {
  const [healthHandler, agentsHandler, manifestHandler] = await Promise.all([
    import("./handlers/health"),
    import("./handlers/agents"),
    import("./handlers/manifest"),
  ]);
  const { getRegistry } = await import("./registry");
  const { signManifest } = await import("./signing");

  function streamOf(chunks: AsyncIterable<RunChunk>): AsyncIterable<RunChunk> {
    return chunks;
  }

  return {
    kind: "local",

    health: async (opts) => {
      void opts;
      return runJson(healthHandler.health, {});
    },

    agents: async (opts) => {
      void opts;
      const body = await runJson<{ agents: import("./types").AgentSummary[] }>(agentsHandler.agents, {});
      return body.agents;
    },

    listBubbles: async (query = {}, opts) => {
      void opts;
      const { listBubbles } = await import("./handlers/list");
      const params = new URLSearchParams();
      if (query.q) params.set("q", query.q);
      if (query.lang) params.set("lang", query.lang);
      if (query.domain) params.set("domain", query.domain);
      if (query.status) params.set("status", query.status);
      if (query.mine !== undefined) params.set("mine", String(query.mine));
      if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));
      if (query.pageToken) params.set("pageToken", query.pageToken);
      return runJson(listBubbles, { query: params });
    },

    getBubble: async (name, version, opts) => {
      void opts;
      const { getBubble } = await import("./handlers/get");
      const params = new URLSearchParams();
      if (version) params.set("version", version);
      return runJson(getBubble, { params: { name }, query: params });
    },

    publishBubble: async (input, opts) => {
      void opts;
      const { publishBubble } = await import("./handlers/publish");
      return runJson(publishBubble, { body: JSON.stringify(input) });
    },

    reviewBubble: async (name, input, opts) => {
      void opts;
      const { reviewBubble } = await import("./handlers/review");
      return runJson(reviewBubble, { params: { name }, body: JSON.stringify(input) });
    },

    withdrawBubble: async (name, input, opts) => {
      void opts;
      const { withdrawBubble } = await import("./handlers/withdraw");
      return runJson(withdrawBubble, { params: { name }, body: JSON.stringify(input ?? {}) });
    },

    validateManifest: async (manifest, opts) => {
      void opts;
      return runJson(manifestHandler.validateManifestHandler, { body: JSON.stringify({ manifest }) });
    },

    runBubble: (manifest, messages: RunTurn[], opts) => {
      return (async function* () {
        const { runBubble } = await import("./handlers/run");
        const { baseInput } = await import("./handlers/core");
        const input = baseInput({
          caller: await caller(),
          body: JSON.stringify({ manifest, messages }),
          format: streamFormatOf(opts?.format),
          allowedOrigin: true,
        });
        const result = await runBubble(input);
        if (result.kind !== "stream") {
          const body = result.body as { error?: string; code?: string };
          throw new YazhiApiError(result.status, { error: body.error ?? "Run failed.", code: body.code as never });
        }
        yield* streamOf(result.chunks);
      })();
    },

    translate: (locale, entries, opts) => {
      return (async function* () {
        void opts;
        // i18n-core owns POST /api/translate; ./handlers/translate.ts is only
        // the kernel's view of it. In-process, call the real implementation
        // and stream its translations as chunks — one { text } per entry, then
        // { done: true } — matching every other streaming method here.
        //
        // An unconfigured provider is NOT an error: translatePost answers with
        // its honest fallback and a warning, exactly as the HTTP route does.
        const { translatePost } = await import("@/lib/translate");
        const { parseTranslatePost } = await import("@/lib/translate-core");

        // the typed client sends {key, source}; translate-core accepts either
        // `strings` or `entries`, and either `text` or `source`
        const parsed = parseTranslatePost({ locale, entries });
        if (!parsed.ok) {
          throw new YazhiApiError(parsed.status, { error: parsed.error, code: "bad_request" });
        }
        if (!(await caller())) {
          throw new YazhiApiError(401, {
            error: "Sign in with a Circle account to translate into the memory.",
            code: "unauthorized",
          });
        }
        const body = await translatePost(parsed.value);
        for (const result of body.translations) {
          yield { text: result.text } as RunChunk;
        }
        yield { done: true } as RunChunk;
      })();
    },

    async openApi() {
      const { openApiDocument } = await import("./openapi");
      return openApiDocument();
    },
  };
}
