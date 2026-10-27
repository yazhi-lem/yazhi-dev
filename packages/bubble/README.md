# @yazhi/bubble — the Bubble UI/UX system

Everything that makes a Yazhi screen a **Bubble** screen, in one place: the
five tinai themes and their personas, the component library, the Hairline
figures, Yazhi's agents, the brand kit, the design PDFs and the docs.

Covered by the repository's licence ([`/LICENSE`](../../LICENSE)). The
vendored Hairline kernel keeps its own MIT notice
([`src/hairline/LICENSE-hairline`](src/hairline/LICENSE-hairline)).

> **Status:** gathered here as a copy. The yazhi-dev app still uses its own
> `src/ui`, `src/lib/bubble` and friends; switching the app to import from
> this package is the next step (see [INVENTORY.md](INVENTORY.md)).

## What's inside

```
packages/bubble/
├── themes/                 the five tinai, one folder each
│   ├── <tinai>/theme.json    palette, motion, persona, karupporul — for any app or tool
│   ├── <tinai>/theme.css     --env-* variables, usable without React
│   ├── <tinai>/PERSONA.md    the theme's persona: voice, copy, do & don't
│   ├── <tinai>/sheet.html    one-page theme sheet (source of the PDF)
│   ├── all.css · index.json
├── design/
│   ├── pdf/                  design PDFs (see below)
│   └── brand/                Brand Identity System v1.1 PDF, specimen, logos
├── src/
│   ├── components/ modules/ pages/   the Yazhi UI library (3 layers)
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
| பாலை Palai | வழிப்போக்கர் The Wayfarer | Heat over sand | Security, infra, hard engineering | Kural |
| முல்லை Mullai | காத்திருப்பவர் The Keeper | Fireflies under the canopy | Community, Dev Spaces, Academy | Guru |
| குறிஞ்சி Kurinji | தேடுபவர் The Seeker | Mist on the ridge | Launches, first releases, onboarding | Pulavar |
| மருதம் Marutham | நடுவர் The Arbiter | Wind over paddy | Civic and legal, everyday commerce | Nyaya, Annachi |
| நெய்தல் Neytal | பயணி The Voyager | Tide lines | Diaspora, Yazh (parents), language loss | — |

Each theme is a palette, a spring (how it moves), an ambient field (how it
answers the pointer), a Hairline figure, the landscape's karupporul and a
**persona**: who the screen is, how it speaks, the copy it uses for empty,
loading, success, error and confirm, and what it never does. Persona names,
voice and all Tamil text are **drafts pending native review**.

Use a theme three ways:

```tsx
import { TinaiScope } from "@yazhi/bubble";
<TinaiScope tinai="marutham">…</TinaiScope>
```
```css
@import "@yazhi/bubble/themes/all.css";   /* then <body data-tinai="marutham"> */
```
```ts
import theme from "@yazhi/bubble/themes/marutham/theme.json";
```

## Design PDFs (`design/pdf/`)

| File | What |
|---|---|
| `bubble-design-book.pdf` | The whole design book (`/bubble/design`) |
| `tinai-palai.pdf` … `tinai-neytal.pdf` | One theme sheet per tinai: palette, motion, persona, copy, karupporul |
| `bubble-ui-screens.pdf` | Yazhi Chat with each agent, settings, the design book and the library |
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
- [INVENTORY.md](INVENTORY.md) — where everything came from, and what is still elsewhere
