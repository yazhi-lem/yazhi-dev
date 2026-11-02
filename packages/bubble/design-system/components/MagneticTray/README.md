# MagneticTray

The living tray: bubbles that swell toward the pointer, each on its landscape's spring — heavy in Palai, buoyant in Kurinji, exact in Marutham, loose in Neytal. A choice sends a ring out to its neighbours, staggered by distance.

**The consumer provides** `items` (`MagneticItem`: `id`, `label`, optional `ta`, `glyph`, `accent` — a small dot), `tinai` (picks the spring), `activeId`, `onSelect(id)`, `size` (resting diameter), `reach` (how far the swell spreads, in bubbles), `vertical` (a column that swells sideways, for a rail) and `label` (the tray's accessible name).

Bubbles are `-surface` with a 70% `-edge` hairline; the active one takes `-hi`. Hit areas never move — only the drawn bubble scales. Keyboard focus lifts a bubble the way the pointer does; reduced motion applies the scale instantly.

Static rendition: the top row is frozen mid-swell in Kurinji, the bottom at rest in Marutham. Source: `packages/bubble/src/tinai/MagneticTray.tsx`.
