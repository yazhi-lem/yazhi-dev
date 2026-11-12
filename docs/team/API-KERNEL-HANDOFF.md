# API kernel — handoff note (task-2 / task-7)

**Owner:** api-kernel · `yazhi-mission-control` · 2026-11-09 · `src/lib/api/**` (24 files, ~3.6k lines)
Routes: `src/app/api/{health,agents,bubbles,manifest,openapi.json}/**` · Docs: [`docs/API.md`](../API.md) · Contract: ROUTE-CONTRACTS §B

## Numbers

```
tsc --noEmit -p tsconfig.json → exit 0        (last green run, before the shell died)
node --import ./scripts/api-kernel.hooks.mjs --test scripts/api-kernel.test.mjs
  ℹ tests 34  ℹ pass 34  ℹ fail 0  ℹ duration_ms ~250  (306 assert calls)
next dev -p 3178/3182 smoke → 30+ probes, all as specified (servers stopped afterwards)
/api/openapi.json → OpenAPI 3.1.0, v1.0.0, 10 paths, 13 operations, 13 operationIds, 0 dangling $refs
```

> **2026-11-09 follow-on (ports split + translate alignment) was made with the
> shell down.** Reads/edits/writes only — `tsc` and `node --test` have NOT been
> re-run since. The next green numbers must come from a shell: run
> `rm -rf .next/dev/types && ./node_modules/.bin/tsc --noEmit -p tsconfig.json`
> and the test command above (expect **35 tests**). If anything is red there,
> it is in this lane's `src/lib/api/**`, `docs/API.md` or `scripts/`.

## Route table — codes and content types as smoke-tested (live `next dev`)

| Route | Probe | Code | `content-type` |
|---|---|---|---|
| `GET /api/health` | happy | **200** | `application/json` |
| `GET /api/health` | `?format=sse` (ignored) | **200** | `application/json` |
| `GET /api/agents` | happy | **200** | `application/json` |
| `POST /api/manifest/validate` | happy / malformed JSON / `{}` / `GET` | 200 · 400 `invalid_json` · 400 `bad_request` · 405 | `application/json` |
| `POST /api/manifest/validate` | > 128 KiB declared **or chunked** | **413 `too_large` before any read** | `application/json` |
| `GET /api/bubbles` | anonymous / bad `status`,`pageSize`,`pageToken` | 200 `{bubbles:[]}` · 400 `bad_request` | `application/json` |
| `GET /api/bubbles/<name>` | not found or invalid name / bad `?version` | 404 `not_found` / 400 `bad_request` | `application/json` |
| `POST /api/bubbles` | unauthorised / cross-site / >64 KiB (authed) | 401 · 403 `cross_site` · 413 `too_large` | `application/json` |
| `POST /api/bubbles` | > 128 KiB declared (anon) | **413 before auth**, never buffered | `application/json` |
| `POST /api/bubbles/<n>/reviews` | unauthorised / not a maintainer | 401 · 403 `not_maintainer` | `application/json` |
| `POST /api/bubbles/<n>/withdraw` | unauthorised | 401 | `application/json` |
| `POST /api/bubble/run` (frozen) | unauthorised / cross-site / `?format=sse` ignored | 401 · 403 · 401 | `application/json` |
| `GET /api/openapi.json` | happy | **200** | `application/json; charset=utf-8` |

