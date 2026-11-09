# The Yazhi API (v1)

One typed API the site and every partner call: the bubble registry, health,
agents, runs and translation. The same surface is served three ways —

| Way | What | Where |
|---|---|---|
| **HTTP** | `fetch()` any deployment, over `/api/...` | every path below |
| **In-process** | the same handler cores, no HTTP hop | `localPort()` (`src/lib/api/ports.ts`) |
| **Typed client** | one object, both transports, one error type | `createClient()` (`src/lib/api/client.ts`) |

`GET /api/openapi.json` returns an OpenAPI 3.1 document for every operation
here; this file and that document describe the same routes (a test asserts it).
Implementation lives in `src/lib/api/**`; the routes in `src/app/api/**` are
thin glue over the shared handlers, so the HTTP and in-process paths cannot
drift apart.

**Status.** Everything in §A/§B of
[`docs/team/ROUTE-CONTRACTS-20261109.md`](team/ROUTE-CONTRACTS-20261109.md) is
implemented except where §"Not yet built" says otherwise. The registry's
in-memory store is the default: publishing and browsing work end to end without
yazhi-api. The gRPC store is a stub.

---

## Versioning

- Paths are unversioned (`/api/...`).
- The **documented public surface is `v1`**, reported as `version: "1.0.0"` by
  `/api/health` and `/api/openapi.json`.
- Additive changes bump the minor; removing a field, changing a status code or
  renaming an error `code` bumps the major.
- Manifest schema: `yazhi.bubble/v1` is what the registry publishes.
  `yazhi.bubble/v0` (the original) is still accepted by
  `/api/manifest/validate` and by the shipped `/api/bubble/run`.

## Auth model

| Route | Session | Same-origin | Notes |
|---|---|---|---|
| `GET /api/health` | – | – | public |
| `GET /api/agents` | – | – | public; **no system prompts** |
| `POST /api/manifest/validate` | – | – | public, no network |
| `GET /api/bubbles` | optional | – | bracketed visibility |
| `GET /api/bubbles/<name>` | optional | – | 404, never 403, when invisible |
| `POST /api/bubbles` | **required** | **required** | author stamped from the session |
| `POST /api/bubbles/<name>/reviews` | **required** | **required** | + `community.maintainer` |
| `POST /api/bubbles/<name>/withdraw` | **required** | **required** | author or maintainer |
| `POST /api/bubble/run` | **required** | **required** | unchanged route |
| `POST /api/translate` | **required** | **required** | i18n-core |

- Identity comes from the two httpOnly Circle cookies (`yz_circle_at`,
  `yz_circle_rt`) read by `currentAccount()` in `src/lib/circle/session.ts`.
  **No token is ever sent to a page**, and no page ever holds a server secret —
  `node:crypto` and `process.env` appear only behind `import "server-only"` in
  `src/lib/api/{signing,registry,maintainers,env,local-port}.ts` and the
  handlers. A test enforces this.
- **Maintainers** come from `YAZHI_MAINTAINERS` (comma-separated account ids
  and/or emails, case-insensitive for emails). That stands in for yazhi-api's
  `community.maintainer` IAM role until it is exposed. Fail-closed: unset means
  nobody is a maintainer.
- Partner API keys are **not issued yet**. The typed client accepts `apiKey` and
  sends `Authorization: Bearer`, which is forward-compatible with the day one
  exists.

## Error codes

Every JSON error is `{ "error": string, "code"?: string, "field"?: string }`.
`error` is safe to show to a person; `code` is stable and machine-readable.

| `code` | HTTP | When |
|---|---|---|
| `bad_request` | 400 | a missing or malformed field/parameter |
| `invalid_json` | 400 | the body is not JSON |
| `invalid_manifest` | 400 | the manifest failed validation (errors joined in `error`) |
| `upstream_error` | 502/503 | yazhi-api or Circle unreachable, or a stream failed mid-way |
| `unauthorized` | 401 | no Circle session |
| `cross_site` | 403 | a cross-site Origin on a state-changing route |
| `forbidden` | 403 | a declared permission is missing (e.g. `yazhi-api`) |
| `not_maintainer` | 403 | review without `community.maintainer` |
| `self_review` | 403 | you may not review your own bubble |
| `not_owner` | 403 | another account first published this bubble name |
| `not_found` | 404 | no such bubble **or** invisible to you (never 403 — no enumeration) |
| `version_conflict` | 409 | the version is used, or not greater than the highest stored |
| `too_large` | 413 | manifest > 64 KiB, or a validate body > 128 KiB |
| `rate_limited` | 429 | over a budget |
| `not_configured` | 503 | no translation provider, or the gRPC registry (not wired) |
| `internal` | 500 | a bug; logged, never detailed to the caller |

