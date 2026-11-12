# VERIFY PLAN — final runbook for the multilingual + API + Bubble delivery

Prepared by `repo-scout` (A4) 2026-11-09. **Run this only after Wave B reports done and no builder is active.** One build at a time on `yazhi-one` (15 GB). All commands from `repos/yazhi-dev` unless marked otherwise.
Ground truth for *why* each check exists: [SCOUT-20261109.md](SCOUT-20261109.md) §6.3.

---

## Step 0 — Freeze the tree (before you verify anything)

| # | Command | Expected | Failure signature → cause |
|---|---|---|---|
| 0.1 | `git status --short` | only intended lane files; no stray `.env`, no `*.log` | unexpected file → a builder wrote outside scope; **check `BOUNDARIES` scope before building** |
| 0.2 | `git stash list` | `stash@{0}` still the home-redesign WIP | missing → someone popped it |
| 0.3 | `git diff --stat main..HEAD` + `git status --short \| wc -l` | record both numbers in the delivery log | — |
| 0.4 | `grep -rn "console.log\|debugger" src packages apps --include=*.ts --include=*.tsx \| grep -v test` | 0 hits | hits → debug residue, clean before build |
| 0.5 | `git diff --numstat` on `packages/workspace/` | **empty** | non-empty → violates the "nobody edits `packages/workspace`" ruling |

## Step 1 — Memory gate (do NOT skip; OOM kills the session irrecoverably)

```bash
free -g          # need "available" >= 3 GB before build; >= 2 GB before tsc
ps aux | grep -E "next|node .*build" | grep -v grep   # must be empty
```

| Reading | Action |
|---|---|
| `available` ≥ 6 GB, no `next` process | proceed |
| `available` 3–5 GB | proceed, but build alone; do not open an editor with LSP |
| `available` < 3 GB | **stop**, find the consumer (`ps aux --sort=-%mem \| head`) |
| any `next dev`/`next build` alive | **kill it first** — two Next servers = the 5 Nov wedge |

