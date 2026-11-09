/** Server configuration the API kernel reads, in one place.

    Every function here reads process.env at call time, not at module load, so
    a test can set a variable, call, and restore it — and so nothing is baked
    into a bundle.

    `server-only` is deliberately NOT imported: this module's callers are the
    server handlers (which are `"use server"` and therefore server-only
    themselves). Keeping the guard in the handler layer means `client.ts` and
    `ports.ts` — which must stay client-safe — never transitively reach this
    file except through a dynamic import on the server. */

/** Models a bubble may run on through yazhi-api. Sovereign models only — a
    bubble cannot name a foreign provider's model and have yazhi.dev relay to
    it. Mirrors src/app/api/bubble/run/route.ts, which owns the same rule for
    that route; this copy is what /api/health reports and what the in-process
    run port enforces. Override with YAZHI_BUBBLE_MODELS="adhan,adhan-kutty". */
export function allowedModels(): string[] {
  const configured = (process.env.YAZHI_BUBBLE_MODELS ?? "adhan")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return configured.length ? configured : ["adhan"];
}

export function allowedModelSet(): Set<string> {
  return new Set(allowedModels());
}

/** Turn limits for /api/bubble/run. The route in
    src/app/api/bubble/run/route.ts declares the same two numbers as local
    consts (40 and 8000); it is frozen by docs/team/BOUNDARIES-20261109.md, so
    the kernel mirrors rather than imports them. If you change one, change
    both — or, better, make the route import these when the Lead reopens it.

    TODO(api-kernel refactor, Lead 2026-11-09 #4): after this round, change
    src/app/api/bubble/run/route.ts to `import { MAX_TURNS, MAX_TURN_CHARS }
    from "@/lib/api/env"` and delete its local consts, so there is exactly one
    number. Deferred because that route is frozen for this round. */
export const MAX_TURNS = 40;
export const MAX_TURN_CHARS = 8000;

/** The most request body the kernel will ever buffer, per route kind.

    These are the transport-level caps enforced by `inputFromRequest()` in
    handlers/http.ts, BEFORE the body is read: an oversized Content-Length is
    refused at once, and a chunked body is aborted as soon as it passes the
    cap. They bound memory on a small box without an authenticated caller
    ever getting to allocate.

    Each is deliberately a little above the semantic limit its handler also
    checks (publish stores a 64 KiB manifest checked by size in
    handlers/publish.ts; validate allows 128 KiB by handlers/manifest.ts), so
    the transport cap never rejects a request the handler would have accepted
    — it only stops a huge one from being read at all. */
export const BODY_LIMITS = {
  /** POST /api/bubbles — {manifest, visibility}; the JSON has wrapper overhead
      and the manifest may be re-serialised, so allow 128 KiB of JSON. */
  publish: 128 * 1024,
  /** POST /api/manifest/validate — the handler's own 128 KiB cap. */
  validate: 128 * 1024,
  /** POST /api/bubble/run — the server keeps the last 40 turns of ≤8000
      characters each, so ~512 KiB of JSON is already far past useful. */
  run: 512 * 1024,
  /** POST /api/bubbles/<name>/{reviews,withdraw} — small JSON bodies. */
  small: 16 * 1024,
  /** default when a route does not say: same as `validate`. */
  default: 128 * 1024,
} as const;

export type BodyLimitKind = keyof typeof BODY_LIMITS;

/** Where the chat completion endpoint lives (see src/lib/chat/backend.ts). */
export function backendConfig(): { url?: string; chatPath: string; configured: boolean } {
  const url = process.env.YAZHI_API_URL;
  return {
    url,
    chatPath: process.env.YAZHI_CHAT_PATH ?? "/v1/chat/completions",
    configured: Boolean(url),
  };
}

/** The bubble registry's gRPC toggle (see registry.ts). */
export function grpcRegistryEnabled(): boolean {
  return Boolean(process.env.YAZHI_GRPC_TARGET) && process.env.YAZHI_REGISTRY_GRPC === "1";
}

/** Whether the registry will sign manifests (YAZHI_REGISTRY_SECRET set). */
export function registrySigningEnabled(): boolean {
  return Boolean(process.env.YAZHI_REGISTRY_SECRET?.trim());
}

/** The translation provider, in precedence order (ROUTE-CONTRACTS §A).
    Owned by i18n-core's route; reported here so the OpenAPI document and
    /api/health can say whether translation is configured without importing
    their handler. */
export function translateConfigured(): boolean {
  return Boolean((process.env.YAZHI_TRANSLATE_URL && process.env.YAZHI_TRANSLATE_KEY) || process.env.YAZHI_API_URL);
}
