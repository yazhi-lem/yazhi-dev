# Yazhi Design System

> Shared visual language, tokens, and assets for the Yazhi ecosystem.

## Assets

`/assets` contains every logo variant in SVG:

| File | When to use |
|---|---|
| `yazhi-mark.svg` | Icon / favicon / small avatar (24–48 px) |
| `yazhi-mark-mono-ivory.svg` | Dark backgrounds |
| `yazhi-mark-mono-night.svg` | Light backgrounds |
| `yazhi-wordmark-dark.svg` | Header nav, dark text on light |
| `yazhi-wordmark-light.svg` | Header nav, light text on dark |
| `yazhi-wordmark-tamil-dark.svg` | Tamil-language contexts, dark |
| `yazhi-wordmark-tamil-light.svg` | Tamil-language contexts, light |
| `yazhi-lockup-horizontal-dark.svg` | Full horizontal lockup (mark + wordmark), dark |
| `yazhi-lockup-horizontal-light.svg` | Full horizontal lockup, light |
| `favicon.svg` | Browser tab icon |

## Usage in this repo

```tsx
import YazhiMark from '@/design-system/assets/yazhi-mark.svg'

// Next.js with @svgr/webpack
<YazhiMark className="w-8 h-8" />
```

## Cross-repo usage

Copy the SVG you need into your repo and inline it, or reference the raw file from the CDN:

```
https://raw.githubusercontent.com/yazhi-lem/yazhi-dev/main/design-system/assets/yazhi-mark.svg
```

## Colours

Yazhi uses a warm accent derived from sangam landscape palettes. The canonical token is:

- **Accent**: `#C65D3B` (Kurunthogai terracotta)
- **Ivory**: `#FAF6F1`
- **Night**: `#1A1A1A`

See `src/styles/tokens.css` in yazhi-dev for the full Tailwind token map.
