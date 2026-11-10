# apps/ — Yazhi's product workspaces

One folder per product, each a thin workspace on the shared shell
([`@yazhi/workspace`](../packages/workspace/README.md)) and the Bubble UI
([`@yazhi/bubble`](../packages/bubble/README.md)). Scope comes from
*Yazhi PRDs — Guru, Nyaya, Kural · Federal review copy (Edition 0.2)*.

| Workspace | Route | Landscape | Views | Agents |
|---|---|---|---|---|
| **Guru · குரு** | `/guru` | Mullai | Notebooks · Ask · Practice · History · Faculty | Note agent, Vaathi |
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

## Guru, after the Guru Book mockups

Guru follows the five Guru Book mockup screens:

1. **Notebooks** — a greeting, one ask box (தமிழ் · English · Tanglish) and
   the notebooks as covers with their code, faculty and source count.
2. **Cited answer** — numbered marks in the answer, then the numbered
   sources (file, page, faculty); each opens in place with the verified
   span. "Answer in" switches the answer between Tamil, English and
   Tanglish; "Practice this" opens the past papers on that topic.
3. **Not in your notes** — said plainly, with the closest page the faculty
   shared, "Open … page 20", and "Flag for [faculty] (anonymous)", which
   reaches the faculty's Questions tab without the student's name.
4. **Practice** — past-paper questions with paper and marks tags; "Try
   answer" asks the student to write first, then compares with the outline
   from their notes. Summary (three tiers) and a quick quiz sit beside it.
5. **Faculty** — the notebook's title, then Sources (upload, and a table of
   type, pages and status: searchable, indexing with progress, scanned),
   Study aids (approve machine drafts) and Questions (anonymous flags, top
   questions, weak areas); Shared with (sections behind a confirm) and
   Answer languages beside it.

History keeps a student's questions and quizzes on their device only.

## Accessibility

Checked with axe-core (WCAG 2.2 A/AA and best practice) on every route, in
light and dark and at phone width: no violations. Beyond that:

- **Skip link** to the content, one `h1` per view, `h2`/`h3` in order.
- **Phones:** views move to a bottom tab bar within thumb reach; nothing
  scrolls sideways at 390px; touch targets 44px.
- **Display** (Aa in the header): text size 100 / 112.5 / 125% for every
  workspace, light or dark, and the language on phones.
- **Keyboard:** `/` jumps to the question box; tabs follow the ARIA tabs
  pattern (arrow keys, Home, End); the Display and Customize dialogs keep
  focus inside, close on Escape and hand focus back.
- **Screen readers:** answers are announced when ready; citation marks are
  named ("Source 1: Unit 8 Notes…, page 18"); disclosures say whether they
  are open; quiz marks say "correct" or "your answer, wrong", not just ✓ ✕.
- **Language:** Tamil and Telugu are never letter-spaced (Pill now checks
  the script itself); Telugu renders in Baloo Tammudu 2.
- **Contrast:** Palai's dark accent moved from `#c25b3c` (4.32:1 on its
  surface) to `#cc6444` (4.87:1), so small accent text passes AA in every
  landscape.

## The backend

Modules do not answer questions from fixtures themselves; they call
`backend()` ([`apps/backend.ts`](backend.ts)), which speaks the
[workspace backend contract](../packages/contract/README.md). By default it
answers in the browser from the sample data; with
`NEXT_PUBLIC_YAZHI_BACKEND=api` the same calls go over HTTP to `/api/v1`,
the mock gateway. Each workspace's side of the contract is
`apps/<id>/backend.ts`.

Wired so far: Guru's Ask, Nyaya's Ask and Kural's customer desk. The other
modules still read fixtures directly; the contract's README lists what is
left. In the product the gateway forwards to yazhi-api (gateway → Aram
harness → inference API).