## Step 2 — Typecheck (cheap, run first, no memory risk)

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.json
```

| Expected | Failure signature → likely cause |
|---|---|
| exit 0, no output | — |
| — | `Cannot find module '@yazhi/i18n'` → `tsconfig.json` `paths` alias missing (i18n-core owns it) |
| — | `Cannot find module '@yazhi/bubble/lib/...'` → deep import added without the `@yazhi/bubble/*` wildcard, or a new `exports` key was added to `packages/bubble/package.json` without the TS path |
| — | `Property 'X' does not exist on type 'Agent'` → A3 changed `agent-types.ts` without updating the 7 guest agents in `src/lib/chat/agents.ts` |
| — | `Module '"@/lib/circle/session"' can only be default-imported` / **`"server-only" cannot be imported from a Client Component`** → the §6.3 server-only leak, **stop and fix before building** |
| — | `Type 'Lang' is not assignable` at `src/components/ui/LangToggle.tsx` → A1 broke the `useLang()` contract (`{lang,setLang}`) |

> `tsc` covers `**/*.ts,tsx` per `tsconfig.json:include`, i.e. `src/`, `packages/`, `apps/` — but **not** `.js` (`hairline/figures/*.js`, `hairline/kernel.js`). Those only surface in the build.

## Step 3 — Unit tests (no build needed; safe to run before or after Step 2)

Each test file uses Node 26's native type-stripping plus a per-package resolver, as `packages/i18n/src/i18n.test.mjs:1-10` documents.

```bash
# 3.1 @yazhi/i18n core (exists today)
cd packages/i18n && node --test --experimental-strip-types --import ./scripts/ts-resolve.mjs src/i18n.test.mjs; cd -
# 3.2 site catalogues (B1 — task-5)
node --test --experimental-strip-types --import ./packages/i18n/scripts/ts-resolve.mjs packages/i18n/src/catalogues/catalogue.test.mjs
# 3.3 Bubble UI catalogue (A3 — task-3)   [resolver path per that package's script]
node --test --experimental-strip-types --import ./packages/bubble/scripts/ts-resolve.mjs packages/bubble/src/locales/catalogue.test.mjs
# 3.4 API kernel (A2 — task-2; path may be scripts/api-kernel.test.mjs or src/lib/api/*.test.mjs)
node --test --experimental-strip-types scripts/api-kernel.test.mjs
```

| Expected | Failure signature → likely cause |
|---|---|
| every file: `# fail 0`, `# pass > 0` | — |
| — | `ERR_MODULE_NOT_FOUND: './locale'` → resolver `--import` path wrong for that package |
| — | `Cannot use import statement outside a module` → file is `.mjs` but package lacks `"type":"module"` |
| — | catalogue test `fail >= 1` on "identical key sets" → ta/en/hi drifted; the message names the missing key |
| — | `unknown file extension ".tsx"` → a test imports a component; tests must stay on pure `lib/` modules |
| — | test file **absent** → the owning lane did not deliver its test; record as a **failed acceptance row**, not a skip |

**Record the pass/fail counts verbatim** — `ACCEPTANCE-20261109.md` column "evidence" wants the number, not "it passed".

## Step 4 — Catalogue extractor check (B1)

```bash
node scripts/i18n-extract.mjs --check           # expect exit 0
node scripts/i18n-extract.mjs --check --verbose # optional: lists every key resolved
```

| Expected | Failure signature → likely cause |
|---|---|
| exit 0, no output | — |
| — | `MISSING key site.<x> (used in <file>:<line>)` → a migrated component uses a key absent from ta/en/hi |
| — | `node: command not found` for the script → `package.json` `scripts.i18n:check` added but `scripts/i18n-extract.mjs` not created |
| — | exit 0 but `scripts/` empty → **the check is not wired**; grep `package.json` for `i18n:check` and treat a missing wiring as a failure |

## Step 5 — Production build (the one expensive step)

```bash
NEXT_TELEMETRY_DISABLED=1 npm run build 2>&1 | tee /tmp/yazhi-build-$(date +%s).log
```

`NEXT_TELEMETRY_DISABLED=1` stops the telemetry beacon from adding a network round-trip — important on an offline-ish box and it keeps the log clean. Keep the tee'd log; every check in Step 5b greps it.

### 5a — Pass criteria

| Expected in the log | Failure signature → cause |
|---|---|
| `Compiled successfully` | `Module not found: Can't resolve '@/lib/api/...'` → A2's port/route file landed in one place only |
| `✓ Generating static pages` with all route pages listed | prerender error → Step 5b row "hydration" |
| route table contains `/app`, `/bubble`, `/chat`, `/guru`, `/nyaya`, `/kural`, `/kadai`, `/api/health`, `/api/agents`, `/api/bubbles`, `/api/manifest/validate`, `/api/openapi.json`, `/api/translate` | a missing route → that lane's route file absent; `/app` missing → B2 did not deliver |
| no `Type error:` block | type error → re-run Step 2, fix, rebuild (never "build again and hope") |
| — | `Failed to fetch font` / `ENOTFOUND fonts.googleapis.com` → **§6.3 risk 1**, see 5b |
| — | `You're importing a component that needs "server-only"` → **§6.3 risk 2**, see 5b |
| — | `EADDRINUSE` / `Exceeded memory limit` → another build/dev server is alive; back to Step 1 |
| — | `Both <html> and <body> must be present in the root layout` *twice* → **duplicate root layout**, see 5b |

### 5b — The four §6.3 risks, checked against real output

| Risk | How to prove it in this build | Pass looks like | Fail → cause |
|---|---|---|---|
| **1. Font network fetch** | `grep -iE "font|googleapis|woff" /tmp/yazhi-build-*.log` | at most informational lines; a Devanagari face either absent or loaded from `public/fonts` | `Failed to fetch font 'Baloo 2'` → a 5th `next/font/google` face was added instead of a self-hosted `localFont` (see scout §2) |
| **2. `server-only` reachable** | (a) `grep -rln '^import "server-only"' src packages \| grep -v node_modules` → list the guarded modules; (b) for each, `grep -rn "<module-basename>" src packages --include=*.ts --include=*.tsx \| grep -v node_modules`, then check each importer for `"use client"` | guarded modules today: `src/lib/circle/{session,client}.ts`, `src/lib/api/{signing,registry}.ts`; and every importer is under `src/app/api/**` or `src/lib/` server code | any importer with `"use client"` on line 1 → client bundle breaks. **Known false positives** (already checked, do not re-flag): `src/components/bubble/BuildDocs.tsx:195` (a `<Code>GET /api/circle/session</Code>` doc string), `src/lib/circle/types.ts:6` (a comment), `packages/bubble/src/lib/bubble.ts:6` (a comment) — grep on a *basename* will hit prose, so confirm with `grep -n '^import.*server-only\|from "@/lib/circle' <file>` before declaring a leak |
| **3. Hydration / SSR mismatch** | build log: `grep -iE "hydrat\|Minified React error\|client/server"`; then Step 6.4 | no hydration warnings in log or console | mismatch in a *prerendered* page → some component reads `localStorage`/`window` during render (scout §6.3 risk 3) |
| **4. Duplicate root layouts** | `grep -c "Both <html> and <body>"` (expect 0) and `ls src/app/layout.tsx src/app/*/layout.tsx` — only ONE `layout.tsx` may contain `<html` | `grep -rln "<html" src/app --include=layout.tsx` → exactly 1 file | 2 files → a `[locale]` root layout landed against the ruling; revert it (Step 8 lane list) |

### 5c — Post-build bundle honesty (no secrets in the browser)

```bash
grep -rl "YAZHI_API_KEY\|YAZHI_REGISTRY_SECRET\|YAZHI_CIRCLE_APP_KEY\|YAZHI_TRANSLATE_KEY" .next/static/ ; echo "exit=$?"
```

| Expected | Failure signature → cause |
|---|---|
| no file listed, `exit=1` | — |
| any hit | **critical** — a server secret string reached the client bundle. Delete `.next/`, find the `process.env` in a `"use client"` file (it is inlined literally), fix, rebuild |

> This is a literal-string grep, so it only catches keys whose values were inlined. It is a smoke test, not proof; the structural guarantee is the `server-only` import check in 5b row 2.

## Step 6 — Runtime smoke (only after a green build)

Start ONE server, in the background, then stop it before doing anything else.

```bash
NEXT_TELEMETRY_DISABLED=1 npx next start -p 3100 &   # never 3082 (DSH GUI) or 3000 (dev)
sleep 6
```

| # | Check | Command | Pass | Fail → cause |
|---|---|---|---|---|
| 6.1 | Tamil default | `curl -s localhost:3100/ \| grep -o 'lang="[a-z-]*" *' \| head -1` | `lang="ta"` | `lang="en"` → locale cookie default wrong (Lead's `layout.tsx`) |
| 6.2 | Locale resolution | `curl -s -H 'Cookie: yazhi-locale=en' localhost:3100/ \| grep -o 'lang="[a-z-]*"' \| head -1` | `lang="en-IN"` (or `en`) | still `ta` → layout is not reading the cookie |
| 6.3 | Hindi fallback | `curl -s -H 'Cookie: yazhi-locale=hi' localhost:3100/ \| grep -o 'lang="[a-z-]*"' \| head -1` | `lang="hi"` / `hi-IN` | 500 → catalogue `hi` incomplete |
| 6.4 | SSR readable without JS | `curl -s localhost:3100/app \| grep -c '<div\|<main'` and confirm the avai bubble title text is in the HTML | > 0 and title text present | empty shell → host is client-only, violates "first paint is server-rendered" |
| 6.5 | Deep link | `curl -s -o /dev/null -w '%{http_code}' 'localhost:3100/app?b=avai'` | `200` | `307`/`404` → URL scheme not wired to the router |
| 6.6 | Health | `curl -s localhost:3100/api/health \| head -c 300` | `{"status":"ok",...}` with `i18n.locales` = `["ta","en","hi"]`, `runtimes` = `["device","yazhi-api"]` | 404 → route absent; 500 → env missing |
| 6.7 | Agents (no prompt leak) | `curl -s localhost:3100/api/agents \| grep -c systemPrompt` | `0` | ≥1 → **security defect**, A2 exported the persona |
| 6.8 | Manifest validate, public | `curl -s -X POST localhost:3100/api/manifest/validate -H 'content-type: application/json' -d '{"manifest":{}}'` | `200` with `{"ok":false,"errors":[...]}` | 401 → route was wrongly gated |
| 6.9 | Bubbles list, gated | `curl -s -o /dev/null -w '%{http_code}' localhost:3100/api/bubbles` | `200` (public read) or `401` (if gated) — must match the contract, not be a `500` | 500 → registry throws without a secret; contract says unsigned+warning |
| 6.10 | OpenAPI | `curl -s localhost:3100/api/openapi.json \| node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const o=JSON.parse(d);console.log(o.openapi, o.info.version, Object.keys(o.paths).length)})"` | `3.1.0 1.0.0 <n>` — `n` equals the number of operations in ROUTE-CONTRACTS §B | version mismatch → A2 hardcoded it; missing paths → doc drifted from routes |
| 6.11 | Content types | `curl -sI localhost:3100/api/health \| grep -i content-type` | `application/json` | `text/html` → a not-found page was served (check status too) |
| 6.12 | Translate degrade | `curl -s -o /dev/null -w '%{http_code}' 'localhost:3100/api/translate?locale=hi&q=hello'` | `200` with `text: null` **or** `503 not configured` — never `500` | 500 → crash instead of degrade (contract §A) |
| 6.13 | Existing routes unbroken | `for p in / /bubble /chat /guru /nyaya /kural /kadai /about /privacy /repos /workspaces; do printf "%-12s %s\n" $p $(curl -s -o /dev/null -w '%{http_code}' localhost:3100$p); done` | all `200` | any `500` → a lane regressed a page it did not own |
| 6.14 | `/api/bubble/run` behaviour unchanged | `git diff main..HEAD -- src/app/api/bubble/run/route.ts \| head` | **empty diff** | any diff → violates "port only, never change behaviour" |

