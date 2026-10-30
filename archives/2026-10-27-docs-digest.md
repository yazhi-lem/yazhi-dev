# yazhi-dev docs digest, 27 Oct 2026

A snapshot of this repo's documentation on 27 Oct 2026: what yazhi.dev is, a map of the docs that remain, where they
disagree, and compressed copies of the 8 docs retired that day. It is never edited after that date. Live state is in
[`../factory/`](../factory).

## 1. yazhi.dev in brief

The public, Tamil-first community site (Next.js 16 + an R3F tiṇai world), and the shop window for Dev Spaces, Media
and Academy. Q4 goals: 150 members, 30 merged external contributions, 100 cohort-2 applications. The factory board
spec waits on a platform API.

## 2. Doc map (what remains)

| Theme | Docs |
|---|---|
| **Start here** | `README.md` · `factory/` (live plan) · `AGENTS.md` / `CLAUDE.md` (read the bundled Next.js docs before coding) |
| **Community** | `CONTRIBUTING.md` · `CODE_OF_CONDUCT.md` · `docs/community/MODERATION_ROTA.md` · `docs/community/PROPOSAL-YAZHI-DEV-V3.md` (portal → community platform) · `docs/community/PRD-DEVELOPER-COMMUNITY.md` (kept: the onboarding page and code comments cite it) |
| **Site** | `docs/SITE.md` (**new**: 3D world, design tokens, audio, build, consolidated from five docs) · `brand-kit/README.md` |
| **Specs** | `docs/factory-board.md` (Bubbles board over `/v1/factory/*`) |
| **Published content** | `public/yazhi-vision-2030.md` (the v1 code archive `previous-designs/` was removed on 27 Oct; it is in git history) |

## 3. Where docs disagree

| # | Finding | Fix |
|---|---|---|
| D1 | **The About page misstates Adhan**: "Adhan (அதன்) — a 7B-parameter open AI model for 22+ Indian languages". The real model is 14.5M params and Tamil-first, and the name is ஆதன் | `factory/NEXT.md` Y1 |
| D2 | circle.yazhi.dev was due 18 Oct and was unlinked on 23 Oct; CONTRIBUTING still says "launches 18 Oct" | New date + CONTRIBUTING update |
| D3 | The Circle sign-in UI shipped on 23 Oct; the platform session API it needs is not live | Feature-flag it |
| D4 | The "Build & Deploy" workflow only packages the build; how yazhi.dev is actually served is undocumented | `factory/CURRENT.md` |
| D5 | Main-site Tamil strings are "AI review, needs scholar confirmation" | Native sign-off |
| D6 | No lint or test gate before merge; `package.json` has no `test` script | `factory/NEXT.md` Y12 |

## 4. Compressed copies of retired docs

**Plan, superseded by `factory/`**

- **`NEXT_ACTION.md` (Q4 plan, 8 Oct).**
  - *Dev Spaces dates:* 4 Oct platform (self-hosted preferred) · 8 Oct code of conduct + rota · 11 Oct guide + repo
    index · 16 Oct 40 good-first tasks · 17 Oct onboard cohort 1 · 18 Oct launch · 25 Oct two upstream projects ·
    31 Oct build night · 15 Nov 48 h review policy + credit page · 28 Nov Madurai session · 30 Nov 4 upstream
    contributions · 19 Dec Sivakasi session · 31 Dec 2 merged.
  - *The rule:* each federal does first review on its repos within 48 h, and success means outsiders ship merged
    code every week.
  - *Media:* Source (Fri) → Draft → Native review (Mon) → Render → Publish (Tue/Thu/Sat) → Measure. Campaigns:
    31 Oct tokenizer · 14 Nov Open Sangam · 21 Nov Avai · 5 Dec Illakiya · 26 Dec Adhan Kutty. Three carousels +
    one short a week; one long post a month.
  - *Academy:* the programme page shows structure only; cohort-1 capstones are the proof. 20 Nov rubric · 25 Nov
    page + showcase · 1 Dec applications · 15 Dec 15 colleges · 31 Dec 100 applications, then offers.
  - *Dropped from Q4:* the docs hub, API-key dashboard, `yz` installer, self-service gateway, skills registry, CDN.

**Site docs, consolidated into `docs/SITE.md`**

- **`docs/3D-ARCHITECTURE.md`.** R3F + Drei. Scroll is mapped to camera Z, geometry is procedural with a seeded RNG,
  meshes are instanced (~20 draw calls), and quality tiers degrade adaptively below 24 fps. Per-zone terrain
  parameters, glyph canvas textures, zone lighting and fog.
- **`docs/SCROLL-EXPERIENCE.md`.** Five zones at 20% of scroll each, with terrain, props, lighting and glyph density
  per zone and one narrative line per zone. *Since superseded:* the order is now pālai → mullai → kuṟiñci → marutam →
  neytal.
- **`docs/DESIGN-SYSTEM.md`.** Tiṇai colours with their rationale and contrast checks, a 2 s cross-fade, a fluid type
  scale, component tokens (buttons, cards, navbar, sections) and a cultural detail map per zone. *Since
  superseded:* Brand Identity v1.1 (Cobalt/Cream, Playfair Display / EB Garamond).
- **`docs/AUDIO-SETUP.md`.** Asset spec for `yazhi-ambient.mp3` (instrumental yazh/pann, −14 LUFS, < 10 MB), the
  `useAmbientMusic` hook, start-muted autoplay policy, lazy loading, a test checklist and troubleshooting. No audio
  file has been added yet.
- **`docs/DEPLOYMENT-GUIDE.md`.** Static export (~440 KB, ~130 KB gzipped), local serving options, generic hosting
  recipes (Vercel, Netlify, Nginx, S3+CloudFront) and CI. No environment variables needed for the static site.

**Historical**

- **`INDEX.md` (13 Jun).** The first "immersive 100vh" brief: a neon-on-void palette, Space Grotesk/Inter, three
  projects (Yazh app, Adhan, Project Sangam), a services grid, and a hero stat block of "**7B Parameters** · 3 Core
  Projects · ∞ Tamil Heritage". That figure was never true of Adhan, and it survives on the About page (D1).
- **`INTEGRATION-SUMMARY.md` (8 Jul).** The July swap from the cyberpunk site to the Sangam-era 3D world: the v1 site
  archived, procedural landscapes, the audio framework, fonts and tokens, a static build verified, and a
  browser/device/a11y checklist. Still open from then: real audio, a Tamil editorial review, and an end-to-end deploy
  test.