## Streaming

Only **`POST /api/bubble/run`** streams over HTTP, and it is **NDJSON only**:

| Route | Transport |
|---|---|
| `POST /api/bubble/run` | NDJSON (`text/plain`). **No `?format=sse`** — frozen route, the parameter is ignored |
| `POST /api/translate` | a single JSON object, not a stream (i18n-core's design) |

`/api/bubble/run` predates the kernel and its behaviour is frozen, so it always
answers `Content-Type: text/plain` NDJSON and **ignores `?format=sse`**. The
in-process port (`localPort().runBubble`) yields the same lines as an async
iterable, so server code consumes it identically without a socket.

`POST /api/translate` returns one JSON object (`{ locale, translations[],
warnings[] }`). The typed `translate()` method still hands you a chunk stream:
the ports decode the JSON into one `{ text }` line per translation plus
`{ done: true }`, so translate and runBubble read the same way.

**Stream lines are unchanged from today's `ChatChunk`:**

```
{"text":"..."}     one piece of text
{"error":"..."}    a failure after the stream started
{"done":true}      the end
```

(Today only `/api/bubble/run` streams over HTTP, and it emits NDJSON lines —
one JSON object per line. For a future SSE route, `src/lib/api/sse.ts` encoders
frame each line as `data: <json>\n\n` and close with `data: [DONE]`.)

## Runtimes

A bubble runs on one of two runtimes (`manifest.runtime.prefer`, and the
`runtimes` field of `/api/health`):

- **`device`** — the *browser* talks straight to an OpenAI-compatible model
  server on this machine or the LAN (`llama.cpp`, Ollama, a `yazhi-one` box).
  Works with the network cable pulled. Nothing about it touches this API.
- **`yazhi-api`** — `POST /api/bubble/run` checks the Circle session and
  streams Adhan through yazhi-api. The model must be in `YAZHI_BUBBLE_MODELS`
  (default `["adhan"]`) and the bubble must declare the `yazhi-api` permission.

The host falls back to `device` when offline or when the permission is absent.

---

## Routes

Examples use `curl` against a local deployment (`npm run dev` → :3000) and the
typed client from `src/lib/api/client.ts`.

### `GET /api/health`

Public. Config-driven only — no network call — so it answers the same way
whether yazhi-api is up.

```sh
curl -s localhost:3000/api/health | jq
```
```json
{ "status": "ok", "version": "1.0.0",
  "i18n": { "locales": ["ta", "en", "hi"], "default": "ta" },
  "bubble": { "schema": "yazhi.bubble", "version": "v1" },
  "runtimes": ["device", "yazhi-api"],
  "models": ["adhan"] }
```
```ts
import { createClient } from "@/lib/api/client";
const health = await createClient("/").health();
```

### `GET /api/agents`

Public. `id`, `name`, `taName?`, `provider`, `model`, `hasTa`. **Never** the
system prompt, greeting or persona notes — a prompt is the rules an agent must
keep, and publishing it invites prompt injection.

```sh
curl -s 'localhost:3000/api/agents' | jq '.agents[0]'
# { "id": "pulavar", "name": "Pulavar", "taName": "புலவர்",
#   "provider": "adhan", "model": "adhan", "hasTa": true }
```
```ts
const agents = await client.agents();
```

### `POST /api/manifest/validate`

Public, no session, no network. Accepts `yazhi.bubble/v0` or `/v1` and never
throws on hostile input. `ok` means "publishable as declared"; warnings (e.g.
`"unsigned"`) do not block a publish.

```sh
curl -s -X POST localhost:3000/api/manifest/validate \
  -H 'Content-Type: application/json' \
  -d '{"manifest": {"schema": "yazhi.bubble/v1", "id": "tamil-tutor"}}' | jq
```
```json
{ "ok": false,
  "errors": ["version must be MAJOR.MINOR.PATCH.", "name is required (max 60 characters)."],
  "warnings": ["unsigned"],
  "detected": { "schema": "yazhi.bubble/v1", "name": "tamil-tutor" } }
```
```ts
const check = await client.validateManifest(manifest);
if (!check.ok) console.log(check.errors);
```

### `POST /api/bubbles` — publish a version

Circle + same-origin. The server validates the manifest as v1, stamps
`author.circleAccountId` **from the session** (a body-supplied author is
replaced), requires a `MAJOR.MINOR.PATCH` version that is new and strictly
greater than every stored version, signs it with `YAZHI_REGISTRY_SECRET`, and
stores it `in_review`. The first publisher of a name owns it.

```sh
curl -s -X POST localhost:3000/api/bubbles \
  -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"manifest": {"schema":"yazhi.bubble/v1","id":"tamil-tutor","version":"1.0.0",
                    "name":"Tamil Tutor","description":"A patient Tamil tutor.",
                    "accent":"#d3b36a","size":"m","languages":["ta-IN","en"],
                    "agent":{"systemPrompt":"...","greeting":"வணக்கம்!","fivePosture":true},
                    "runtime":{"prefer":"yazhi-api","model":"adhan","deviceModel":"adhan-kutty"},
                    "permissions":["yazhi-api"],
                    "createdAt":"2026-11-01T00:00:00.000Z","updatedAt":"2026-11-01T00:00:00.000Z"},
       "visibility":"public"}' | jq
```
→ `201 { "version": BubbleVersion, "warnings"?: string[] }`
`warnings` is **additive to the contract and may grow** — ignore codes you do
not recognise rather than failing on them. Today it carries `"unsigned"`
(a manifest stored without `YAZHI_REGISTRY_SECRET`), and the key itself is
omitted when the registry is signing cleanly.
```ts
const { version, warnings } = await client.publishBubble({ manifest, visibility: "public" });
```

`BubbleVersion` = `{ id, name, version, authorAccountId, visibility, status,
manifest, signature?, reviewedByAccountId?, reviewDecision?, reviewNote?,
createdAt, updatedAt }`. `status` ∈ `in_review | published | rejected |
withdrawn`.

### `GET /api/bubbles` — browse

Latest version of each bubble the caller may see.
Visibility = **published + public** ∪ **the caller's own, any status** ∪
**maintainer**. An invisible bubble is absent, never an error.

| Query | |
|---|---|
| `q` | free text over name, description, Tamil name, domain |
| `lang` | BCP-47 prefix match on `manifest.languages` (`ta` matches `ta-IN`) |
| `domain` | `manifest.domain` |
| `status` | `in_review`… |
| `mine` | only what the caller authored |
| `pageSize` | ≤ 200, default 50 |
| `pageToken` | opaque cursor from `nextPageToken` |

```sh
curl -s 'localhost:3000/api/bubbles?lang=ta&domain=education&pageSize=20' | jq
```
```ts
const page = await client.listBubbles({ lang: "ta", domain: "education", pageSize: 20 });
```

### `GET /api/bubbles/<name>?version=`

One version; without `version`, the latest visible. **Missing and invisible are
both `404`** — never `403` — so a probe cannot tell a private bubble from a
nonexistent one.

```sh
curl -s 'localhost:3000/api/bubbles/tamil-tutor?version=1.0.0' | jq
```
```ts
const v = await client.getBubble("tamil-tutor", "1.0.0");
```

### `POST /api/bubbles/<name>/reviews` — maintainer decision

Body `{ "version", "decision": "approve" | "reject", "note"? }`. Reject requires
a note (≤ 2000 characters). **Nobody reviews their own bubble** (`403
self_review`); a body-supplied author cannot route around it.

```sh
curl -s -X POST localhost:3000/api/bubbles/tamil-tutor/reviews \
  -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"version":"1.0.0","decision":"approve","note":"Tamil name reviewed."}' | jq '.status'
# "published"
```
```ts
const reviewed = await client.reviewBubble("tamil-tutor", { version: "1.0.0", decision: "approve", note: "ok" });
```

### `POST /api/bubbles/<name>/withdraw`

Author or maintainer. Body `{ "version"?, "reason"? }`; without `version` every
version not yet withdrawn goes at once. Withdrawn is terminal and the version
number stays used — it can never be re-published with different content.

```sh
curl -s -X POST localhost:3000/api/bubbles/tamil-tutor/withdraw \
  -b cookies.txt -H 'Content-Type: application/json' -d '{"reason":"Superseded."}' | jq
```
```ts
const { withdrawn } = await client.withdrawBubble("tamil-tutor", { reason: "Superseded." });
```

### `POST /api/bubble/run` — run a bubble

**This route existed before the kernel and its behaviour is frozen**
(`src/app/api/bubble/run/route.ts`): it validates the manifest, requires the
`yazhi-api` permission and an allow-listed model, keeps the last 40 turns at
8000 characters each, and streams **NDJSON only** — `?format=sse` is not
offered here and is ignored. The kernel adds no HTTP behaviour to this route;
it only re-implements the same validations in-process (`localPort().runBubble`)
so the two paths answer alike.

```sh
curl -N -X POST localhost:3000/api/bubble/run \
  -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"manifest": {...}, "messages": [{"role":"user","content":"கற்க கசடற என்பதன் பொருள்?"}]}'
```
```ts
const client = createClient(async () => (await import("@/lib/api/ports")).localPort());
for await (const chunk of client.runBubble(manifest, [{ role: "user", content: question }])) {
  if ("text" in chunk) process.stdout.write(chunk.text);
}
```

### `GET`/`POST /api/translate` — i18n-core

Implemented by i18n-core (`src/app/api/translate/route.ts` →
`src/lib/translate.ts` → `src/lib/translate-core.ts`). The kernel only
documents it and types it; see
[ROUTE-CONTRACTS](team/ROUTE-CONTRACTS-20261109.md) §A.

`GET ?locale=hi&q=Text` looks the translation memory up — public and cached,
a miss is `text: null` with `origin: null`, never an error.

`POST` is Circle-gated + same-origin, ≤ 200 entries, ≤ 2000 characters each.
It accepts i18n-core's spelling `{ locale, strings: [{ key, text, context? }],
source?: "en" }` **and** the typed client's `{ locale, entries: [{ key,
source }] }` (`strings` wins if both are sent).

```sh
curl -s 'localhost:3000/api/translate?locale=hi&q=Guardian' | jq
curl -s -X POST localhost:3000/api/translate -b cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"locale":"hi","strings":[{"key":"site.nav.guardian","text":"Guardian"}]}' | jq
```
```json
{ "locale": "hi",
  "translations": [{ "key": "site.nav.guardian", "text": "Guardian", "origin": "mt", "reviewRequired": true }],
  "warnings": ["translation memory unavailable: no provider configured"] }
