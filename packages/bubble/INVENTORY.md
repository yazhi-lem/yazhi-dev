# Inventory — where the Bubble resources were, and where they are now

Gathered on 2026-10-27, then switched over the same day: the app imports
from this package and the old copies are deleted.

## In this package

| Resource | Was at | Now at |
|---|---|---|
| UI library: components, modules, pages | `src/ui/{components,modules,pages}` | `src/{components,modules,pages}` |
| Library page, catalog, live demos | `src/app/bubble/{components,modules,pages,design}`, `src/ui/docs`, `src/components/bubble/design` | `src/docs` (one page: `Library`) |
| Tinai environments, TinaiScope, TinaiAmbient, MagneticTray | `src/ui/tinai` | `src/tinai` (now with light palettes) |
| Tinai personas | — | `src/tinai/personas.ts`, `themes/*/PERSONA.md` (draft) |
| Theme files (JSON, CSS, sheets) | — | `themes/`, generated |
| Light / dark mode | — | `src/mode.ts`, `src/mode-script.ts`, `styles/bubble.css` |
| Mission Control (replaces the Circle "C" button) | `src/components/circle/CircleButton.tsx` | `src/mission` |
| Hairline kernel, host, 9 figures | `src/ui/hairline` | `src/hairline` (MIT notice kept) |
| Bubble manifest schema, Five-Posture kernel | `src/lib/bubble/types.ts` | `src/lib/manifest.ts` |
| Bubble runtime (device / yazhi-api) | `src/lib/bubble/runtime.ts` | `src/lib/runtime.ts` |
| Starter bubbles | `src/lib/bubble/starters.ts` | `src/lib/starters.ts` |
| Yazhi's agents and the chat data model | `src/lib/chat/{yazhi-agents,types}.ts` | `src/lib/{agents,agent-types}.ts` |
| Karupporul data | `src/lib/sangam/karupporul.ts` | `src/lib/karupporul.ts` (draft) |
| Design tokens, Tailwind colour names, tinai CSS | `src/styles/{tokens,globals}.css` | `styles/{tokens,bubble}.css` |
| Brand kit (PDF, specimen, logos) | `brand-kit/` | `design/brand/` (copy; the root folder stays for the site) |
| Design PDFs | — | `design/pdf/`, generated |

## Still in the app (yazhi-dev), by design

App shells that consume the system:

| What | Where | Why it stays |
|---|---|---|
| Yazhi Chat | `src/components/chat/*`, `src/app/chat` | Uses the app's chat store, `/api/chat` and Circle |
| Library route and builder docs | `src/app/bubble`, `src/components/bubble/{BuildDocs,DevShell}.tsx` | yazhi.dev's routes, Circle and deployment notes |
| Bubble UI host (playground) | `src/components/bubble/{BubbleUI,BubbleDemo,BubbleAnatomy}.tsx` | Uses Circle and `/api/bubble/run` |
| Mission Control wiring | `src/components/mission/Mission.tsx` | Connects the package's Mission Control to Circle |
| Circle account UI | `src/components/circle/*` | Account and session, not design |
| Chat agents registry (with guests) | `src/lib/chat/agents.ts` | Mixes in the Gemini/ChatGPT guest agents |

The old routes `/bubble/design`, `/bubble/components`, `/bubble/modules`,
`/bubble/pages` and `/bubble/pages/<app>` redirect to the matching section
of `/bubble`.

## Elsewhere, referenced only

| What | Where | Note |
|---|---|---|
| Bubbles service contract | yazhi-api (private repo) | Not copied or described here: yazhi-api stays private, and this repo is public |
| Factory board spec (Bubbles UI) | `docs/factory-board.md` | Read-only board built with bubbles; summarised in docs/BUBBLE-UI.md |
| Site design system notes | `docs/DESIGN-SYSTEM.md` | **Out of date** — see conflicts below |

## Conflicts to settle

1. **Tinai hues.** `docs/DESIGN-SYSTEM.md` gives Kurinji `#9D7BC7`, Mullai
   `#6B9F2F`, Marutham `#C17B3D`, Palai `#CC6B4A`, Neytal `#4A9ECC`. The live
   tokens (and these themes) use `#8b7ae0`, `#4f9d6b`, `#b7a03c`, `#c25b3c`,
   `#4a8ab5`; inside `.bubble-root` Palai's dark text tone is lifted to
   `#d6704f` so small text passes AA.
2. **Fonts.** `docs/DESIGN-SYSTEM.md` names Anek Tamil, Hind Madurai and IBM
   Plex Mono. The Brand Identity System v1.1 and the Aram harness name
   Playfair Display (titles), EB Garamond (body) and Noto Sans Tamil (every
   Tamil run). The themes follow the brand system.
3. **Brand kit README paths.** `design/brand/README.md` was written for the
   repo root; its `../src/...` links point at the app's sources.
