# `/app` — the Bubble UI host

**An app is a set of bubbles in one host.** `/app` is that host: a packed tray
of app bubbles, a canvas that runs the selected one, a composer led by Mission
Control, and deep links for every state. It is the end state
[`PROPOSAL-YAZHI-DEV-V3.md` §4](../community/PROPOSAL-YAZHI-DEV-V3.md) promised
and the packaging of the library at `/bubble` (which stays the builder's page —
docs, anatomy, manifest).

Owner: `bubble-ui` (task-6). Branch: `yazhi-mission-control`.

---

## 1. What is on the screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  யாழி பயன்பாடு     [App] [Builder docs] [Chat] [Workspaces]  ☾   ◍      │  AppChrome
├──────────────────┬──────────────────────────────────────────────────────┤
│ YOUR BUBBLES     │  ← Back to the tray   அவை  Avai          [runtime]    │  canvas header
│  filters [All…]  │  Tamil literature, grammar and usage …               │
│  AGENT BUBBLES   │  ┌ thread ─────────────────────────────────────────┐  │
│    ◍ ◍ ◍ ◍ ◍     │  │ ...turn 1 / turn 2 (readable without JS) ...    │  │
│  APP BUBBLES     │  └──────────────────────────────────────────────────┘  │
│    ◍ ◍ … Avai    │  [starters]  ┌ composer ────────────────────────────┐  │
│  WORKSPACES      │              │ ◍ message…                        ▷ │  │
│    ◍ ◍ ◍ ◍       │              └──────────────────────────────────────┘  │
└──────────────────┴──────────────────────────────────────────────────────┘
```

| Bubble kind | What the canvas shows | Runs | Source |
|---|---|---|---|
| **agent** | the bubble's greeting and a sample question, then your messages and streamed replies | `yazhi-api` (Circle-gated) or the on-device model, per its manifest | `STARTER_BUBBLES` (`packages/bubble/src/lib/starters.ts`) + the registry (`GET /api/bubbles`) |
| **template** | one of the seven UI-library page templates, with sample data | nothing — a preview of a page shape | `PAGE_TEMPLATES` (`packages/bubble/src/pages/catalog.ts`); **Avai** leads |
| **workspace** | the real workspace shell: Guru, Nyaya, Kural, Kadai — the same screen `/guru` serves | the workspace's own modules (all auth-free) | `@yazhi/apps/registry` + `apps/*/meta.ts` |

First demo surface: the **Avai** page template (the bare `/app` opens it), then
the auth-free workspaces and Open Sangam. Kadai's payments and Guru's 1 397-line
module file are deliberately off the first-paint path; a workspace mounts only
when you choose it.

Tray order: agent bubbles, app templates, workspaces. A **language filter**
(All / Tamil / English / Telugu) narrows it; sizes come from each bubble's
manifest `size` (`s` 40 px, `m` 48 px, `l` 56 px). The tray has two looks — packed
(the default) and rail — remembered per browser and applied after mount, so the
server output never disagrees with the first client render.

---

## 2. URL scheme — everything is a link

| Parameter | Meaning | Example |
|---|---|---|
| `b` | the selected bubble's slug | `/app?b=yazhi.pulavar` |
| `ws` | a workspace whose screen is mounted in the canvas | `/app?ws=guru` |
| `t` | the thread id (`new`, or a generated id once you ask) | `/app?b=yazhi.pulavar&t=th3&q=…` |
| `q` | the questions in the thread, repeated, oldest first (last 6 kept) | `…&q="இன்றைய சொல் என்ன?"` |

Rules:

- **Bare `/app`** = the tray with Avai selected.
- **A choice changes history** (`push`): selecting a bubble, opening a
  workspace, Esc. Back and forward therefore walk your own steps.
- **Detail changes the current entry** (`replace`): each question you ask, so
  the address bar (bookmark, paste to a friend, reload) is the conversation.
  This never enters history, so Back does not undo a message.
- **Reload and history restore the same screen**: the server page reads the
  very same query parameters and hands them to the host as props (`?ws=` alone
  selects `ws.<id>`; an unknown `?b=` falls back to Avai rather than 404).
- **Answers never travel in a link** — only questions do. A shared thread says
  so, in the visitor's language, and offers "New conversation".

---

## 3. Runtimes — where a reply is computed

One bubble, two runtimes, chosen by its **manifest** rather than by the page:

| Runtime | Path | Needs | Works offline |
|---|---|---|---|
| `yazhi-api` | browser → `POST /api/bubble/run` (the frozen, documented route) through the typed client `createClient(httpPort(origin)).runBubble` | a Circle session (401 without) and a network path to yazhi-api | no |
| `device` | browser → `streamOnDevice` from `@yazhi/bubble/lib/runtime` → an OpenAI-compatible model server on this machine or LAN (`http://localhost:8080/v1` by default) | a local model server | **yes** |

Selection is `chooseRuntime` from the library: the bubble's `runtime.prefer`,
but **always `device`** when the browser is offline or the bubble has not
declared the `yazhi-api` permission. The header's runtime switch (`Auto` /
`On-device` / `yazhi-api`) overrides it, and `yazhi-api` is refused for a bubble
that did not declare it — the same rule `/api/bubble/run` enforces with a 403.

A failed run is explained, not echoed: 401 → "sign in with Circle, or switch to
on-device"; 503 → "yazhi-api is not connected on this deployment"; anything else
→ "the agent could not be reached, try the other runtime".

**Nothing secret can reach the bundle.** The client is built from the HTTP port
only (`@/lib/api/ports` is imported for `httpPort`, never `localPort()`), and no
file under `/app` imports `@/lib/circle/session` or `@/lib/circle/client`. The
registry half of the tray is read **on the server** (`registry-server.ts`) with a
1.2 s timeout, and an empty or failing registry simply yields a smaller tray.

---

## 4. Keyboard map

| Keys | Does | Where |
|---|---|---|
| `↑` `↓` `←` `→` | move between bubbles in the tray (roving tabindex — the tray is one tab stop) | tray |
| `Home` / `End` | first / last bubble | tray |
| `Enter` `Space` | open the focused bubble | tray |
| `/` | jump to the composer | anywhere |
| `[` `]` | previous / next bubble (agents + templates; workspaces change route and are skipped) | anywhere, not while typing |
| `Esc` | leave the composer if you are in it; otherwise back to the tray | anywhere |
| `?` | show / hide this map | anywhere, not while typing |
| `Tab` | tray → canvas → composer → the rest of the page (`Skip to the canvas` link comes first) | page order |

Modified shortcuts (`Ctrl`/`⌘`/`Alt`) are never intercepted. The map is also a
button (`?`) in the tray header. There are exactly two copies of it — this table
and the `app.key*` strings in `src/components/app/copy.ts` — so keep them in step.

---

## 5. Accessibility

- **One live region.** The host renders a single `role="status" aria-live="polite"`.
  The canvas speaks **once per completed reply** ("{bubble} replied. The answer
  is on the canvas.") — never per token, never for a reply you stopped, never
  twice for the same event (the region is cleared, then set on the next frame).
  Navigation announces "Back at the tray" / "{bubble} opened".
- **Streamed text is not live.** `ChatThread`'s own `aria-live` region is not
  used on this page; the thread is a plain ordered list so a long stream cannot
  flood a screen reader.
- **Landmarks and headings**: one `<h1>` per canvas (the bubble's name, focused
  after a selection so a keyboard user lands on the new canvas), `<main>` for the
  canvas, `<nav>` for the tray, `<section>` for the app chrome.
- **Reduced motion**: nothing on the page animates by itself; the magnetic
  behaviours, when used, honour `prefers-reduced-motion` inside the library
  (`MagneticTray`), and the tray's own roving focus never depends on animation.
- Everything that changes the screen is a real `button` / `radio` / `input` with
  a visible `:focus-visible` ring; the tray radios carry `aria-checked`, the
  language and runtime filters are real radio groups with arrow-key support.

---

## 6. Server rendering and hydration

- `/app` is **request-time**: the selection lives in the query string and the
  registry is read per request. `searchParams` on the server, props into the
  client host.
- **The first paint is complete without JavaScript**: the tray (every bubble),
  the selected bubble's identity, its greeting and seeded question, and the
  template/workspace shells are all in the HTML.
- Every value that changes after hydration starts from the server's value and is
  only corrected **inside effects** (online state, saved tray view, Circle
  session, the history list) — so React's hydration diff is empty. The thread is
  drawn by the same pure functions (`seedTurns`, `linkTurns`) on both sides; a
  `mounted` flag would have made the thread vanish and come back, so it is not
  used.
- No `localStorage` read during render, no `Date.now()` in render, no random ids
  in render (ids come from a counter that only runs in event handlers).

---

## 7. Where the pieces live

| File | Role |
|---|---|
| `src/app/app/page.tsx` | server page: `searchParams` → props, `generateMetadata`, registry read |
| `src/app/app/layout.tsx` | inherits the same metadata; pass-through layout |
| `src/components/app/BubbleAppHost.tsx` | state machine, URL sync, keyboard, the one live region |
| `src/components/app/BubbleLauncher.tsx` | the tray: groups, language filter, roving tabindex |
| `src/components/app/AppCanvas.tsx` | the canvas: agent thread / template / workspace; the run's UI |
| `src/components/app/useAppRun.ts` | the run engine (`createClient` → `runBubble`, or `streamOnDevice`), stop, errors |
| `src/components/app/AppChrome.tsx` | header, `CircleProvider`, theme, Mission Control |
| `src/components/app/registry-server.ts` | `server-only`: the registry half of the tray |
| `src/components/app/metadata.ts` | localised title/description, canonical + hreflang, `SITE_ORIGIN` |
| `src/components/app/bubbles.ts` | the built-in tray as plain data (agent / template / workspace) |
| `src/components/app/copy.ts` | every `/app` string, `[ta, en, hi]` |
| `src/components/app/useAppText.ts` | the copy hook (locale from the site's `LangProvider`) |
| `src/components/app/KeyboardMap.tsx` | the `?` dialog |

Reuse, not fork: **everything visual comes from `@yazhi/bubble`** — `Bubble`,
`Panel`, `Composer`, `MessageBubble`, `PAGE_COMPONENTS`, `ModeSwitch`, and the
manifest/agency helpers. `packages/bubble/src/host.ts` is a barrel-only file for
the pieces a host needs that the root barrel already exports; it adds nothing.
The composer gained one additive prop (`ref: ComposerHandle`) and two label props
so the host can focus it with `/` and name its buttons in the reader's language.

The single API change inside `packages/bubble` was that `Composer` gained an
optional `ref` handle — additive; every existing caller is unchanged.

---

## 8. Sample data — what is *not* real yet

Be honest about this when demoing:

- **Everything on a template screen is sample data** (the library says so with
  its own `Disclaimer kind="sample"`). Avai's answers, sources and Kural 663 are
  the library's fixtures, not Adhan output.
- **Agent bubbles' greetings and started questions are sample copy** from their
  manifests; the sample question is marked as a starter, and its reply — when a
  model answers — is a real run.
- **The workspace screens** are the product workspaces as they exist on this
  branch, each marked with its own status; sample lessons and tickets are marked
  as machine drafts by the library itself.
- **Tamil strings in `copy.ts` are drafts** awaiting native review; Hindi is a
  machine draft. `Copy` follows the same rule as the rest of the site.
- **The registry half of the tray is empty** on a fresh deployment (in-memory
  registry); the built-ins always show.
- **No persistence beyond the URL.** Threads live in the tab's memory and in the
  address bar; a reload keeps the questions, not the answers.

---

## 9. i18n

`src/components/app/copy.ts` holds ~90 keys as `[ta, en, hi]` triples, with
`appText(locale, key, params)` for the server and `useAppText()` for the client.
Tamil is the default and the fallback; unknown keys return the key.

**TODO(i18n-core):** move the object into `packages/i18n/src/strings/app.ts`
under an `app.*` namespace (it was outside this task's write scope), then swap
`useAppText()` for `useT("app")`. The shape is already a catalogue triple, so the
move is mechanical. Until then, no string in `/app` is hard-coded in a component.

---

## 10. Testing this page by hand

```bash
# one server at a time on this box
npm run dev -- --port 3131

curl -s localhost:3131/app | head -c 400            # tray + Avai, no JS
curl -s "localhost:3131/app?ws=guru" | grep -c 'குரு'  # workspace shell from the URL
curl -s localhost:3131/sitemap.xml | head -5
curl -s -o /dev/null -w '%{http_code}\n' -X POST localhost:3131/api/bubble/run \
  -H 'content-type: application/json' \
  -d '{"manifest":{"schema":"yazhi.bubble/v0"},"messages":[]}'   # 400, the kernel answers
```

In a browser: pick a bubble (Back returns to the tray), ask a question (the URL
grows `?t=…&q=…`), reload (the question is still there), press `[`/`]`, `/`,
`Esc`, `?`, and run the page with JavaScript disabled to see the server output.
