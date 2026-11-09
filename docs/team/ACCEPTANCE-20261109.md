# ACCEPTANCE — multilingual + API + Bubble delivery (yazhi-dev)

Prepared by `repo-scout` (A4) 2026-11-09. Evidence commands live in [VERIFY-PLAN-20261109.md](VERIFY-PLAN-20261109.md) (step refs below). Status starts **pending** for every row; the Lead flips a row only with the *number* or *output* in the Evidence column, never with a builder's word.

Legend — **Status:** `pending` · `pass` · `fail` · `n/a`. **P0** = ships or doesn't; **P1** = ship with a recorded caveat.

## A. Multilingual (`i18n-core` A1/B1, `bubble-i18n` A3)

| # | Requested outcome | Evidence (how to prove) | Owner of evidence | P | Status |
|---|---|---|---|---|---|
| A1 | Tamil is the default locale, `lang="ta"` on first paint | Plan 6.1 — `curl / \| grep lang=` → `lang="ta"`. Also `grep -n 'DEFAULT_LOCALE' packages/i18n/src/locale.ts` → `"ta"` | i18n-core | P0 | pending |
| A2 | English is complete (no missing keys, no fallback-to-Tamil holes) | Plan 3.2 — catalogue test "identical key sets" `pass`; Plan 4 — `i18n-extract --check` exit 0 | i18n-core | P0 | pending |
| A3 | Hindi is drafted and **marked**, never presented as reviewed | Plan 3.2 pass; `grep -c 'reviewRequired: true\|origin: "mt"' src/lib/content.hi.ts` > 0; `docs/i18n/HINDI-REVIEW.md` exists with ≥1 row per Hindi string | i18n-core | P0 | pending |
| A4 | Every user-visible string in migrated files is locale-resolved | Before/after `grep -c` counts the builder must paste: `<Bi`-passing sections have 0 raw literals; Plan 4 exit 0 covers "used key exists" | i18n-core | P0 | pending |
| A5 | Tamil lines copy verbatim (pulli/combining marks/danda preserved, no paraphrase) | `git diff main..HEAD -- packages/i18n/src/catalogues/ta.ts \| grep '^-' \| grep -v '^---'` → only moves, no Tamil content change; spot-check 3 long strings against `content.ts` | i18n-core + Lead | P0 | pending |
| A6 | Locale ≠ display preference (TAM/ENG/BOTH still works) | `grep -n 'DEFAULT_DISPLAY' packages/i18n/src/display.ts` → `"both"`; Plan 6.1+6.2 together prove locale/display are independent | i18n-core | P0 | pending |
| A7 | `<html lang>` reflects the resolved locale (a11y) | Plan 6.2 `yazhi-locale=en` → `lang="en-IN"`; Plan 6.3 `hi` → `lang="hi"` | Lead (owns `layout.tsx`) | P0 | pending |
| A8 | Locale switcher is keyboard-operable + announces the change | manual: Tab to switcher, Enter changes, `aria-live` region present in DOM (`grep -c 'aria-live' src/components/ui/*.tsx`) | a11y-audit | P1 | pending |
| A9 | Hindi degrades to English inside workspaces (v1 ruling) | `git diff --numstat main..HEAD -- packages/workspace/` → **empty**; `/guru` with `hi` cookie renders English, not blank | Lead | P1 | pending |
| A10 | `preservePulli`-style grapheme safety (no code-unit slicing) | Plan 3.1 test `pass` incl. "படித்துக்கொண்டிருந்தேன்" aksara count; `grep -n 'slice(' packages/i18n/src/tamil.ts` → or `Intl.Segmenter` only | i18n-core | P1 | pending |
| A11 | Bubble UI package copy localised without changing public props | Plan 3.3 `pass`; `git diff main..HEAD -- packages/bubble/src/components \| grep '^[-+].*interface\|^[-+].*Props'` → no prop removals | bubble-i18n | P0 | pending |
| A12 | Agent metadata has `nameTa`/`taglineTa`/`greetingTa`/`languages`, old fields unchanged | `grep -c 'nameTa\|greetingTa\|languages' packages/bubble/src/lib/agents.ts`; Plan 2 typecheck clean with the 7 guest agents in `src/lib/chat/agents.ts` | bubble-i18n | P0 | pending |

## B. API (`api-kernel` A2)