```

**An unconfigured provider is not an error.** The route answers **200**,
returns every entry as a draft (`origin: "mt"`, `reviewRequired: true`) and adds
`warnings: ["translation memory unavailable: no provider configured"]`. It never
404s, never invents a translation, and never calls a paid provider without a key.
AI/provider output is always saved `reviewRequired: true` and is never served as
reviewed.

| Status | When |
|---|---|
| 200 | ok — **including** the no-provider case |
| 400 | malformed JSON, bad `locale`, missing/empty list, `source` not `"en"` |
| 401 | no Circle session |
| 403 | cross-site request |
| 405 | any method other than GET/POST/OPTIONS (carries `Allow`) |
| 413 | body, entry count, or one entry's text too large |
| 422 | a field or entry has the wrong type |
| 503 | **Circle itself** is unreachable — never used for a missing provider |

`OPTIONS` answers **204** with `Allow: GET, POST, OPTIONS`, so a preflight or a
proxy probe never sees the route as absent.

### `GET /api/openapi.json`

The OpenAPI 3.1 document for all of the above: schemas, security, an example per
operation.

```sh
curl -s localhost:3000/api/openapi.json | jq '.info.version'
```

---

## Using the client

There are **two entry points, split by side**, and the split matters: a client
component must never be able to reach a server module.

| Module | Safe in | What it gives you |
|---|---|---|
| `@/lib/api/client` | **browser + server** | `createClient`, `collectRun`, `YazhiApiError` |
| `@/lib/api/ports` | **browser + server** | `httpPort`, `decodeStream`, `HttpResponseError`, the `YazhiApiPort` type |
| `@/lib/api/error` | **browser + server** | `YazhiApiError` alone (a leaf: import only the error type) |
| `@/lib/api/ports-local` | **server only** | `localPort()` — in-process, no HTTP hop |

`@/lib/api/ports` has no edge to `ports-local`, so importing the client from a
client component cannot drag the Circle session onto the client graph.
(Turbopack checks value edges, not just `"use client"` markers — this split is
what keeps the build green.)

```ts
import { createClient, collectRun, YazhiApiError } from "@/lib/api/client";

