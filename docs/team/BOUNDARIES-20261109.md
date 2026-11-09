# Team boundaries — multilingual + API + Bubble UI (from the existing dev work)

**Branch:** `yazhi-mission-control` in `repos/yazhi-dev` (this is "the dev work": it is
25+ commits ahead of `main`, with only a home-redesign WIP stashed by the Lead at
`stash@{0}` — restore with `git stash pop` only if you are the Lead and the tree is clean).
**Machine:** `yazhi-one` — 15 GB RAM, no GPU, run **one** build at a time (see root
`CLAUDE.md` §2.1). Never run `npm run build` concurrently with another builder.

## What we are building (all three, on top of the dev branch)

1. **Multilingual** — a real locale architecture. Tamil (`ta`, the default, `lang="ta"`)
   and English (`en`) fully translated today; the type, routing and catalogue are built
   for more Indian languages without an ad-hoc design. A TM API drives AI-assisted
   translation, and nothing ships without native review.
2. **API** — one typed API kernel the whole site and every external partner calls: bubble
   runs and the bubble registry, in-process (`/api/*` ports) or over HTTP with a
   versioned, documented surface. No browser page ever holds a server secret; LLM keys
   stay server-side.
3. **Bubble UI** — the docs' end state: **an app is a set of bubbles in one host**
   (`/app`), plus one bubble per domain in `packages/bubble`.

## File ownership (disjoint — do not write outside your scope)

| Owner | Write scope |
|---|---|
| `i18n-core` | `packages/i18n/**` (new — incl. `src/catalogues/**`), `src/lib/i18n.tsx`, `src/components/ui/{Bi,LangToggle}.tsx`, `src/lib/locale-cookie.ts`, `src/lib/content.ts` + `src/lib/content.hi.ts`, `src/app/api/translate/**`, `scripts/i18n-extract.mjs`, the `i18n:*` script lines in `package.json`, and the `@yazhi/i18n` alias lines in `tsconfig.json` |
| `bubble-i18n` | `packages/bubble/src/locales/**` (new), `packages/bubble/src/lib/{agents,agent-types,starters}.ts`, `packages/bubble/docs/TRANSLATION-STATUS.md` |
| `bubble-ui` | `src/app/app/**`, `src/components/app/**`, `src/app/api/app/**`, `packages/bubble/src/host.ts`, `docs/APP.md` |
| `api-kernel` | `src/lib/api/**` (new), `packages/bubble/src/lib/{bubble,registry,api,sse}.ts` (all new), `src/app/api/{bubbles,bubbles/[name],manifest,agents,health,openapi.json}/**` (new routes; **port only**, never change `/api/bubble/run`, `/api/chat`, `/api/circle/*` behaviour), `packages/bubble/README`/`docs/*.md` API sections, `apps/**` *only if* a kernel import is unavoidable — message the Lead first |
| `bubble-ui` | `src/app/app/**` (new), `src/components/app/**` (new), `src/app/api/app/**` (new BFF for `/app`), `packages/bubble/src/host.ts` (new re-export only) |
| `a11y-audit` | fixes only, in files named by the Lead after Wave A — no new architecture |

**Everyone reads** `src/lib/content.ts`; **i18n-core writes it** (additively only — no
renames, no field removals). Additive-only is the rule that makes this safe.

### Contradictions resolved by the Lead (2026-11-09, from the A4 scout)

- `src/lib/content.ts` → **i18n-core owns it**, additively. ✔
- `package.json` → **i18n-core may edit only the `scripts` block**, and only to add
  `i18n:check` / `i18n:extract`. Nobody else touches it.
- `tsconfig.json` → **i18n-core may add only `paths` alias lines** (`@yazhi/i18n`,
  `@yazhi/i18n/*`). Nobody else touches it.
- `packages/bubble/src/index.ts` → serialised in this order: api-kernel (A2, additive
  lines at the end) → bubble-i18n (A3, only if it truly needs an index export) →
  bubble-ui (B2, optional `host.ts` line). Two agents never edit it at the same time.
- `packages/workspace/src/{types.ts,lang.tsx}` has `Bi {ta; en; te?}` and
  `WsLang = "ta"|"en"|"te"` and **no `hi`**. v1 ruling: **Hindi degrades to English
  inside workspaces** (`hi` is approved for the site chrome, the Bubble UI and the
  catalogue, not for workspace sample content, which is already draft-marked). Nobody
  edits `packages/workspace` in this round.
- **No `src/app/[locale]/` segment in this round.** The locale is a cookie read by the
  root layout (Lead). Prefix routing is a later, deliberate step.
- `src/lib/circle/{session,client}.ts` begin with `import "server-only"`. Nothing under a
  `"use client"` tree may import them, directly or transitively. **Hard build failure.**
- `/app` first demo surface: the **Avai** template (static copy, no auth/fetch/commerce),
  then the auth-free workspaces (Guru, Nyaya, Kural, Kadai).

## Shared seams — agree on these before coding

- **Locale type** lives in `packages/i18n/src/locale.ts`:
  `export type Locale = "ta" | "en" | "hi" | string` is **wrong** — use
  `export const LOCALES = ["ta","en","hi"] as const; export type Locale = typeof LOCALES[number];`
  plus `DEFAULT_LOCALE = "ta"`, `DEFAULT_DISPLAY = "both"` (today's TAM/ENG/BOTH is a
  *display* pref; the *locale* is what `lang` and translations key on).
- **`useLang()`** keeps its public shape (`{ lang, setLang }`) for existing callers; a new
  `useLocale()` / `useT(namespace)` is additive. `Bi` keeps its props.
- **API types** live in `src/lib/api/types.ts` (api-kernel owns). Both the site's ports
  and `packages/bubble` read them through `@/lib/api/types` inside the app.
- **Route contracts** are fixed by the Lead in
  [`docs/team/ROUTE-CONTRACTS-20261109.md`](ROUTE-CONTRACTS-20261109.md) — implement
  exactly those shapes; propose changes to the Lead, don't break them silently.

## Non-negotiables from the ecosystem rules

- Tamil is processed as grapheme clusters / akṣara, never code-unit slices. Tamil UI
  strings are **drafts until a native speaker signs them off** — mark them.
- `next/dynamic`, `next/font/*`, `next/link` etc. — read `node_modules/next/dist/docs/`
  before using a Next API you have not verified here (AGENTS.md rule).
- `tsc --noEmit` must pass scoped to your files before you claim done; the Lead runs the
  full build at the end. Do not touch `next.config.ts`, `package.json`, `tsconfig.json`.
