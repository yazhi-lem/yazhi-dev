# Route contracts — the Yazhi API (v1) and the `/app` BFF

These shapes are **fixed**. Implementing team members build to them; changing one needs
the Lead's sign-off (post on the task). Every JSON error is
`{ "error": string, "code"?: string }` with an HTTP status. Every NDJSON stream line is
`{ "text": string }`, `{ "error": string }` or `{ "done": true }` — same as today's
`ChatChunk` in `src/lib/chat/types.ts` — so existing readers keep working.

Versioning: paths are unversioned (`/api/...`) in the Next app; the **documented public
surface is `v1`** and is emitted by `/api/openapi.json` (`version: "1.0.0"`).

---

## A. Translated content — owner `i18n-core`

### `GET /api/translate?locale=hi&q=<source text>`  (TM lookup; public, cached)
`{ "source": string, "locale": Locale, "text": string | null, "origin":
"tm" | "reviewed" | null }`

### `POST /api/translate`  (AI draft into the translation memory; Circle-gated)
Body `{ "locale": Locale, "entries": [{ "key": string, "source": string,
"context"?: string }] }` (≤ 200 entries, ≤ 2000 chars each).
→ 200 `{ "translation": string }` when `locale === "en"` and `TM` hits (server path),
or `{ "results": [{ "key": string, "text": string, "origin": "tm"|"ai"|"mt" }] }`.
Saved as `origin: "ai"` with `reviewRequired: true` — **never** served as `reviewed`.
→ 401 without a Circle session; 429 over the daily budget. Same-origin check required
(copy `sameOrigin` from `src/lib/circle/session.ts`).

Provider precedence (server env, first present wins): `YAZHI_TRANSLATE_URL` +
`YAZHI_TRANSLATE_KEY` (OpenAI-compatible chat endpoint), else `YAZHI_API_URL`. With none
set: 503 `{ "error": "...not configured" }` — degrade, never crash.

## B. Weave kernel (the API) — owner `api-kernel`

Types: `src/lib/api/types.ts`. Client: `src/lib/api/client.ts` (`createClient`,
`YazhiApiError`). Ports: `src/lib/api/ports.ts`. Every route below accepts
`?format=sse` to stream as `text/event-stream` instead of NDJSON; default NDJSON.

### `GET /api/health`
→ 200 `{ "status": "ok", "version": string, "i18n": { "locales": Locale[], "default": Locale },
"bubble": { "schema": "yazhi.bubble", "version": string }, "runtimes": ["device","yazhi-api"],
"models": string[] }` — `models` = the allow-listed yazhi-api models (today
`YAZHI_BUBBLE_MODELS`, default `["adhan"]`).

### `GET /api/agents` → 200 `{ "agents": AgentSummary[] }`
`AgentSummary` = `{ id, name, taName?, provider, model, hasTa: boolean }` from
`src/lib/chat/agents.ts` — **never** the system prompt (leak risk).

### `POST /api/bubbles` — publish a version (Circle-gated, same-origin)
Body `{ "manifest": object, "visibility"?: "public"|"private" }`.
Server-side: `validateManifest` + `validateManifestV1`; bump/verify semver; stamp
`author.circleAccountId` from the session, `signature` by the registry; status
`in_review`. → 201 `{ "version": BubbleVersion }`.
`BubbleVersion` = `{ id, name, version, authorAccountId, visibility: "public"|"private",
status: "in_review"|"published"|"rejected"|"withdrawn", manifest, signature?,
reviewedByAccountId?, reviewDecision?: "approve"|"reject", reviewNote?, createdAt, updatedAt }`.

### `GET /api/bubbles` → 200 `{ "bubbles": BubbleVersion[], "nextPageToken"?: string }`
Query: `q`, `lang` (BCP-47 prefix match on `languages`), `domain`, `status`, `mine`, `pageSize` (≤200), `pageToken`.
Visibility: published+public, or the caller's own, or all for `community.maintainer`.

### `GET /api/bubbles/<name>?version=` → 200 `BubbleVersion` | 404 (never 403 for invisible).

### `POST /api/bubbles/<name>/reviews` — maintainer decision (Circle + `community.maintainer`)
Body `{ "version": string, "decision": "approve"|"reject", "note"?: string }`
(reject/withdraw notes required, ≤2000 chars; nobody reviews their own bubble → 403).
→ 200 `BubbleVersion`.

### `POST /api/bubbles/<name>/withdraw` — author or maintainer
Body `{ "version"?: string, "reason"?: string }` → 200 `{ "withdrawn": BubbleVersion[] }`.

### `POST /api/manifest/validate` — public, no session, no network
Body `{ "manifest": unknown }` → 200 `{ "ok": boolean, "errors": string[], "warnings": string[],
"detected": { "schema": string, "name"?: string, "version"?: string, "languages"?: string[] } }`.

### `POST /api/bubble/run` — **exists**; do not change its behaviour
api-kernel adds only a typed client wrapper (`src/lib/api/bubble.ts`) and documents it.
The `/app` BFF may forward to it.

### `GET /api/openapi.json` → 200 an OpenAPI 3.1 document for every route in this file
(each operation: summary, security, request/response schemas, an example). The page at
`/bubble#api` and `docs/API.md` are generated from / must match it.

### Amendments (Lead, after api-kernel's questions — binding)

- **Maintainer** = a caller whose Circle account id or email is listed in
  `YAZHI_MAINTAINERS` (comma-separated, emails compared case-insensitively). Unset → nobody
  is a maintainer (fail-closed, 403 `code:"not_maintainer"`). Nobody reviews their own
  bubble (403 `code:"self_review"`). Real source will be the `community.maintainer` IAM
  role via yazhi-api (`domains/community/bubbles.py:120`) — leave a TODO naming it.
- **`localPort()` is async**: `localPort(): Promise<YazhiApiPort>`; `httpPort(url)` stays
  sync; `createClient(port | url | (() => Promise<YazhiApiPort>))` resolves lazily.
  `client.ts`/`ports.ts` must never import `server-only` or `node:*`.
- **Visibility mirrors `bubbles.proto`**: published+public ∪ caller's own (any status) ∪
  maintainer (in_review); everything else 404.
- **gRPC registry is a documented stub** (`registry-grpc.ts`, 503), selected only when
  `YAZHI_GRPC_TARGET` and `YAZHI_REGISTRY_GRPC=1`; default path is the in-memory registry.
- The `/api/bubble/run` validation constants are shared, not copied, between the existing
  route and the in-process port.

### Registry storage
`src/lib/api/registry.ts`: interface + an in-memory implementation behind
`getRegistry()` that auto-switches to the yazhi-api `YazhiBubbles` gRPC client when
`YAZHI_GRPC_TARGET` is set (mirror `src/lib/circle/client.ts`). Storage itself is NOT in
scope; the seam is. Signing: HMAC-SHA256 over canonical JSON with
`YAZHI_REGISTRY_SECRET`, exposed as `signManifest`/`verifyManifest`; **absent secret →
`signature` omitted and `warnings: ["unsigned"]`**, never a crash.

## C. `/app` BFF — owner `bubble-ui`

`/app` is the Bubble UI host. It may reuse B and A; it must not add secrets to the
client bundle. Any new server route it needs lives under `src/app/api/app/**`.
Runs go through the browser → localhost (device runtime) or `/api/bubble/run`
(yazhi-api runtime) exactly as `/bubble` does today.
