# @yazhi/contract — the workspace backend contract

What Guru, Nyaya and Kural ask of the backend, and what it must answer.
**v0.1, draft for review.**

| File | What |
|---|---|
| `openapi.yaml` | The contract: 26 operations, each marked `mock` (answered today) or `planned` |
| `src/types.ts` | The same shapes as TypeScript, plus the `Backend` interface |
| `src/client.ts` | `httpBackend()` — the contract over HTTP; `backendMode()`; `envelope()` |

## How a workspace reaches the backend

```
module ──► backend()                      apps/backend.ts — the one integration point
              ├─ fixture (default) ──► apps/<id>/backend.ts over samples, in the browser
              └─ api ──► /api/v1/…  ──► src/app/api/v1/[...path]/route.ts (mock gateway)
                                            └─ later: yazhi-api
```

- **fixture** — no network. A demo runs on an institute's machine with the
  cable out. This is the default.
- **api** — set `NEXT_PUBLIC_YAZHI_BACKEND=api`. Every call goes over HTTP to
  the mock gateway, which answers from the same sample data and marks every
  reply `meta.sample: true`, `meta.served_by: "mock-gateway"`.

Each workspace's side of the contract is a file of pure functions
(`apps/guru/backend.ts`, `apps/nyaya/backend.ts`, `apps/kural/backend.ts`)
used by both paths, so the browser demo and the HTTP mock cannot drift.

## Rules the contract carries

1. **A source, or a refusal.** `answered` carries citations; otherwise the
   status says which "I don't know" it is (`not_in_sources`,
   `refused_advice`, `no_source`, `handoff`).
2. **Nothing changes without a yes.** A changing call returns `202` and a
   `Confirmation`; a person's `POST /confirmations/{id}` carries it out.
3. **Customer text and uploads are data, never instructions.**
4. **Sample data says so** (`meta.sample`).
5. **India only** (`meta.region: "IN"`).
6. **Least data** — the eligibility check stores nothing; flags to faculty
   carry no student identity.

## Try it

```bash
npm run dev
npm run contract:smoke          # 30 checks against http://localhost:3000/api/v1

curl -s localhost:3000/api/v1/nyaya/ask \
  -H 'content-type: application/json' \
  -d '{"question":"How do I win my land case?"}'
# → { "data": { "status": "refused_advice", "handoff": { … }, "disclaimer": { … } }, "meta": { "sample": true, … } }
```

## What is wired, and what is not

Wired through `backend()`:

| Workspace | Module | Operation |
|---|---|---|
| Guru | Ask | `POST /guru/notebooks/{id}/ask` |
| Nyaya | Ask | `POST /nyaya/ask` |
| Kural | Customer desk | `POST /kural/messages` |

Not yet:

- **The screens still draw an answer from the workspace's own sample data,
  looked up by the id the backend returns.** So `api` mode proves the call,
  the statuses and the failure paths, but an answer the samples do not hold
  cannot be drawn yet. Drawing straight from the response body
  (`parts`/`citations`, `steps`/`sections`, `entry`) is the next change.
- The other modules (practice, faculty, document explainer, eligibility,
  ticket queue, returns, knowledge base) still read fixtures directly. Their
  operations are in the contract; thirteen operations are `planned`, not mocked.
- The mock gateway checks no token and keeps pending confirmations in memory.
  It holds sample data only. Auth, tenants and Pettagam belong to the real
  gateway.
- In `api` mode Kural's server sees the sample orders, not an order just
  taken at Kadai's counter in the browser.

## Changing the contract

Change `openapi.yaml` and `src/types.ts` in the same commit, bump `version`
in both, extend `scripts/contract-smoke.mjs` for any new `mock` operation,
and say in the pull request which screens it affects.
