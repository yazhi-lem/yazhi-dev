/** The Yazhi API (v1) — the wire types.

    Every route under src/app/api/{health,agents,bubbles,manifest,openapi.json}
    speaks these shapes, and so does the typed client in ./client.ts. They are
    plain data (no imports that reach Node or React), so a browser bundle, a
    Route Handler and an outside partner all share one definition.

    Conventions, fixed in docs/team/ROUTE-CONTRACTS-20261109.md §B:
    - every JSON error is { error: string, code?: string } with an HTTP status
    - every NDJSON/SSE stream line is { text } | { error } | { done: true }
    - paths are unversioned in the Next app; the documented public surface is
      `v1`, emitted by /api/openapi.json with version "1.0.0".

    Tamil and other non-English strings in this surface (bubble names,
    descriptions) are user content, not UI copy; UI copy is owned by the
    i18n catalogue. */

import type { AnyBubbleManifest } from "@yazhi/bubble/lib/manifest";

/** The public API version. Bump the minor for additive changes, the major
    for a breaking one; /api/openapi.json reports it as `version`. */
export const API_VERSION = "1.0.0";

/** The manifest schema the registry publishes. Re-exported from the package
    so there is one definition of the string. */
export { BUBBLE_SCHEMA_V1 } from "@yazhi/bubble/lib/manifest";

/** Locale tags, BCP-47 prefix-form ("ta", "en", "hi"). The i18n catalogue
    owns the typed `Locale` union; this surface deliberately stays a string
    so a partner can ask for a language yazhi.dev does not translate yet and
    get a documented "no translation" answer rather than a 400. */
export type LocaleTag = string;

/** The locales yazhi.dev can serve copy in today, in display order.
    Tamil is the default — do not reorder without changing DEFAULT_LOCALE. */
export const LOCALES: readonly LocaleTag[] = ["ta", "en", "hi"] as const;
export const DEFAULT_LOCALE: LocaleTag = "ta";

/** Bubble lifecycle, mirroring yazhi-api's bubbles.proto BubbleStatus. */
export type BubbleStatus = "in_review" | "published" | "rejected" | "withdrawn";

export const BUBBLE_STATUSES: readonly BubbleStatus[] = [
  "in_review",
  "published",
  "rejected",
  "withdrawn",
] as const;

/** Who may see a version. private = the author and maintainers only,
    mirroring bubbles.proto BubbleVisibility. */
export type Visibility = "public" | "private";

export const VISIBILITIES: readonly Visibility[] = ["public", "private"] as const;

/** One stored, versioned manifest — bubbles.proto BubbleVersion, with the
    manifest carried inline. Timestamps are ISO 8601 UTC strings. */
export interface BubbleVersion {
  /** stable id of this version row; "<name>@<version>" in the in-memory store */
  id: string;
  /** the bubble's registry name (its manifest id) */
  name: string;
  /** MAJOR.MINOR.PATCH */
  version: string;
  authorAccountId: string;
  visibility: Visibility;
  status: BubbleStatus;
  manifest: AnyBubbleManifest;
  /** HMAC-SHA256 over the canonical manifest JSON, base64url.
      Absent when YAZHI_REGISTRY_SECRET is unset ("unsigned"). */
  signature?: string;
  /** set on approve/reject; equals authorAccountId is impossible by rule */
  reviewedByAccountId?: string;
  reviewDecision?: "approve" | "reject";
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

/** The caller as the API saw them — never includes tokens or the system
    prompt of anything. Both routes and in-process ports fill this in. */
export interface ApiCaller {
  /** Circle account id (IAM person), or null when anonymous */
  accountId: string;
  /** email when known; used only for YAZHI_MAINTAINERS matching */
  email?: string;
  /** true when the account is in YAZHI_MAINTAINERS */
  maintainer?: boolean;
}

/* ── GET /api/health ─────────────────────────────────────────────────── */

export type RuntimeName = "device" | "yazhi-api";

export interface HealthResponse {
  status: "ok";
  /** API_VERSION */
  version: string;
  i18n: { locales: LocaleTag[]; default: LocaleTag };
  bubble: { schema: "yazhi.bubble"; version: string };
  runtimes: RuntimeName[];
  /** the allow-listed yazhi-api models (YAZHI_BUBBLE_MODELS, default ["adhan"]) */
  models: string[];
}

/* ── GET /api/agents ─────────────────────────────────────────────────── */

/** A public description of an agent — deliberately WITHOUT its system
    prompt, greeting or persona notes (those leak the rules it must keep). */
export interface AgentSummary {
  id: string;
  name: string;
  taName?: string;
  provider: "adhan" | "gemini" | "openai";
  model: string;
  /** true when a Tamil display name exists (draft until native review) */
  hasTa: boolean;
}

export interface AgentsResponse {
  agents: AgentSummary[];
}

/* ── POST /api/manifest/validate ─────────────────────────────────────── */

/** Same shape as ManifestCheck in @yazhi/bubble/lib/manifest. Declared here
    too because it is part of the wire contract. */
export interface ManifestCheckResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  detected: {
    schema: string;
    name?: string;
    version?: string;
    languages?: string[];
  };
}

export interface ValidateManifestRequest {
  manifest: unknown;
}

/* ── POST /api/bubbles ───────────────────────────────────────────────── */