// Browser or server: same origin over HTTP.
const client = createClient("/");

// A partner / another deployment.
const partner = createClient("https://yazhi.dev", { apiKey: process.env.PARTNER_KEY });

// Server only: in-process, no HTTP hop. Import localPort from ports-local —
// it is deliberately absent from @/lib/api/ports.
import { localPort } from "@/lib/api/ports-local";
const direct = createClient(await localPort());

try {
  const text = await collectRun(client.runBubble(manifest, turns));
} catch (err) {
  if (err instanceof YazhiApiError && err.retryable) {
    // 429 / 503 — the client already retried 3 times with backoff
  }
}
```

`createClient` retries **429 and 503** with exponential backoff + jitter
(honouring `Retry-After`), three attempts by default, and only *before* the
first streamed byte — retrying mid-stream would duplicate text. Every failure is
a `YazhiApiError` whatever the transport, carrying `status`, `code`, `body` and
the response `headers`.

### `/app` and other client components

Use the **HTTP port**: `createClient("/")`. `/app` runs bubbles through
`/api/bubble/run` (server) or the on-device model server (browser), exactly as
`/bubble` does; neither path needs `localPort`, which would be a server-only
import and a build error.

`localPort` is for server code that wants the handler cores without an HTTP
hop — a Server Component, a Route Handler, or an internal job.

## Registry storage

`src/lib/api/registry.ts` defines the `Registry` interface
(`publish`, `get`, `list`, `review`, `withdraw`) and:

- **`InMemoryRegistry`** — the default. A process-global `Map` on
  `globalThis`, ISO timestamps. Deterministic, no backend, and what the tests
  exercise. **It does not survive a restart** and is per-process.
- **`GrpcRegistry`** — `registry-grpc.ts`. Selected only when **both**
  `YAZHI_GRPC_TARGET` and `YAZHI_REGISTRY_GRPC=1` are set. **Not wired yet**:
  every call answers `503 not_configured`. The file documents what wiring the
  yazhi-api `YazhiBubbles` service takes.

Signing: HMAC-SHA256 over canonical JSON (keys sorted at every depth, no
whitespace), base64url with a `v1:` prefix, via `signManifest`/`verifyManifest`
in `signing.ts`. **No `YAZHI_REGISTRY_SECRET` → no signature and
`warnings: ["unsigned"]`**, never an error.

## Testing

```sh
# from repos/yazhi-dev
node --import ./scripts/api-kernel.hooks.mjs --test scripts/api-kernel.test.mjs
```

34 tests, 306 assertions: manifest validation (v0/v1, hostile input), semver,
canonical JSON and signing (with and without a secret), the full registry
lifecycle (ownership, ordering, visibility, terminal states, paging), maintainer
fail-closed, bounded request bodies (413 before a large read), the handler
cores, NDJSON/SSE, the typed client's retry and error mapping, the OpenAPI
document, and a static scan proving no client-importable kernel module reaches
`server-only` or reads a secret. `scripts/api-kernel.hooks.mjs` teaches Node the
tsconfig path aliases and stubs Next's request context and the Circle session.

## Not yet built

- **gRPC streaming chat** — runs still use the OpenAI-compatible SSE bridge in
  `src/lib/chat/backend.ts`. A native yazhi-api chat stream is future work.
- **The gRPC bubble registry** — `YazhiBubbles` (publish/get/list/review/
  withdraw) is stubbed (`registry-grpc.ts`). Needs a way to carry the Circle
  session token and the proto wiring.
- **Persistent registry storage** — the in-memory store is per process and
  lost on restart. yazhi-api's `store_documents` collection `bubbles` is the
  intended home (bubbles.proto comment). The translation memory is likewise
  process-local (`src/lib/translate-core.ts`).
- **Credits metering** — no billing, quota or usage metering is enforced. The
  only limits are the translation entry caps and model allow-listing.
- **Partner API keys** — no key issuance, rotation or scopes yet.
- **`community.maintainer` roles** — `YAZHI_MAINTAINERS` stands in until
  yazhi-api exposes IAM roles to the session.
