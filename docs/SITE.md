# yazhi.dev site — 3D world, design, audio, build

One reference for how the site is built. It replaces five July docs (3D architecture, scroll experience, design
system, audio setup, deployment guide), which are summarised in `archives/2026-10-27-docs-digest.md` §4. Brand
assets and rules live in [`../brand-kit/`](../brand-kit).

## 1. The idea

Scrolling is travelling. Page scroll drives a camera through five procedurally generated **tiṇai** landscapes, so
the page content and the world tell one story. The journey order is **pālai → mullai → kuṟiñci → marutam → neytal**
(hardship → waiting → union → cultivation → reunion), and that order is the single source used by the text, the
gallery and the 3D zones (`src/lib/content.ts`, `src/three/materials/zones.ts`).

| Tiṇai | Landscape | Theme hue | Terrain (freq / amplitude) | Feeling |
|---|---|---|---|---|
| Pālai | desert | ochre `#CC6B4A` | 0.08 / 8, sharp dunes | hardship endured |
| Mullai | forest | green `#6B9F2F` | 0.04 / 6, rolling hills | patient growth |
| Kuṟiñci | mountains | violet `#9D7BC7` | 0.045 / 22, peaks with a carved valley | union |
| Marutam | farmland | gold `#C17B3D` | 0.06 / 2, paddy strips | cultivation |
| Neytal | coast | sea blue `#4A9ECC` | 0.03 / 1, slope into water | reunion |

## 2. 3D architecture (`src/three/`)

- **Stack:** React Three Fiber + Drei on Three.js. There are no downloaded models: all geometry is generated at
  runtime from a seeded RNG, so every visit renders the same world.
- **`ThinaiWorld.tsx`** orchestrates the scene. Quality tiers: high (140-segment terrain, all props, AA, DPR 1.5),
  mid (100 segments, DPR 1.0) and low (56 segments, sparse props, no AA). It starts high and downgrades once,
  without flicker, if the frame rate drops below 24 fps.
- **`Terrain.tsx`** builds simplex-noise heightfields per zone, with a valley carved down the camera path.
- **`SangamObjects.tsx`** places instanced cultural props per zone, about 20 draw calls in total instead of 1,000+.
  Props are placed by zone key.
- **`CameraRig.tsx`** + **`useScrollProgress.ts`** map scroll progress to camera Z. Progress is held in a ref, not
  state, so scrolling never re-renders React. Pointer movement adds parallax.
- **`GlyphField.tsx`** draws Indic glyphs as canvas textures in side bands (|x| 24–62), so they frame the reading strip
  and never cover it.
- **Lighting:** one theme-coloured light per zone, plus fog and a gradient sky. DOM theme colours cross-fade over
  ~2 s.
- **Degradation:** `prefers-reduced-motion` and low-end devices get the static or low tier; content never depends
  on WebGL.

## 3. Design tokens

- **Source of truth:** `src/styles/tokens.css`, generated into `brand-kit/`. Brand Identity v1.1 is the mark (three
  bubbles, ratio 1.00 : 0.74 : 0.56), solid Cobalt/Cream, and Playfair Display / EB Garamond.
- **Type:** Playfair Display + EB Garamond (Latin), Noto Serif Tamil (Tamil), plus a local display font, all
  loaded in `src/app/layout.tsx`. Sizes are fluid with `clamp()`. **Never letter-space Tamil.**
- **Accessibility:** zone colours are checked for contrast against their backgrounds (accent on dark ≈ 10:1); focus
  states are visible; motion respects user settings.
- **Copy rule:** narrative lines must not overstate the models. The July copy ("22+ scripts uniting around one
  model") came from the same source as the "7B" claim (see `factory/NEXT.md` Y1).

## 4. Audio (framework only)

A muted-by-default ambient player (`useAmbientMusic`) expects `/public/audio/yazhi-ambient.mp3`: instrumental yazh/pann,
3–5 minutes, looped, −14 LUFS, 128–192 kbps, under 10 MB, lazy-loaded. No audio file has been added yet. Browsers
block autoplay, so the player always starts muted and offers an unmute button.

## 5. Build and run

```bash
npm ci
npm run dev            # http://localhost:3000
npm run build          # production build in .next/
npm run lint
bash scripts/deploy.sh ./build-output   # packages static assets + docs into a folder
```

- No environment variables are needed for the static site. The `/chat`, `/api/*` and Circle sign-in routes need
  their own server-side configuration.
- CI (`.github/workflows/build-and-deploy.yml`) builds on every change, packages on `main`, and runs a Lighthouse
  audit on proposed changes. **It does not publish anywhere.** The "deploy" job only prepares a package, so the step
  that actually serves yazhi.dev is not documented in this repo (`factory/CURRENT.md`).
- Next.js 16 has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before changing
  routing or config (`AGENTS.md`).