```bash
kill %1     # ALWAYS stop the server; 15 GB box, one server at a time
```

## Step 7 — Gate summary (all must be green to ship)

| Gate | Command | Blocking? |
|---|---|---|
| G1 memory safe | Step 1 | yes |
| G2 typecheck | Step 2, exit 0 | yes |
| G3 unit tests | Step 3, every file `fail 0` | yes |
| G4 extractor | Step 4, exit 0 | yes |
| G5 build | Step 5a | yes |
| G6 no font network dep on the *shipped* path | Step 5b row 1 | advisory (note it; it will bite CI) |
| G7 no server-only reachable | Step 5b row 2 | yes |
| G8 no secrets in bundle | Step 5c | yes |
| G9 routes + lang | Step 6 | yes |
| G10 existing routes unbroken | Step 6.13, 6.14 | yes |

## Step 8 — Rollback (revert ONE lane without touching the others)

Lanes are file-disjoint by `BOUNDARIES`, with the four known shared files marked ⚠ — for those, revert **only your lane's lines**, never the whole file.

| Lane | Revert with (new files) | ⚠ shared file — edit by hand |
|---|---|---|
| **A1 i18n-core** (task-1) | `rm -rf packages/i18n` (keep `src/catalogues` if only core is broken) | `src/lib/i18n.tsx`, `src/components/ui/Bi.tsx`, `src/components/ui/LangToggle.tsx`, `src/lib/locale-cookie.ts` → `git checkout main -- <file>` **only if no other lane touched them**; `tsconfig.json` → remove the `@yazhi/i18n` paths lines by hand |
| **B1 site catalogue** (task-5) | `rm -rf packages/i18n/src/catalogues scripts/i18n-extract.mjs docs/i18n src/lib/content.hi.ts` | `src/lib/content.ts` (**additive-only** — diff against `main` and keep only the added helper lines if any other lane reads them), `src/components/**` + `src/app/**` per-file revert, `package.json` `scripts.i18n:*` lines |
| **A2 api-kernel** (task-2) | `rm -rf src/lib/api src/app/api/{health,agents,bubbles,manifest,openapi.json} .env.example` | `packages/bubble/src/lib/{bubble,manifest}.ts` (manifest is **additive-only** — revert just the new exports), `packages/bubble/src/index.ts` (A2's lines are at the END — delete from the first A2 export to the last), `docs/API.md` |
| **A3 bubble-i18n** (task-3) | `rm -rf packages/bubble/src/locales packages/bubble/docs/TRANSLATION-STATUS.md` | `packages/bubble/src/lib/{agents,agent-types,starters}.ts` → revert `nameTa`/`taglineTa`/`greetingTa`/`languages` additions only (the 5 Yazhi agents must keep their original fields), `packages/bubble/src/index.ts` (A3 block) |
| **B2 bubble-ui** (task-6) | `rm -rf src/app/app src/components/app src/app/api/app packages/bubble/src/host.ts docs/APP.md` | `packages/bubble/src/index.ts` (the `host.ts` export line, last block) |
| **Lead (layout)** | — | `src/app/layout.tsx` fonts + `lang`, `next.config.ts`, `src/lib/content.ts` |

**Order matters:** revert in reverse dependency order — **B2 → A3 → A2 → B1 → A1**. Reverting A1 first breaks B1's `/app` and catalogue imports and turns one failure into five. After any rollback: re-run Steps 2 → 5 for the remaining tree before declaring green.

### Quick "who broke it" bisect

```bash
git stash push -u -m "waveB-wip"      # park the whole tree
git checkout main -- .                # start from a known-good base
npm run build                          # must be green, else the breakage predates this round
```
Then restore lane by lane (`git stash pop` is all-or-nothing — prefer committing each lane on a scratch branch first).
