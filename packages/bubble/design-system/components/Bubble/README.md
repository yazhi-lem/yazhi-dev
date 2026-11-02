# Bubble

The Yazhi bubble: one app, agent or tool, drawn as a lit sphere in its accent colour with its first glyph.

Use it in the Bubble UI tray and anywhere an app needs a compact identity mark (AppFrame's header uses one at 36px).

**The consumer provides**
- `accent` — a CSS colour, usually a tiṇai token: `var(--marutham)`.
- `label` — the accessible name (the app or agent name).
- `glyph` — optional; defaults to the first grapheme of `label` (cut with `Intl.Segmenter`, so கு is never torn).
- `size` — diameter in px (default 40). `active` adds the `ivory` ring on a `night-2` offset.
- `onSelect` — makes it a button with `aria-pressed`; without it the bubble is `role="img"`. `title` for the tooltip.

**Do** size bubbles by how much work lives behind them (tray radii `bubble-l` / `bubble-m` / `bubble-s`). **Don't** let bubbles touch, or add glows: the shading is the one radial gradient built from `accent`.

Source: `packages/bubble/src/components/Bubble.tsx`.
