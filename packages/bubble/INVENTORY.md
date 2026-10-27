# Inventory — where the Bubble resources were, and where they are now

Gathered on 2026-10-27. "Copied" means the file is in this package and the
original still exists (the app still uses the original until the switch).

## Gathered into this package

| Resource | Was at | Now at | State |
|---|---|---|---|
| UI library: components, modules, pages | `src/ui/{components,modules,pages}` | `src/{components,modules,pages}` | Copied |
| Tinai environments, TinaiScope, TinaiAmbient, MagneticTray | `src/ui/tinai` | `src/tinai` | Copied |
| Tinai personas | — | `src/tinai/personas.ts`, `themes/*/PERSONA.md` | **New** (draft) |
| Theme files (JSON, CSS, sheets) | — | `themes/` | **New**, generated |
| Hairline kernel, host, 9 figures | `src/ui/hairline` | `src/hairline` | Copied (MIT notice kept) |
| Bubble manifest schema, Five-Posture kernel | `src/lib/bubble/types.ts` | `src/lib/manifest.ts` | Copied |
| Bubble runtime (device / yazhi-api) | `src/lib/bubble/runtime.ts` | `src/lib/runtime.ts` | Copied |
| Starter bubbles | `src/lib/bubble/starters.ts` | `src/lib/starters.ts` | Copied |
| Yazhi's agents (personas, samples) | `src/lib/chat/yazhi-agents.ts` | `src/lib/agents.ts` | Copied |
| Karupporul data | `src/lib/sangam/karupporul.ts` | `src/lib/karupporul.ts` | Copied (draft) |
| Design tokens | `src/styles/tokens.css` | `styles/tokens.css` | Copied |
| Tinai / Bubble CSS | `src/styles/globals.css` (tail) | `styles/bubble.css` | Copied |
| Brand kit (PDF, specimen, logos) | `brand-kit/` | `design/brand/` | Copied |
| Design PDFs | — | `design/pdf/` | **New**, generated |

## Still in the app (yazhi-dev), by design

These are app shells, not reusable UI; they consume the system.

| What | Where | Why it stays |
|---|---|---|
| Yazhi Chat | `src/components/chat/*`, `src/app/chat` | Uses the app's chat store, `/api/chat` and Circle |
| Bubble UI shell and demo | `src/components/bubble/{BubbleUI,BubbleDemo,BubbleAnatomy,DevShell}.tsx` | Uses Circle and `/api/bubble/run` |
| Design book page | `src/components/bubble/design/*`, `src/app/bubble/design` | The live book; its PDF is here |
| Library docs site | `src/app/bubble/{components,modules,pages}`, `src/ui/docs` | The live docs; screenshots are in the screens PDF |
| Circle account UI | `src/components/circle/*` | Account and session, not design |
| Chat agents registry (with guests) | `src/lib/chat/agents.ts` | Mixes in the Gemini/ChatGPT guest agents |

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
   `#4a8ab5`. The themes follow the live tokens.
2. **Fonts.** `docs/DESIGN-SYSTEM.md` names Anek Tamil, Hind Madurai and IBM
   Plex Mono. The Brand Identity System v1.1 and the Aram harness name
   Playfair Display (titles), EB Garamond (body) and Noto Sans Tamil (every
   Tamil run). The themes follow the brand system.
3. **Brand kit README paths.** `design/brand/README.md` was written for the
   repo root; its `../src/...` links point at the app's sources.

## Next step: switch the app

1. Add `packages/*` to the root `workspaces` and install.
2. Point `@/ui`, `@/lib/bubble`, `@/lib/sangam` and `yazhi-agents` imports at `@yazhi/bubble`.
3. Import `@yazhi/bubble/styles/bubble.css` instead of the copied block in `globals.css`.
4. Delete the originals once the build and the design-book PDF match.
