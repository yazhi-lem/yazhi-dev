# Yazhi (யாழி) Brand Kit

Generated from the live design tokens (`../src/styles/tokens.css`) and the
existing mark (`../src/components/ui/LogoMark.tsx`), brought into compliance
with the Brand Identity System v1.1 (`Yazhi Brand Kit.pdf`, May 2026):
three floating bubbles at ratio 1.00:0.74:0.56 with equal edge gaps, solid
Cobalt/Cream fill (no gradient), and Playfair Display / EB Garamond type.

## Contents

```
brand-kit/
├── brand-kit.html                          specimen sheet — logos, palette, type
├── yazhi-brand-kit.pdf                     the full Brand Identity System v1.1 (source spec)
└── logos/
    ├── yazhi-mark.svg                       icon, Cobalt — for Cream/white grounds
    ├── yazhi-mark-mono-ivory.svg            icon, flat cream — for dark surfaces
    ├── yazhi-mark-mono-night.svg            icon, flat ink — for light surfaces
    ├── favicon.svg                          icon on an ink rounded backdrop
    ├── yazhi-wordmark-dark.svg              "Yazhi", cream — for dark surfaces
    ├── yazhi-wordmark-light.svg             "Yazhi", ink — for light surfaces
    ├── yazhi-wordmark-tamil-dark.svg        "யாழி", cream — for dark surfaces
    ├── yazhi-wordmark-tamil-light.svg       "யாழி", ink — for light surfaces
    ├── yazhi-lockup-horizontal-dark.svg     mark + "Yazhi", for dark surfaces
    └── yazhi-lockup-horizontal-light.svg    mark + "Yazhi", for light surfaces
```

To view the specimen sheet, serve the folder rather than opening the HTML
file directly — the page fetches the SVGs, which browsers block over
`file://`:

```sh
npx serve brand-kit
```

The specimen page has a "Download the Brand Identity System (PDF)" button
up top (serving `yazhi-brand-kit.pdf` from this folder), and every logo
card has its own "Download SVG" link.

## Usage rules

- **Preserve the equal gaps between bubbles in every reproduction.** Radius
  ratio is 1.00 (large) : 0.74 (medium) : 0.56 (small); every pairwise
  edge-to-edge gap must be identical. Never close, shrink, or unequalise a
  gap, and never let the bubbles touch or overlap — this single constraint
  is what makes the mark "float" rather than clump.
- **Never rearrange the bubbles, change their size ratios, stretch, skew,
  or rotate the mark.** Scale the whole viewBox uniformly only.
- **Never add shadows, gradients, or glows to the bubbles** — solid fill
  only.
- **Color pairing**: Cobalt (`#1840d8`) bubbles sit only on Cream or white
  grounds. On dark grounds the mark reverses to Cream (`#f8f5ef`) — use
  `yazhi-mark-mono-ivory.svg`, not the Cobalt version, on a dark surface.
  Use the ink-mono version (`yazhi-mark-mono-night.svg`) only on light
  surfaces where a full-color mark would be inappropriate (stamps,
  engraving-style contexts).
- **Prefer the horizontal lockup** wherever there's room. Use the mark alone
  only for favicons, app icons, and avatar-sized placements.
- **Minimum size**: mark 20px, lockup 120px wide. Below that, use a
  mono variant, not the two-tone version — fine bubble edges get muddy at
  small sizes.
- **Clear space**: keep clear space of one large-bubble diameter on all
  sides.
- **Never substitute the wordmark typeface.**

## Color palette — the Sovereign Palette

| Token | Hex | Role |
|---|---|---|
| `--night` (Ink) | `#0a0a0a` | page ground |
| `--night-2` | `#161616` | raised surfaces / cards |
| `--ivory` (Cream) | `#f8f5ef` | primary text on dark; the mark's reversed fill |
| `--ivory-dim` | `#cbc9c4` | secondary text |
| `--bronze` (Gold) | `#c49a38` | base gold accent |
| `--gold` | `#d3b36a` | gold, lightened — highlights, hover, focus ring |
| Cobalt | `#1840d8` | primary mark color — Cream/white grounds only |

Full token list, including the five *thiṇai* accent hues (`--kurinji`,
`--mullai`, `--marutham`, `--neytal`, `--palai`) and the ocean footer
palette — a separate in-world zone-theming system, unaddressed by the
Brand Identity System and left as-is: `../src/styles/tokens.css`.

## Type system

- **Wordmark**: Playfair Display, Black (900), −3px tracking
- **Section headings**: Playfair Display, Bold (700)
- **Body**: EB Garamond, Regular (400)
- **Tamil**: Noto Serif Tamil (400/600) — chained as the fallback for any
  Tamil glyph in both the display and body stacks, since neither Playfair
  Display nor EB Garamond has Tamil coverage
- **Mono** (code/labels, unaddressed by the brand kit): IBM Plex Mono,
  self-hosted — `../public/fonts/IBMPlexMono-*.woff2`

The live site self-hosts all four via `next/font` in `../src/app/layout.tsx`
(Playfair Display / EB Garamond / Noto Serif Tamil via `next/font/google`,
IBM Plex Mono via `next/font/local`). This specimen page loads the same
three from the public Google Fonts CDN since it has no build step.

## Not covered here

This kit packages the mark, palette, and type system as specified in the
Brand Identity System v1.1 — it does not propose new logo concepts or a
print/merch guideline. It also does not touch the site's five-*thiṇai*
zone-theming system (scroll-linked `--accent`, 3D zone lighting/fog), which
is a separate design layer the Brand Identity System doesn't address.