export interface PublishInput {
  manifest: unknown;
  /** defaults to "public" (bubbles.proto treats UNSPECIFIED as PUBLIC) */
  visibility?: Visibility;
}

/** 201 body. additions like `warnings` are additive to the contract and were
    agreed with the Lead (ROUTE-CONTRACTS §B: signature/key status notes). */
export interface PublishResponse {
  version: BubbleVersion;
  /** e.g. ["unsigned"] when YAZHI_REGISTRY_SECRET is unset */
  warnings?: string[];
}

/* ── GET /api/bubbles ────────────────────────────────────────────────── */

export interface ListBubblesQuery {
  /** free-text match over name, description and domain (case-insensitive) */
  q?: string;
  /** BCP-47 prefix match on manifest.languages ("ta" matches "ta-IN") */
  lang?: string;
  /** manifest.domain */
  domain?: string;
  /** exact status filter */
  status?: BubbleStatus;
  /** true = only what the caller authored */
  mine?: boolean;
  /** ≤ 200, default 50 */
  pageSize?: number;
  /** opaque cursor from a previous response */
  pageToken?: string;
}

export interface ListBubblesResponse {
  bubbles: BubbleVersion[];
  /** absent when the listing is complete */
  nextPageToken?: string;
}

/* ── GET /api/bubbles/<name> ─────────────────────────────────────────── */

export interface GetBubbleQuery {
  /** empty/absent = the latest version the caller may see */
  version?: string;
}

/* ── POST /api/bubbles/<name>/reviews ────────────────────────────────── */

export interface ReviewInput {
  version: string;
  decision: "approve" | "reject";
  /** required on reject (and on withdraw), ≤ 2000 characters */
  note?: string;
}

/* ── POST /api/bubbles/<name>/withdraw ───────────────────────────────── */

export interface WithdrawInput {
  /** absent = every version not yet withdrawn */
  version?: string;
  reason?: string;
}

export interface WithdrawResponse {
  withdrawn: BubbleVersion[];
}

/* ── POST /api/bubble/run ────────────────────────────────────────────── */

export interface RunTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RunRequest {
  /** the bubble's manifest — v0 or v1; it is run, not necessarily published */
  manifest: unknown;
  messages: RunTurn[];
  /** optional: the client's preferred wire format for the response.
      Server-side the ?format=sse query parameter wins. */
  format?: StreamFormat;
}

/* ── /api/translate — implemented by i18n-core (src/lib/translate-core.ts) ──
 *
 *  The kernel's typed client keeps the simple `{ key, source }` spelling, which
 *  translate-core accepts alongside its own `{ key, text }`. The response shape
 *  below matches what the route actually returns — `translations`, not
 *  `results` — so a caller of the HTTP port and a caller of the in-process port
 *  see the same object. */

export interface TranslateEntryInput {
  /** stable key in the site catalogue, e.g. "site.nav.guardian" */
  key: string;
  /** the text to translate (translate-core also calls this `text`) */
  source: string;
  context?: string;
}

export interface TranslateRequest {
  locale: LocaleTag;
  entries: TranslateEntryInput[];
  format?: StreamFormat;
}

export interface TranslateHit {
  key: string;
  text: string;
  /** "tm"/"reviewed" are reviewed; "ai"/"mt" are drafts */
  origin: "tm" | "reviewed" | "ai" | "mt";
  /** true for every draft — a draft is never presented as reviewed */
  reviewRequired: boolean;
}

/** 200 body of POST /api/translate.
    `warnings` carries `"translation memory unavailable: no provider
    configured"` when no provider is set — that case is a **200**, not an
    error, and every entry is then a draft with `reviewRequired: true`. */
export interface TranslateResponse {
  locale: LocaleTag;
  translations: TranslateHit[];
  warnings: string[];
}

/** 200 body of GET /api/translate — a translation-memory lookup. A miss is
    `text: null`, never an error. */
export interface TranslateLookupResponse {
  source: string;
  locale: LocaleTag;
  text: string | null;
  origin: "tm" | "reviewed" | null;
}

/* ── Streaming ───────────────────────────────────────────────────────── */

/** ?format=sse streams text/event-stream instead of NDJSON. */
export type StreamFormat = "ndjson" | "sse";

/** One line of an NDJSON response or one `data:` event of an SSE response.
    Identical to today's ChatChunk, so every existing reader keeps working. */
export type RunChunk = { text: string } | { error: string } | { done: true };

/* ── Errors ──────────────────────────────────────────────────────────── */

/** Machine-readable error codes. The HTTP status says the category; the
    code says the exact case, and is stable across versions. */
export type ApiErrorCode =
  | "bad_request"
  | "invalid_json"
  | "invalid_manifest"
  | "unauthorized"
  | "forbidden"
  | "cross_site"
  | "not_maintainer"
  | "self_review"
  | "withdraw_reviewed"
  | "not_found"
  | "version_conflict"
  | "not_owner"
  | "too_large"
  | "rate_limited"
  | "not_configured"
  | "upstream_error"
  | "internal";

/** The body of every non-2xx JSON response. */
export interface ApiErrorBody {
  error: string;
  code?: ApiErrorCode;
  /** optional: which field or parameter caused it ("name", "pageToken", …) */
  field?: string;
}