| # | Requested outcome | Evidence | Owner | P | Status |
|---|---|---|---|---|---|
| B1 | Typed client + error type exist and are exported | `grep -n 'export.*createClient\|class YazhiApiError' src/lib/api/client.ts` | api-kernel | P0 | pending |
| B2 | OpenAPI 3.1 published and matches the contract | Plan 6.10 → `3.1.0 1.0.0 <n>`; `<n>` equals the operation count in ROUTE-CONTRACTS §B; Plan 2 clean | api-kernel | P0 | pending |
| B3 | Every planned route exists and returns correct status | Plan 6.6–6.12 (health, agents, manifest, bubbles, openapi, translate) | api-kernel | P0 | pending |
| B4 | Gated routes are actually gated (Circle + same-origin) | Plan 6.9 expectations; `grep -n 'currentAccount\|sameOrigin' src/app/api/bubbles/**/route.ts src/app/api/manifest/validate/route.ts` → session on bubbles, none on validate | api-kernel | P0 | pending |
| B5 | `/api/bubble/run` and `/api/chat` behaviour untouched | `git diff main..HEAD -- src/app/api/bubble/run/route.ts src/app/api/chat/route.ts src/app/api/circle/` → **empty** | api-kernel | P0 | pending |
| B6 | No system prompt or secret leaks through the API | Plan 6.7 → `0` hits for `systemPrompt`; Plan 5c → no secret in `.next/static` | api-kernel | P0 | pending |
| B7 | Unsigned registry degrades with a warning, never crashes | Plan 6.9 → no `500`; `grep -n '"unsigned"' src/lib/api/*.ts` | api-kernel | P0 | pending |
| B8 | Unit tests pasted | Plan 3.4 → `# pass <n>` with `<n>` recorded | api-kernel | P0 | pending |
| B9 | `docs/API.md` documents every v1 route with curl + TS example | `grep -c '^### ' docs/API.md` ≥ operation count; one `curl` per route | api-kernel | P1 | pending |
| B10 | Kernel does not drift between port and route (one handler) | Plan 6.11 content-type; inspect that each `route.ts` imports from `src/lib/api/handlers/*` | api-kernel | P1 | pending |

## C. Bubble UI (`/app`) (`bubble-ui` B2)

| # | Requested outcome | Evidence | Owner | P | Status |
|---|---|---|---|---|---|
| C1 | `/app` exists and is server-rendered | Plan 6.4 → HTML contains real content, not an empty shell; build route table lists `/app` | bubble-ui | P0 | pending |
| C2 | Tray + composer + workspace switcher present | plan 6.4/6.5 + manual: tray lists Avai and the 4 workspaces; composer submits | bubble-ui | P0 | pending |
| C3 | Deep links restore state; back/forward works | Plan 6.5 → `/app?b=avai` = 200; manual: change state → URL updates → reload restores | bubble-ui | P0 | pending |
| C4 | Offline device runtime works | manual: stop server, select device runtime, send a message → localhost path attempted and error surfaced honestly (not a silent hang) | bubble-ui | P1 | pending |
| C5 | a11y: roving tabindex, `/` composer, `[` `]` cycle, `Esc` to tray | manual keyboard pass, documented in `docs/APP.md` + actual DOM (`grep -c 'tabIndex={-1}\|tabIndex={0}' src/components/app/*.tsx`) | bubble-ui + a11y-audit | P1 | pending |
| C6 | Screen reader announces streamed reply once, at completion | `grep -n 'aria-live\|role="log"' src/components/app/**` → polite, single announcement | a11y-audit | P1 | pending |
| C7 | Host composes, does not fork, the library | `git diff main..HEAD -- packages/bubble/src/components packages/bubble/src/modules packages/bubble/src/pages` → **empty** (B2 may add only `host.ts` + one index line) | bubble-ui | P0 | pending |
| C8 | Sample data is labelled as sample | `grep -rn 'sample\|Sample' docs/APP.md` has a "what is still sample data" section; UI shows a sample tag | bubble-ui | P0 | pending |
| C9 | No secret reaches the client bundle | Plan 5c | bubble-ui | P0 | pending |
| C10 | Cross-link: `/app` links to `/bubble`, `/bubble` links to `/app` | `grep -n '/app' src/app/bubble/page.tsx` and vice-versa | bubble-ui | P1 | pending |
| C11 | No hydration mismatch | Plan 5b row 3 → no warnings; no `localStorage` read during render (`grep -rn 'localStorage' src/components/app`) | bubble-ui | P0 | pending |

## D. Delivery-level (Lead)

| # | Requested outcome | Evidence | Owner | P | Status |
|---|---|---|---|---|---|
| D1 | Nothing edited outside its lane | Plan 0.1, 0.5; `git diff --numstat main..HEAD` grouped by scope vs BOUNDARIES | Lead | P0 | pending |
| D2 | Typecheck clean whole-repo | Plan 2 exit 0 | Lead | P0 | pending |
| D3 | Build green, all pages prerendered | Plan 5a | Lead | P0 | pending |
| D4 | One `<html>` root layout only | Plan 5b row 4 → exactly 1 file | Lead | P0 | pending |
| D5 | Fonts: Devanagari covered, offline-build risk recorded | Plan 5b row 1 + `grep -n 'Devanagari\|Baloo_2\|localFont' src/app/layout.tsx` | Lead | P1 | pending |
| D6 | Existing routes unbroken | Plan 6.13 all `200` | Lead | P0 | pending |
| D7 | Server stopped / no stray dev server | `ps aux \| grep next \| grep -v grep` empty after Step 6 | Lead | P0 | pending |
| D8 | Rollback path recorded and file lists match reality | Plan Step 8 lanes vs `git status --short` bucket | Lead | P1 | pending |

## Sign-off

| Gate | Condition | Signed |
|---|---|---|
| Ship-blocking | every **P0** row `pass`, none `fail` | ☐ |
| Ship with caveats | every `P1` row `pass` **or** `fail` + a one-line caveat in the release note | ☐ |
| Known residual risk | Google-font network dependency at build (scout §2) — accepted, with mitigation noted | ☐ |

**Counts to fill at sign-off:** P0 pass __ / __ · P1 pass __ / __ · fail __ · blocked __
