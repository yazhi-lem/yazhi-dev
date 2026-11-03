# apps/ — Yazhi's product workspaces

One folder per product, each a thin workspace on the shared shell
([`@yazhi/workspace`](../packages/workspace/README.md)) and the Bubble UI
([`@yazhi/bubble`](../packages/bubble/README.md)). Scope comes from
*Yazhi PRDs — Guru, Nyaya, Kural · Federal review copy (Edition 0.2)*.

| Workspace | Route | Landscape | Views | Agents |
|---|---|---|---|---|
| **Guru · குரு** | `/guru` | Mullai | Notebook · Tiers · Quiz · Teacher | Note agent, Vaathi |
| **Nyaya · நியாயா · న్యాయ** | `/nyaya` | Marutham | Ask · Explain a document · Legal-aid check · Summary & draft | Nyaya |
| **Kural · குரல்** | `/kural` | Palai | Customer desk · Ticket queue · Returns · Knowledge base | Kural, Annachi |
| **Kadai · கடை** | `/kadai` | Marutham (gold) | Counter · Orders · Kural desk · Returns | Annachi, Kanaku, Kural |

`/workspaces` lists them all. Every view is its own static route
(`/guru/quiz`, `/nyaya/explain` …), generated from the workspace's data.

## Layout of a workspace

```
apps/<id>/
├── meta.ts       plain data: names, tagline, views + default layouts, workflows
├── samples.ts    synthetic fixtures (Sample data, bracketed placeholders)
├── modules.tsx   the workspace's modules, registered by id
└── index.ts      the manifest: meta + its modules + the shared modules
apps/shared/commerce.ts   the shop's orders, tickets, returns and knowledge base
                          — one store Kadai writes and Kural answers from
apps/meta.ts              every workspace's meta (server-safe: routes, metadata)
apps/registry.ts          every manifest (client)
```

## Modular

A **module** is a block (`ModuleDef`: id, title, about, component). A **view**
places modules in two columns by id. Modules talk through small shared
stores (`useShared`), so the notebook and the page viewer, or the Kadai
counter and Kural's desk, stay in step without knowing about each other.

Kural is built once and mounted twice: `/kural` on its own (PRD finding H5)
and inside Kadai's *Kural desk* and *Returns* views (decision 6) — Kadai's
manifest just spreads `KURAL_MODULES` into its registry.

## Customizable

**Customize** in every header opens a drawer where a person can:

- show, hide, reorder and move modules between columns, per view;
- move the workspace to another tiṇai landscape;
- switch workflow steps off, reorder them, or build a new workflow from the
  workspace's step library.

Choices are saved per viewer, in the browser; **Reset** returns to the
manifest. The language toggle (த | EN, and తె for Nyaya) is one choice shared
by all workspaces.

## Workflows

Each workspace ships workflows — the PRD demo script, plus the day-to-day
paths (a teacher building a GuruBook, a clinic walk-in, morning mail triage,
taking an order). The Workflow module walks them step by step, links to the
view each step happens in, marks steps that need a person's confirm, and
records completions in Pettagam.

## The rules every workspace keeps

- **Cited, or it says it doesn't know.** Page chips (Guru), section chips
  (Nyaya), record chips (Kural); anything else is "not in these sources", a
  refusal, or a handoff to a person.
- **Actions need a person.** Approvals, sends, status changes and returns sit
  behind `ConfirmGate`; Pettagam logs them (hash-chained, IST).
- **Mail and uploads are data, never instructions** (Kural T-203).
- **Information, not advice** (Nyaya); **payment intent only** (Kadai).
- **Least data:** the eligibility check stores nothing; uploads stay in the
  browser in demo mode.
- **Sample data** on every reply; **†** — all Tamil and Telugu here is an AI
  draft until Kabilar and the Telugu reviewer sign it off.

## Not yet wired

Replies come from fixtures. In the product each module calls yazhi-api
(gateway → Aram harness → inference API); the module boundaries are where
those calls go. The Guru Book mockup in Claude Design was not reachable from
this build, so Guru follows the Bubble design system; fold the mockup in when
it's exported.