Streams send `application/x-ndjson; charset=utf-8`; `?format=sse` on `/api/translate` (i18n-core) sends
`text/event-stream; charset=utf-8`. **`/api/bubble/run` is NDJSON-only** — frozen, ignores `?format=sse`.
`/api/translate` is **not implemented yet** (i18n-core's lane): today it 404s.

## Auth model (one line per gate)

1. **Same-origin** — `POST /api/bubbles`, `/reviews`, `/withdraw`, `/api/bubble/run`; cross-site `Origin` → `403 cross_site`.
2. **Circle session** — same four routes; no session → `401 unauthorized` (or `503 upstream_error` if Circle itself is down — never a misleading 401).
3. **`YAZHI_MAINTAINERS`** — `POST /api/bubbles/<n>/reviews` only; not listed → `403 not_maintainer`. **Fail-closed**: unset ⇒ nobody.
4. **Self-review** — a maintainer may not review their own bubble → `403 self_review` (enforced in the handler *and* the store).
5. **Ownership** — the first publisher of a name owns it; other accounts → `403 not_owner`.
6. **Nothing** — `GET /api/health`, `/api/agents`, `POST /api/manifest/validate`, `GET /api/openapi.json`.
7. **Optional session** — `GET /api/bubbles`, `GET /api/bubbles/<name>`: visibility = published+public ∪ own (any status) ∪ maintainer. A visible-to-you bubble that does not exist is `404`, **never** `403` (no enumeration).

## `server-only` reachability audit

```
$ grep -rn "node:crypto" src/lib/api packages/bubble/src --include=*.ts
src/lib/api/signing.ts:21:import { createHmac, timingSafeEqual } from "node:crypto";   ← only hit
$ grep -rln '^import "server-only"' src/lib/api --include=*.ts
  18 files: every handler + local-port, maintainers, registry-grpc, registry, signing
$ grep -rln "process.env" src/lib/api --include=*.ts
  env.ts maintainers.ts registry.ts signing.ts (+ openapi.ts: doc-comment only)
Static import-graph walk from all 6 client entries: 7 modules reachable,
none carrying server-only, node: or process.env.
```

The converse holds — and is now **structural**: `localPort()` lives in
`ports-local.ts`, which is the only module naming `local-port.ts`, and it does so
through a dynamic `import(...)`. `ports.ts` / `client.ts` / `error.ts` /
`bubble.ts` have no edge to it at all, which is what keeps Circle's server-only
session off the client graph that Turbopack checks (`@/lib/api/client` in a
client component is safe; `@/lib/api/ports-local` is server-only). A test asserts
this (`server secrets stay out of client-importable kernel modules`).

### The 2026-11-09 client-graph split (bubble-ui found the break)

| Module | Safe in | Contents |
|---|---|---|
| `ports.ts` | browser + server | `YazhiApiPort`, `CallOptions`, `httpPort`, `decodeStream`, `HttpResponseError` — no `localPort` |
| `ports-local.ts` | **server only** | `localPort()`, `LocalPort` — dynamic-imports `local-port.ts` |
| `error.ts` | browser + server | `YazhiApiError` as a leaf (type-only import of `./types`) |
| `client.ts` | browser + server | `createClient`, `collectRun`; **re-exports** `YazhiApiError` from `./error` |

Before the split, `ports.ts` held a dynamic `import("./local-port")`; Turbopack
followed it, landed on `@/lib/circle/session` (`server-only`), and the build
failed for any client component importing the typed client.

## Abuse cases tried

| # | Attack | Result |
|---|---|---|
| 1 | manifest > 64 KiB to `POST /api/bubbles` | anon → **401** (70 KB passes the 128 KiB transport cap); authed → **413** `too_large` |
| 2 | 200 KB to `/api/manifest/validate`, declared **or chunked** | **413 before the body is read** (no allocation) |
| 3 | 5 000 messages × 9 000 chars (45 MB) to `/api/bubble/run` | **401** — this is the frozen route and it still buffers its own body (see gaps) |
| 4 | path traversal names (`../../etc`, `%2e%2e%2f`, `a%00b`, 500-char) | **404** on every variant — `isValidBubbleName()` rejects before any lookup |
| 5 | another author's **private** bubble via get + list | **404** / empty list for anon and for a foreign author; **200** for the author and for a maintainer |

## What the tests cover — and what they do not

**Covered (35 tests):** v0/v1 manifest validation incl. hostile getters; semver
compare/bump; canonical JSON + HMAC signing with and without a secret; the full
registry lifecycle (publish → list → review → withdraw, ownership, ordering,
visibility, terminal states, cursor paging); maintainer fail-closed; bounded
request bodies (413 before a large read, declared and chunked); handler cores for
every route; NDJSON/SSE round-tripping; client retry on 429/503 and error
mapping; OpenAPI completeness **including the translate 200-with-warnings
contract and its OPTIONS surface**; the secret-reachability scan **including the
ports/ports-local/error split**; route-file thinness.

**Not covered:** live HTTP e2e in CI (the matrix above was manual); any
authenticated browser flow (no Circle session here); concurrency on the
in-memory store; `?format=sse` end-to-end on a streaming route (encoder-level
only); a real gRPC registry; a real Turbopack client build (that is the Lead's
`npm run build`).

## Known gaps

- **In-memory registry is per-process and lost on restart** — fine for the demo, not production.
- **No automated e2e in CI** — the smoke matrix above is manual.
- **`/api/bubble/run` is NOT body-capped** — it is the frozen route (own `req.json()`); the kernel cannot bound it without editing it. All kernel routes are capped *before* the read (`readBoundedBody`, `handlers/http.ts:66`).
- **`/api/translate` is i18n-core's and now live** (`src/app/api/translate/route.ts`). The kernel only types it, documents it and mirrors its behaviour in-process; it does not implement it. An unconfigured provider is a **200 with `warnings: ["translation memory unavailable: no provider configured"]`**, never a 503.
- **No partner API keys** (the client sends `Bearer` when given one; nothing issues them) and **no rate limiting / credits metering.**
- **A mid-stream `{error}` surfaces as 502** in the client — retrying would duplicate text.

## Two follow-up refactors for the Lead

1. **Shared run constants** — `src/lib/api/env.ts:40` (`MAX_TURNS = 40`) and
   `:41` (`MAX_TURN_CHARS = 8000`) mirror the frozen route's local consts at
   `src/app/api/bubble/run/route.ts:19-20`. When that route is reopened, have it
   `import { MAX_TURNS, MAX_TURN_CHARS } from "@/lib/api/env"` and delete its own.
   TODO is in `env.ts` next to the constants.
2. **gRPC registry wiring** — `src/lib/api/registry-grpc.ts:57` `grpcRegistry()`
   is a typed 503 stub; selected by `getRegistry()` (`src/lib/api/registry.ts:446-460`)
   only when `YAZHI_GRPC_TARGET` **and** `YAZHI_REGISTRY_GRPC=1`. Wiring needs a
   Circle *session token* helper in `src/lib/circle/` (Lead-owned) plus the
   `YazhiBubbles` proto marshalling — the five steps are written out in that
   file's header comment (lines 1–48).

## Files the Lead will see in `git status` for this lane

`src/lib/api/**` · `src/app/api/{health,agents,bubbles,manifest,openapi.json}/**` · `packages/bubble/src/lib/bubble.ts` ·
`manifest.ts` (additive; `validateManifest` proven byte-identical) · `index.ts` (+3) · `docs/API.md` · `.env.example` ·
`packages/bubble/README.md` · `scripts/api-kernel.*`.
**Untouched:** `/api/bubble/run`, `/api/chat`, `/api/circle/**`, `/api/translate/**`, `src/lib/translate*.ts`,
`package.json`, `tsconfig.json`, `src/lib/api/ports-http-only.ts` (a bubble-ui stub the Lead will remove).
