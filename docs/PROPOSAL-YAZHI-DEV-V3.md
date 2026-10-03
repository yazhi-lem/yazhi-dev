# Yazhi Dev v3 — from developer portal to community platform

**Status:** Draft proposal for review — nothing below Phase A is built.
**Date:** 3 October 2026
**Proposed owner:** Supriya Padmashini K (O4 — human community of builders, Dev Spaces)
**With:** Deepika (O1 — yazhi-api), Valavan K (engineering and editorial gate)
**Related:** `docs/PRD-DEVELOPER-COMMUNITY.md`, `/bubble`, `src/ui`, yazhi-api `CIRCLE.md` §6a, `NEXT_ACTION.md`

> Owners are proposed from the Pulavar map; confirm them in Linear before
> work is assigned. Tamil strings in this proposal and in the new pages are
> drafts until a native speaker signs them off.

---

## 1. Summary

yazhi.dev today is a marketing site with a chat demo bolted on. v3 makes it
the place where builders across India **sign in with one Circle account,
build bubbles (agents and tools) for their own languages, review each
other's work, and publish it to people who need it** — running on Adhan or on
the user's own device, never on a foreign model.

v3 is five things:

1. **Members** — Circle accounts on yazhi-api are the identity for everything.
2. **Bubbles** — a shared registry of `yazhi.bubble` manifests whose screens are built from the Yazhi UI library.
3. **Reviews** — nothing is public until a peer and a maintainer approve it.
4. **Spaces** — small groups that build together around a language or a domain.
5. **Recognition** — builder activity rolls up to Capitol, the collective's console.

The first slice — Circle sign-in, the Bubble UI host, `/bubble` docs and
the Yazhi UI library — landed with this proposal (§12). Everything else is the plan.

## 2. Where we are (v2)

| Surface | What it does today | Gap for a community |
|---|---|---|
| `/` | 3D Sangam-era landing, project stories, family and developer CTAs | Nothing a builder can *do* |
| `/chat` | Six agents bound to **Gemini and ChatGPT**, via an OpenAI-compatible endpoint | Breaks the sovereignty rule (Aram 2): foreign models in production. Sessions only in localStorage |
| `/onboarding?track=developer` | Phase 0 from the developer PRD: local-only profile, Discord link | No account, no credential |
| `/bubble` + Yazhi UI | **New:** builder docs, live Bubble UI, UI library (components, modules, page templates), Circle sign-in | Sample data only; no registry, no reviews |
| yazhi-api Circle | Account provisioning for apps; **new on a branch:** `YazhiCircle` sign-in sessions | Keys are company-wide (§6.2); IAM store not ready for concurrency (§6.3) |
| Capitol | Local operator console: quests, XP, people, audit | No real auth; no link to builder work |

## 3. Principles

Every v3 feature has to pass these, in this order (Aram harness):

1. **No claim without a source.** Bubbles that answer factual questions keep
   the Five-Posture kernel on by default; reviews check it.
2. **Data stays home.** Bubbles run on Adhan through yazhi-api, or on the
   user's own device. The server allow-lists models; a manifest cannot name a
   foreign one. `/chat`'s Gemini and ChatGPT agents are retired in Phase B.
3. **Think, then act.** Publishing, key issuance and moderation actions are
   explicit, logged and reversible.
4. **Children first.** Builder accounts are 18+. No bubble targets children
   outside the Yazh family flow and its counsel-approved safeguards.
5. **Ship what we said.** Every page shows what is built and what is not
   (`/bubble#status` is the pattern).

## 4. Product surfaces

| Route | Purpose | Phase |
|---|---|---|
| `/bubble` | Builder docs + live Bubble UI | **Built** |
| `/bubble/components`, `/bubble/modules`, `/bubble/pages` | Yazhi UI library: primitives, app modules, full app templates with live demos | **Built** (sample data) → B: published to the registry with each bubble |
| `/hub` | Browse and install published bubbles; filter by language, domain, runtime | B |
| `/hub/<bubble-id>` | Bubble page: description, author, versions, reviews, "open in Bubble UI", "fork" | B |
| `/b/<handle>` | Builder profile: bubbles, reviews given, Spaces, recognition | B |
| `/reviews` | Review queue for peers and maintainers | B |
| `/spaces`, `/spaces/<slug>` | Groups with shared drafts and a discussion thread | C |
| `/app` | The Bubble UI as an installable, offline-capable web app with the user's bubbles | C |
| `/chat` | Becomes a thin entry into `/app` with Adhan bubbles; the foreign-provider agents go | B |
| `/onboarding?track=developer` | Becomes Circle sign-up | A |

## 5. Architecture

