# @yazhi/bubble — the Bubble UI/UX system

Everything that makes a Yazhi screen a **Bubble** screen, in one place: the
five tinai themes and their personas, the component library, the Hairline
figures, Yazhi's agents, the brand kit, the design PDFs and the docs.

Covered by the repository's licence ([`/LICENSE`](../../LICENSE)). The
vendored Hairline kernel keeps its own MIT notice
([`src/hairline/LICENSE-hairline`](src/hairline/LICENSE-hairline)).

The yazhi-dev app imports everything Bubble from here (`@yazhi/bubble`,
mapped in the root `tsconfig.json`) and shows it at **yazhi.dev/bubble**:
one page that is the whole library — themes in light and dark, components,
modules, templates, agents and Mission Control — live.

## What's inside

```
packages/bubble/
├── themes/                 the five tinai, one folder each
│   ├── <tinai>/theme.json    palette, motion, persona, karupporul — for any app or tool
│   ├── <tinai>/theme.css     --env-* variables as light-dark() pairs, usable without React
│   ├── <tinai>/PERSONA.md    the theme's persona: voice, copy, do & don't
│   ├── <tinai>/sheet.html    one-page theme sheet (source of the PDF)
│   ├── all.css · index.json
├── design/
│   ├── pdf/                  design PDFs (see below)
│   └── brand/                Brand Identity System v1.1 PDF, specimen, logos
├── src/
│   ├── components/ modules/ pages/   the Yazhi UI library (3 layers)
│   ├── mission/              Mission Control: MarkBubble, MissionControl, ModeSwitch
│   ├── mode.ts, mode-script.ts  light / dark / system, and the no-flash script
│   ├── docs/                 the one-page library (Library) with its catalog and live demos
│   ├── tinai/                environments, personas, TinaiScope, TinaiAmbient, MagneticTray
│   ├── hairline/             Hairline kernel, host and the 9 figures
│   ├── lib/                  manifest schema, runtime, starters, Yazhi agents, karupporul
│   └── index.ts
├── styles/                 tokens.css, bubble.css
├── docs/                   the written system (start with BUBBLE-UI.md)
└── scripts/                build-themes.mjs, build-pdfs.mjs
```

## The five tinai themes

| Tinai | Persona | Signature | Use for | Agents |
|---|---|---|---|---|
| Palai | The Wayfarer | Heat over sand | Security, infra, hard engineering | Kural |
| Mullai | The Keeper | Fireflies under the canopy | Community, Dev Spaces, Academy | Guru |
| Kurinji | The Seeker | Mist on the ridge | Launches, first releases, onboarding | Pulavar |
| Marutham | The Arbiter | Wind over paddy | Civic and legal, everyday commerce | Nyaya, Annachi |
| Neytal | The Voyager | Tide lines | Diaspora, Yazh (parents), language loss | — |

Each theme is a palette in dark and light, a spring (how it moves), an ambient field (how it
answers the pointer), a Hairline figure, the landscape's karupporul and a
**persona**: who the screen is, how it speaks, the copy it uses for empty,
loading, success, error and confirm, and what it never does. Persona names,
voice and all Tamil text are **drafts pending native review**.

## Light and dark

Every colour is a CSS `light-dark()` pair. Put Bubble screens inside
`.bubble-root` and they follow the system; `data-mode="light"` or `"dark"` on
`<html>` pins a choice (`useColorMode` / `ModeSwitch` set it, and
`MODE_SCRIPT` applies it before the first paint). `<TinaiScope scheme="light">`
pins one subtree. Text stays at 15:1 or more, secondary text at 6.9:1 or
more and accents at 5:1 or more on every ground, in both modes.

## Mission Control

The Yazhi mark — three bubbles — held inside a bubble, leading every
composer and header. It sleeps until a Circle account is signed in (pressing
it then opens sign-in or join) and wakes once one is; awake it opens the
account, the theme and, in a chat, the landscape and where replies run.
`MissionControl` is the button; the host places the panel and fills it with
`MissionSection` blocks.

```tsx
<Composer leading={<MissionControl active={signedIn} who={name} onPress={open} />} onSend={send} />
```

## Using a theme

Use a theme three ways:

```tsx
import { TinaiScope } from "@yazhi/bubble";
<TinaiScope tinai="marutham">…</TinaiScope>
```
```css
@import "@yazhi/bubble/themes/all.css";   /* then <body data-tinai="marutham" style="color-scheme: light dark"> */
```
```ts
import theme from "@yazhi/bubble/themes/marutham/theme.json";
```

## Design PDFs (`design/pdf/`)

| File | What |
|---|---|
| `bubble-ui-library-dark.pdf`, `bubble-ui-library-light.pdf` | The whole library page (`/bubble`) in each mode |
| `tinai-palai.pdf` … `tinai-neytal.pdf` | One theme sheet per tinai: both palettes, motion, persona, copy, karupporul |
| `bubble-ui-screens.pdf` | Yazhi Chat with each agent, Mission Control asleep and awake, and the library — dark and light |
| `../brand/yazhi-brand-kit.pdf` | Brand Identity System v1.1 (source spec) |

## Rebuilding

```sh
# from packages/bubble
npm run themes                      # regenerate themes/ from src/ data
# PDFs need the site running (repo root: npm run build && npm start)
BASE_URL=http://localhost:3000 npm run pdfs
```

The themes are generated from `src/tinai/environments.ts`,
`src/tinai/personas.ts`, `src/lib/karupporul.ts` and `src/lib/agents.ts`,
so edit those and regenerate rather than editing `themes/` by hand.

## Docs

- [docs/BUBBLE-UI.md](docs/BUBBLE-UI.md) — what a Bubble is: tray, bubbles, composer, Circle, runtimes, manifest
- [docs/THEMES.md](docs/THEMES.md) — the tinai theme system and personas
- [docs/AGENTS.md](docs/AGENTS.md) — Yazhi's agents and which are held back
- [docs/HAIRLINE.md](docs/HAIRLINE.md) — the figures and the ten rules
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) — the rules every Bubble screen keeps
- [INVENTORY.md](INVENTORY.md) — where everything came from, and what stays in the app
