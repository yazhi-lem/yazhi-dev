# YBI Developer Guide

How to build with the **Yazhi Bubble Interface** and how every number on a Bubble page is calculated.
Scope, layer rules and roadmap are in [BUBBLE-INTERFACE.md](./BUBBLE-INTERFACE.md). This guide covers usage and calculations.

**Contents**

1. [Quick start](#1-quick-start)
2. [How a page is made](#2-how-a-page-is-made)
3. [Component reference](#3-component-reference)
4. [Block spec reference](#4-block-spec-reference)
5. [Foundry calculations](#5-foundry-calculations)
6. [Colour and contrast calculations](#6-colour-and-contrast-calculations)
7. [Layout calculations](#7-layout-calculations)
8. [Freshness and request budget](#8-freshness-and-request-budget)
9. [Recipes](#9-recipes)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Quick start

```bash
npm ci
npm run dev            # http://localhost:3000/foundry
```

| Env var | Default | Effect |
|---|---|---|
| `YAZHI_RPC_URL` | unset | Base URL of a Connect / gRPC-JSON gateway in front of yazhi-api. When unset, pages render the audited sample, labelled **Sample**. |
| `YAZHI_API_KEY` | unset | Sent as `Authorization: Bearer …`, on the server only. `YazhiInsight` is not exempt from yazhi-api's key interceptor. |

Routes: `/foundry` (overview) and `/foundry/{legal,education,governance,health,sovereign,core}`. Any other slug returns 404 (`dynamicParams = false`).

Checks to run before pushing:

```bash
npx tsc --noEmit
npx eslint src/bubble src/lib/foundry src/lib/yazhi-api src/app/foundry
npm run build          # expect /foundry ○ and /foundry/[project] ● with 6 paths
```

---

## 2. How a page is made

```
page.tsx ──► load()  (src/lib/<svc>/client.ts, server-only)
                │  unary(service, method, req)   src/lib/yazhi-api/rpc.ts
                │  └─ on error / unconfigured → sample + reason
                ▼
             view(data, source) → Block[]      src/lib/<svc>/views.ts (pure)
                ▼
             <BubbleView blocks={…} />          src/bubble/spec/BubbleView.tsx
```

The whole route file:

```tsx
export const revalidate = 60;

export default async function FoundryPage() {
  const { overview, source } = await loadOverview();
  return <BubbleView blocks={overviewView(overview, source)} />;
}
```

**Wire format.** `unary()` sends `POST {YAZHI_RPC_URL}/{package.Service}/{Method}` with the request message as proto3 JSON. The response follows proto3 JSON rules:

| proto3 rule | Consequence | Handled by |
|---|---|---|
| Field names are lowerCamelCase | `record_count` → `recordCount` | `src/lib/foundry/types.ts` |
| Default values are omitted | `score: 0` and `hasCorpus: false` arrive as *missing* | every scalar is optional; read through `num()` / `Boolean()` |
| `int64` is a JSON string | `totalChars: "12345678"` | `num()` → `Number(v) \|\| 0` |
| Errors | HTTP non-2xx + `{code, message}` | `RpcError(code, status)` |

---

## 3. Component reference

Import everything from `@/bubble`. All components are Server Components except `ShellNav`.

### Tones

`Tone = "kurinji" | "mullai" | "marutham" | "neytal" | "palai" | "gold" | "neutral" | "ok" | "warn" | "error" | "info"`

| Semantic | Maps to | Hex | Why |
|---|---|---|---|
| `ok` | mullai | `#4f9d6b` | forest: growth |
| `warn` | marutham | `#b7a03c` | harvest gold: attention without alarm |
| `error` | palai | `#c25b3c` | desert ochre: hardship |
| `info` | neytal | `#4a8ab5` | sea: neutral signal |
| `neutral` | ivory-dim | `#cbc9c4` | no state |

`toneStyle(tone)` sets `--tone` on an element. Every `.ybi-*` class and every `…[color:var(--tone)]…` utility reads that variable.

### Primitives (`core/`)

| Component | Props | Notes |
|---|---|---|
| `Bubble` | `tone?`, `shape? = card\|pill\|orb`, `size? = sm\|md\|lg` (padding 12/20/28px), `href?`, `as?`, `label?` | Passing `href` makes it a `<Link>` with hover lift and a tone-coloured focus ring |
| `Pill` | `label`, `tone?`, `pulse?`, `mono?` | Dot plus text; the state is always written out, never shown by colour alone |
| `Meter` | `value: number \| null`, `label` (a11y), `size? = 64`, `tone?`, `caption?` | `null` means no data: an empty ring and "—", never 0. See §5.6 |
| `Stat` | `label: BiText`, `value: string`, `hint?`, `tone?` | `value` is pre-formatted by the view |
| `T` | `text: BiText`, `separator?`, `display?` | Renders `{ta, en}` through `<Bi>` and follows TAM/ENG/BOTH |

`BiText = string | { ta: string; en: string }`. `plain(text)` returns the English string for attributes.

### Patterns (`patterns/`)

| Component | Key props | Data it mirrors |
|---|---|---|
| `PageHeader` | `title`, `eyebrow?`, `description?`, `tone?`, `crumbs?`, `pills?` | — |
| `BubbleCard` | `title`, `subtitle?`, `body?`, `tone?`, `href?`, `meter?`, `pills?`, `meta?` | project or pipeline |
| `StageTrack` | `stages: {id,label,state,note?}[]`, `label?` | factory stages (§5.7) |
| `FindingList` | `items: {code,severity,title,detail?,count}[]`, `empty?` | `yazhi.insight.v1.Finding` |
| `KeyValue` | `items: {label,value,mono?}[]` | — |
| `DataTable` | `columns`, `rows: string[][]`, `caption?`, `numeric?: number[]` | `insight.TableRows` (cells pre-stringified) |
| `EmptyState` | `title`, `body?`, `art? = sleepy\|thinking\|surprised` | Yazh art from `/public/yazh` |
| `Notice` | `tone?`, `badge?`, `title`, `body?` | the live/sample banner |

### Shell

`<BubbleShell product productHref nav={ShellNavItem[]}>`: sticky top bar (mark, product, pill nav, language toggle), skip link, and a `<main>` with a 72rem max width. Use it once in the route's `layout.tsx`.

---

## 4. Block spec reference

A page is `Block[]`. Each block's fields are its component's props plus `kind`.

| `kind` | Renders | Layout |
|---|---|---|
| `header` | `PageHeader` | — |
| `notice` | `Notice` | — |
| `stats` | `Stat` × n | 2 columns, 4 at ≥1024px |
| `cards` | `BubbleCard` × n | 1 → 2 (≥640px) → 3 (≥1280px); `columns: 2` caps it at 2 |
| `stages` | `StageTrack` | wraps |
| `findings` | `FindingList` | sorted error → warning → info, then by count descending |
| `keyvalue` | `KeyValue` | 1 column, 2 at ≥640px |
| `table` | `DataTable` | scrolls sideways under a 28rem minimum width |
| `empty` | `EmptyState` | — |
| `text` | paragraph | max 48rem |
| `section` | h2 + description + nested `blocks` | `framed: true` wraps children in one bubble |

Example:

```json
[
  { "kind": "header", "eyebrow": "Yazhi Dev · Foundry", "title": { "ta": "வார்ப்பகம்", "en": "Foundry" } },
  { "kind": "notice", "tone": "warn", "badge": "Sample", "title": "Sample data — yazhi-api not connected." },
  { "kind": "stats", "items": [ { "label": "Records", "value": "5,630", "tone": "info" } ] },
  { "kind": "section", "title": "Pipelines", "framed": true, "blocks": [
      { "kind": "table", "columns": ["Pipeline", "Schedule"], "rows": [["legal.en.indiacode", "daily"]] }
  ] }
]
```

Because blocks are plain JSON, they survive `JSON.stringify`. That is what lets an agent or yazhi-api emit them (roadmap Phase 3).

---

## 5. Foundry calculations

Scoring is done **server-side in yazhi-api** (`insight/quality.py`, `insight/models.py`). YBI displays those values. It computes only presentation values: tone, the ring arc, stage states, and number formatting. Both halves are documented here so a number on screen can be traced to its source.

### 5.1 Domain quality score (yazhi-api)

```
penalty = Σ over findings f:  W[f.severity] × min(1, f.count / record_count)
score   = clamp(0, 100, round(100 − penalty))

W = { error: 45, warning: 20, info: 0 }
record_count = 0  →  score = 100   (nothing to penalise)
```

A finding costs at most its weight, reached when it affects every record. Info findings (e.g. `ACQUISITION_GAP`) cost nothing.

**Worked example: legal** (sample findings, 5,609 records):

| Finding | Severity | count | count / 5,609 | × W | Penalty |
|---|---|---:|---:|---:|---:|
| `PROVENANCE_STUB` | error | 5,595 | 0.99750 | × 45 | 44.888 |
| `TITLE_CONTENT_MISMATCH` | error | 2 | 0.00036 | × 45 | 0.016 |
| `VALIDATION_MISSING` | warning | 149 | 0.02656 | × 20 | 0.531 |
| **Total** | | | | | **45.435** |

`round(100 − 45.435) = round(54.565) =` **55**.

The audit reports **54**. The one-point gap means the live corpus has further small findings that the audit summary did not list, needing at least another 0.065 points of penalty. The sample keeps the audited 54 and lists only the three findings the audit names. Treat the sample findings as a subset.

**Education:** 21 records and no penalised findings, so the penalty is 0 and the score is **100**.
**Governance, health, sovereign, core:** no corpus, so the server returns `score = 100` with `hasCorpus = false`. YBI shows **"—"**, not 100 (§5.5).

**What-if (a planning lever).** If `PROVENANCE_STUB` is fixed, legal's penalty falls to 0.016 + 0.531 = 0.547, and `round(99.453)` = **99**. That single fix moves legal from 54 to 99.

**Observation for yazhi-api.** `VALIDATION_MISSING` counts *parents* (acts: 149 of 153 unvalidated, 97.4%) but is divided by *records* (5,609 sections). So near-total validation debt costs 0.53 points. Measured against parents it would cost 20 × 0.974 = 19.5 points. The docstring calls the score "deliberately blunt" and says it ranks domains rather than grading them. Read the findings, not only the number.

### 5.2 Overall score (yazhi-api)

```
overall = round( mean( score_d  for d in domains if d.has_corpus ) )    # 100 if none
```

This is an **unweighted mean over domains that have a corpus**: (54 + 100) / 2 = **77**.

A record-weighted mean would be (54 × 5,609 + 100 × 21) / 5,630 = **54.17**. The unweighted mean deliberately stops the largest corpus from drowning out the others. The trade-off is that a 21-record domain counts as much as a 5,609-record one.

Rounding note: Python's `round()` rounds half to even, so `round(99.5) = 100` and `round(98.5) = 98`. JavaScript's `Math.round` rounds half up. YBI never recomputes scores, so the two cannot disagree on screen.

### 5.3 Overview totals (yazhi-api)

| Field | Formula | Sample value |
|---|---|---:|
| `totalRecords` | Σ `stats.recordCount` over domains | 5,609 + 21 = **5,630** |
| `totalFindings` | number of findings | **3** |
| `totalErrors` | Σ `finding.count` where severity = error (**records affected**) | 5,595 + 2 = **5,597** |
| `totalWarnings` | Σ `finding.count` where severity = warning | **149** |

`totalErrors` counts records, not findings. The overview stat reads "3 findings, flagging 5,597 error · 149 warning records". Records affected by two findings are counted twice.

### 5.4 Validation coverage (yazhi-api, displayed by YBI)

```
coverage_pct = round(100 × validated_parents / total_parents, 1)     # 0.0 if no parents
```

Legal: 100 × 4 / 153 = 2.614, which rounds to **2.6%**. Education: 21 / 21 = **100%**.

YBI formats it with `pct(v) = Number(v.toFixed(1)) + "%"`, giving "2.6%" and "100%". (Before this guide the view used `Math.round`, which showed 2.6 as "3%"; that is fixed.) The project page shows the raw fraction instead, **4 / 153**, because a fraction says more than a percentage at this size.

### 5.5 Score → tone (YBI, `scoreTone`)

| Score | Tone | Colour |
|---|---|---|
| ≥ 85 | `ok` | mullai green |
| 60 – 84 | `warn` | marutham gold |
| < 60 | `error` | palai ochre |
| no corpus | `neutral`, value `null` | empty ring, "—" |

Applied: legal 54 → error; education 100 → ok; overall 77 → warn.

"Has a corpus" in YBI means `hasCorpus && recordCount > 0`. Both are required because proto3 omits `false` and `0`, and a domain can report `hasCorpus` with zero parsable records.

### 5.6 Meter ring geometry (YBI, `Meter.tsx`)

```
stroke = max(4, round(size / 12))
r      = (size − stroke) / 2            # the stroke sits fully inside the box
C      = 2πr
arc    = (clamp(value, 0, 100) / 100) × C
stroke-dasharray = "arc C"              # drawn arc, then a gap of at least C
```

The SVG is rotated −90° so the arc starts at 12 o'clock and runs clockwise. The line cap is round, so very small values still show a dot.

| size | stroke | r | C | arc at 54 | arc at 100 |
|---:|---:|---:|---:|---:|---:|
| 56 (cards) | 5 | 25.5 | 160.22 | 86.52 | 160.22 |
| 64 (default) | 5 | 29.5 | 185.35 | 100.09 | 185.35 |

Accessibility: `role="meter"`, `aria-valuenow = value`, and `aria-valuetext = "54 of 100"` (or the caption when the value is `null`).

### 5.7 Stage states (YBI, `views.ts`)

Two tracks per project: the domain's **stage CLI** (legal: fetch → parse → validate → embed; education: fetch → parse → validate → store; governance: fetch → parse → validate → embed → store) and the shared **factory loop** (collect → audit → raw → enrich).

Stage CLI, per stage, evaluated in order (first match wins):

| # | Condition | State | Note |
|---|---|---|---|
| 1 | `PipelineHealth.failuresByStage[stage] > 0` | attention | "N failures" |
| 2 | stage = `validate` ∧ corpus ∧ `validated < total` | attention | "v / t validated" |
| 3 | corpus | done | — |
| 4 | otherwise | pending | "awaiting first run" |

Factory loop: every stage is `done` if there is a corpus, else `pending`.

Examples: legal sample → validate shows *attention, 4 / 153 validated*, and the rest are *done*. Legal live with `failuresByStage = [{fetch: 12}]` → fetch shows *attention, 12 failures* (verified against a mock server). Health → factory loop only, all *pending*.

Limit: `failuresByStage` is corpus-wide, not per domain, because yazhi-api's `GetPipelineHealth` takes no domain filter. A stage name shared across domains (e.g. `fetch`) shows the same failures on every project page. The yazhi-api follow-up is to add a domain filter to `GetPipelineHealthRequest`.

### 5.8 Schedule formatting (YBI, `formatInterval`)

Divisibility is checked from the largest unit down:

| `interval_seconds` | Test | Label |
|---:|---|---|
| 604,800 | = 7 × 86,400 | weekly |
| 86,400 | = 86,400 | daily |
| 3,600 | = 3,600 | hourly |
| 172,800 | 172,800 / 86,400 = 2 | every 2 days |
| 5,400 | not a whole number of hours | every 5400s |

### 5.9 Number formatting

`fmt(n) = n.toLocaleString("en-IN")` uses Indian digit grouping: 5630 → "5,630", 1234567 → "12,34,567" (lakh grouping). This is deliberate for the primary audience.

---

## 6. Colour and contrast calculations

Method: WCAG 2.1 relative luminance, `L = 0.2126 R + 0.7152 G + 0.0722 B` over linearised sRGB channels (`c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`). Contrast ratio `= (L_hi + 0.05) / (L_lo + 0.05)`.

**Backgrounds.**
- Bubble body = 84% `--night-2` (#161616) over the page ink (#0a0a0a), which gives **#141414**.
- Worst case is the tone glow in the top-left corner: 13% tone over #141414.

| Tone | Raw hue on body | Raw hue on glow | `.ybi-tone-text` on glow | Ivory on tone/10 (pill) |
|---|---:|---:|---:|---:|
| kurinji | 5.23 | 4.48 ✗ | 6.24 | 15.10 |
| mullai | 5.59 | 4.73 | 6.42 | 14.95 |
| marutham | 7.11 | 5.85 | 7.39 | 14.65 |
| neytal | 4.91 | 4.24 ✗ | 6.03 | 15.16 |
| palai | 4.26 ✗ | 3.76 ✗ | **5.48** | 15.46 |
| gold | 9.15 | 7.20 | 8.50 | 14.23 |
| ivory-dim | 11.13 | 8.45 | 9.44 | 13.91 |
| ivory | 16.93 | 11.93 | — | 13.15 |

✗ means below the 4.5:1 AA threshold for small text.

**Rule that follows.** Never put small text in a raw tone colour. Use `.ybi-tone-text`, which is 75% tone + 25% ivory mixed in sRGB. It clears AA for every tone (lowest: palai 5.48) and keeps the hue recognisable. Mix ratios considered:

| Tone share | Worst tone on glow |
|---:|---:|
| 75% (chosen) | 5.48 |
| 70% | 5.85 |
| 65% | 6.32 |

75% is the most saturated option that still leaves about 1:1 of margin.

Non-text marks (dots, ring arcs, stage links) need 3:1 under WCAG 1.4.11. Every raw tone exceeds 3.7:1 on the glow. Body text (ivory 16.9, ivory-dim 11.1) is AAA.

---

## 7. Layout calculations

Breakpoints (Tailwind defaults): `sm` 640 · `lg` 1024 · `xl` 1280 px. Content column: `max-w 72rem` = 1,152px, minus 2 × 32px padding (sm+) = **1,088px**. On phones: viewport − 2 × 16px.

**Stats row.** 4 tiles at ≥1024px: (1,088 − 3 × 12) / 4 = **263px** each. On a 390px phone, 2 tiles: (358 − 12) / 2 = **173px** each.

**Cards.** 3 columns at ≥1280px: (1,088 − 2 × 16) / 3 = **352px** per card, with 312px inside the card's 20px padding.

**Facts row inside a card.** The grid is `repeat(auto-fit, minmax(M, 1fr))` with a 12px gap. The number of tracks is:

```
tracks = floor( (inner + gap) / (M + gap) )
```

| Inner width | M = 6.5rem (104px) | M = 5.5rem (88px) |
|---|---:|---:|
| 312 (desktop, 3 columns) | floor(324 / 116) = **2** ✗ | floor(324 / 100) = **3** ✓ |
| 318 (390px phone) | 2 ✗ | 3 ✓ |
| 288 (360px phone) | 2 ✗ | 3 ✓ |
| 248 (320px phone) | 2 | 2 (wraps, acceptable) |

Project cards carry 3 facts (Records, Pipelines, Coverage). At 6.5rem "Coverage" wrapped onto its own row, which was visible in the first screenshots. YBI uses **5.5rem**. The value text is ≤ 88px in 14px mono (e.g. "5,609" is about 42px). Long collector names such as `education.tntextbooks_catalog` sit in 2-column pipeline cards (496px inner → 5 tracks of which 2 are used) and break with `break-words`.

**Card title budget.** The title shares its row with a 56px meter and a 16px gap: 312 − 56 − 16 = **240px** in the 3-column layout. The longest project name, இறையாண்மை, measures about 275px at 24px, so it would break mid-word. At 20px (`text-xl`) the estimate is 275 × 20⁄24 ≈ 229px. Measured in Chromium it is **218px**, on one line at 1440, 1024 and 390px widths. Card titles are therefore fixed at `text-xl`, with `overflow-wrap: anywhere` as a last resort for future longer names.

**Stage track.** Each stage is ~28px (circle) + 8px gap + label. Links are `flex: 1 1 1.25rem`, at least 12px, and the track wraps on narrow screens (see the 390px screenshot).

**Radii.** Card 1.5rem (24px); pill and orb 999px. The glint is a 38 × 18px radial highlight at (14, 10) inside the card, the bubble mark's specular point.

---

## 8. Freshness and request budget

| Setting | Value | Where |
|---|---|---|
| Page revalidation | 60s | `export const revalidate = 60` |
| Fetch data cache | 60s, tags `yazhi-api:<Service>`, `foundry`, `foundry:<domain>` | `unary()` |
| RPC timeout | 8s | `AbortSignal.timeout(8000)` |

**Upstream calls per revalidation window, per deployment:**

| Route | RPCs | Unique requests |
|---|---|---:|
| `/foundry` | `GetQualityOverview` | 1 |
| `/foundry/[project]` × 6 | `GetDomainQuality{domain}` + `GetPipelineHealth{}` | 6 + 1 |
| **Total (at most)** | | **8** |

`GetPipelineHealth{}` has the same URL, body and tags on all six pages, so Next's data cache serves it once. This was confirmed against the mock server: a build made 6 `GetDomainQuality` calls and **one** `GetPipelineHealth`. The budget is therefore at most 8 calls per 60s, however much traffic there is: 8 × 60 × 24 = **11,520 calls a day** as the ceiling. Real traffic usually needs fewer, because ISR only regenerates pages that are actually requested.

**Staleness.** ISR is stale-while-revalidate. The first visit after a quiet period gets the cached page, of any age, and triggers a rebuild. The visitor after that sees data at most about 60s + rebuild time old. Rebuild time is bounded by the 8s timeout, and the project page's two calls run in parallel, so it adds at most 8s.

**Failure caching.** If yazhi-api is down during a rebuild, the page renders the sample, labelled with the reason, and ISR caches that version for up to 60s. The failed fetch itself is not cached, so the next rebuild retries. To force a refresh, call `revalidateTag("foundry", "max")` (or `foundry:<domain>`) from a route handler or server action. The tags are already attached. Next 16 deprecates the single-argument form; `"max"` marks the data stale, and it is refetched on the next visit.

---

## 9. Recipes

### Add a page for a new yazhi-api method

1. Types: mirror the response message in `src/lib/<svc>/types.ts` (camelCase, optional scalars, int64 as `string | number`).
2. Loader in `client.ts`:
   ```ts
   export async function loadX() {
     if (!rpcConfigured()) return { data: SAMPLE, source: sample("yazhi-api not connected") };
     try { return { data: await unary<Req, Res>("yazhi.x.v1.Svc", "Method", req, { tags: ["x"] }), source: live() }; }
     catch (err) { return { data: SAMPLE, source: sample(reasonFor(err)) }; }
   }
   ```
3. View in `views.ts`: `(data, source) → Block[]`, starting with `header` and the source `notice`.
4. Route: `page.tsx` with `revalidate = 60` and `<BubbleView>`; add `layout.tsx` with `<BubbleShell>` if it is a new product.
5. Sample: use only numbers you can cite, and name the source in `SAMPLE_SNAPSHOT`.

### Add a block kind

1. Component in `src/bubble/patterns/` with an exported props type.
2. Add `| ({ kind: "x" } & XProps)` to `Block` in `spec/types.ts`.
3. Add `case "x":` to `BubbleView`. Until you do, the `never` default makes `tsc` fail.
4. Export it from `src/bubble/index.ts`, and add a row to §4 of this guide.

### Checklist for any new visual

- [ ] Small tone-coloured text uses `.ybi-tone-text` (§6)
- [ ] State has a text label, not only a colour
- [ ] Missing data renders "—" or `EmptyState`, never 0
- [ ] Headings are `BiText`; no `tracking-*` on Tamil (it is reset automatically)
- [ ] No horizontal page scroll at 390px (`document.documentElement.scrollWidth === 390`)

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `tsc` reports dozens of syntax errors in a file with a doc comment | a `*/` inside `/** … */` (e.g. a glob like `src/lib/*/types.ts`) ends the comment | reword the path |
| A page is unstyled and a CSS chunk returns 500 after a rebuild | an old `next start` is still bound to the port and serving HTML from the previous build | stop every `next-server` process and restart |
| The page says **Sample** while `YAZHI_RPC_URL` is set | the gateway is unreachable, or a non-2xx response; the reason is printed in the notice | check the gateway path `/{package.Service}/{Method}` and the bearer key |
| One project page is Sample while the others are live | that domain's `GetDomainQuality` failed (e.g. `not_found`) | expected per-page fallback; fix upstream |
| Score shows 100 on an empty domain | reading `score` without checking the corpus | YBI shows "—" when `hasCorpus && recordCount > 0` is false (§5.5) |
| Tamil label renders as spaced-out letters | `tracking-*` on Tamil text | handled by `[class*="tracking-"] [lang="ta"]`; use `<T>` so `lang` is set |