```
 browser ──────────────────────────────────────────────────────────────┐
  Bubble UI host · Yazhi UI library · Hub                              │
   │  page code sees the account, never a token                        │ on-device runtime
   │                                                                    ▼ (no internet)
   │ httpOnly cookies                                     local model server
   ▼                                                      llama.cpp · Ollama · yazhi-one
 yazhi.dev (Next.js, the BFF)
   /api/circle/*      sign-in, sign-up, session, sign-out
   /api/bubble/run    Circle-gated run, manifest checks, model allow-list
   /api/hub/*         (B) registry reads/writes on the user's behalf
   │ gRPC + Bearer <session token>
   ▼
 yazhi-api
   YazhiCircle        (built, branch) sessions for people
   YazhiCircleProvisioning (exists)       accounts for apps
   YazhiBubbles           (B, new)        registry: publish, version, review, list
   YazhiQuery / AgentQueryService (exists, unary) → (B) streaming chat RPC
   │
   ▼
 Adhan workers (no weights inside yazhi-api)         Capitol ◀── (C) builder activity
```

### 5.1 Registry on yazhi-api (`YazhiBubbles`)

Following yazhi-api's data rules (`docs/data/architecture.md` §5):

- Manifests are records whose shape is still moving → `store_documents`
  (`collection = "bubbles"`), promoted to a typed `data/tables/` table once
  two features query by field.
- Reviews and publish events are append-only → a table with a `created_at`
  index; security-relevant actions also go to `audit_events`.
- Authors are Circle `account_id`s, never emails, in any indexed column.

