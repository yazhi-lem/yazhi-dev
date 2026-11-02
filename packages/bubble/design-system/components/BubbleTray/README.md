# BubbleTray

The packed column of bubbles from the Bubble UI sketch: circles that never touch, laid out deterministically. On phones it becomes one scrolling row of 40px bubbles.

**The consumer provides** `items` (`TrayItem`: `id`, `label`, `accent`, `size` `s`·`m`·`l`, optional `glyph`, `title`), `activeId`, `onSelect(id)`, `width` (default 150), and `label` — the tray's accessible name; make it unique when a page has two.

Radii are `bubble-l` 38px, `bubble-m` 28px, `bubble-s` 21px (ratio 1 : 0.74 : 0.55), packed with a 6px gap by `packColumn()`. Size by how much work lives behind each bubble. Hit areas never move.

This preview places the bubbles by hand; the real tray packs them. Source: `packages/bubble/src/modules/BubbleTray.tsx`, `modules/pack.ts`.