RPCs: `PublishBubble` (new version, status `in_review`), `GetBubble`,
`ListBubbles` (public + caller's own), `SubmitReview`, `WithdrawBubble`.
All take a Circle session; maintainers are an IAM role
(`community.maintainer`) granted through admin mode.

### 5.2 Chat on yazhi-api

`/chat` and the yazhi-api bubble runtime currently stream from an
OpenAI-compatible endpoint (`YAZHI_API_URL`). yazhi-api serves chat only as
unary gRPC (`YazhiQuery/Query`, `AgentQueryService/QueryAgent`). Phase B adds
a server-streaming RPC so yazhi.dev can stream from yazhi-api directly, with
the user's session as the credential and usage attributed per account.

### 5.3 Manifest v1

`yazhi.bubble/v0` stays readable. v1 adds:

- `forkedFrom: { id, version }` — lineage survives forks.
- `languages: string[]` (BCP-47) — what the bubble speaks.
- `domain` — one of yazhi-api's routed domains, so domain rules apply.
- `signature` — the registry signs the manifest at publish; the host shows
  "verified" only for registry-signed bubbles.

## 6. Prerequisites on yazhi-api

These are not optional — v3 should not open sign-up beyond the pilot until
they land.

### 6.1 Merge Circle sign-in (Phase A)

Branch `ccr-01246f62-1ehz0i` on yazhi-api: `YazhiCircle`, session tokens
accepted by the interceptor but not as company-admin credentials, per-email
sign-in limits, and a fix for bcrypt rejecting over-72-byte bearer tokens.
Needs Deepika's review.

### 6.2 Scope Circle keys per person (Phase A)

Today `iam_auth.require_company_admin` lets **any** Circle key in a company
create, rotate and delete **every** account in that company. If yazhi.dev
handed each builder their key, one builder could delete another. yazhi.dev
therefore discards the key today. Fix: only a person holding a company admin
role (or a platform `*.admin` key) passes the company gate; ordinary Circle
keys authenticate service calls only. Then Phase C can issue builder API keys.

### 6.3 IAM store and refresh tokens (before public sign-up)

From yazhi-api's own gap list: **G1** — IAM lives in one protobuf file with
non-atomic writes, so concurrent sign-ups can lose updates; **G10** — refresh
rotation bcrypt-checks every stored token, which grows linearly with active
builders. Both sit on the sign-in path. Interim for G1 is already named there
(temp file + `os.replace`); the real fix is the dormant `80_circle.sql`
tables.

## 7. Collaboration model

- **Ownership.** A bubble belongs to the Circle account that published it.
  Co-maintainers are added per bubble.
- **Forks.** Anyone can fork a public bubble; the fork records
  `forkedFrom` and starts unpublished.
- **Reviews — two people.** A bubble goes public after one peer review and
  one maintainer review. The checklist: does it say what it does, does it cite
  or decline, does it stay on sovereign runtimes, is any Tamil copy marked for
  native review, does it avoid caste and children.
- **Spaces.** A Space is a registry-level group (members, shared drafts, one
  thread), not an IAM company — a Circle person belongs to exactly one
  company, and a builder will belong to several Spaces.
- **Discord stays** for conversation; the platform holds the work.

## 8. Safety and insider risk

- Session tokens only in httpOnly cookies; page code and bubbles never see them.
- Bubbles get only declared permissions; the host enforces, the server re-checks.
- Every yazhi-api run carries the account id; abuse is traceable and
  per-account limits are possible.
- Maintainer actions (approve, withdraw, suspend) go through admin mode and
  `audit_events`.
- Deactivating an account stops its sessions immediately (liveness checks on
  every call, built).
- DPDP Act 2023: collect name and email only; publish a data notice before
  public sign-up; delete-my-account flows through `DeleteCircleAccount`.
- Moderation: report button on every bubble and profile; reports land in a
  maintainer queue with a 48-hour response target.

## 9. Plan

Dates follow the launch line (Dev Spaces 18 October; December public launch).

### Phase A — Pilot (now → 18 Oct)

- [ ] Review and merge yazhi-api Circle sign-in (§6.1)
- [ ] Per-person Circle key scoping (§6.2)
- [ ] Deploy yazhi.dev with `YAZHI_GRPC_TARGET`; sign-up invite-only for the closed pilot
- [ ] Code of conduct reviewed and signed off (draft is at `/bubble#conduct`)
- [ ] `/onboarding?track=developer` → Circle sign-up
- [ ] Native-speaker review of the new Tamil labels

### Phase B — Registry (19 Oct → 30 Nov)

- [ ] G1 interim + G10 on yazhi-api (§6.3)
- [ ] `YazhiBubbles` service and `/api/hub/*`
- [ ] `/hub`, bubble pages, profiles, review queue
- [ ] Manifest v1 with lineage and registry signatures
- [ ] Streaming chat RPC on yazhi-api; `/chat` moves to Adhan bubbles, foreign agents removed
- [ ] Public sign-up opens once §6 is done

### Phase C — Community (1 Dec → launch)

- [ ] Spaces
- [ ] `/app` — offline-capable Bubble UI (installable web app)
- [ ] Builder API keys (after §6.2)
- [ ] Capitol roll-up: published bubbles and reviews become Capitol activity, under Circle identity (Capitol has no real auth today; Circle is the natural fit)

## 10. How we'll know it works

| Measure | Pilot target (proposed) |
|---|---|
| Builders who sign in and use the UI library | 50 by end of Phase A |
| Bubbles published after review | 20 by end of Phase B |
| Share of published bubbles that decline unsupported questions in review | ≥ 90% |
| Median time from submission to first review | ≤ 72 hours |
| Bubbles run on-device at least once | tracked, no target — tells us whether offline matters |
| Sign-in failures from yazhi-api errors (not wrong passwords) | < 1% |

Targets are proposals for the owner to set; there is no baseline yet.

## 11. Open decisions

1. **Who is a maintainer** for the pilot, and how many reviews before a
   peer can review alone?
2. **Default company** for builders: the shared `circle-apps`, or a
   dedicated `yazhi-dev-community` company (recommended — it keeps builders
   apart from other apps' users and gives yazhi.dev a narrowly scoped app key).
3. **Registry visibility:** are drafts in a Space visible to the whole Space,
   or only to people the author adds?
4. **On-device default model:** Adhan Kutty is scheduled for 26 Dec; until
   then, do we recommend a specific open model for builders to test with?
5. **Billing:** do builders get a free yazhi-api quota, and does
   yazhi-api's credits system (blocked on G17) meter bubble runs?

## 12. What landed with this proposal

**yazhi-dev** (this branch)

- `/bubble` — builder docs and a live Bubble UI.
- Yazhi UI (`src/ui`, docs at `/bubble/components`, `/bubble/modules`, `/bubble/pages`) — 11 components, 10 modules and 7 page templates (Avai, Nyaya, Kural, Guru, Kadai, Open Sangam, Yazh parent gate) on sample data. An earlier agent builder (`/foundry`) was removed from yazhi.dev.
- Bubble UI host — canvas, packed tray, composer with Circle button; on-device runtime (browser → localhost, no internet) and yazhi-api runtime via `/api/bubble/run`.
- Circle auth — `/api/circle/{session,signin,signup,signout}`, httpOnly cookies, gRPC client in `src/lib/circle/client.ts`.

**yazhi-api** (branch `ccr-01246f62-1ehz0i`, not merged)

- `yazhi.circle.v1.YazhiCircle` — `SignIn`, `RefreshSession`, `GetSessionAccount`.
- Session tokens accepted by the interceptor; not company-admin credentials.
- Fix: Circle key validation no longer crashes on bearer tokens over bcrypt's 72-byte limit.
- `CIRCLE.md` §6a.

Verified end-to-end against a local yazhi-api: sign-up, sign-in, refresh after
access-token expiry, sign-out, cross-site refusal, Circle-gated bubble run,
and on-device run.
