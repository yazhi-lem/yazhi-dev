# ThinaiMissionControl

The Yazhi mark inside a bordered flat bubble, as in Bubble UI: a `tn-mission` ring, a 14% `tn-mission` wash, and the three-bubble mark in `tn-ink` at 0.56 scale. It is the brand in the nav and the person's controls in the composer.

## States

- **Awake** (signed in): solid ring, wash, filled mark. Pressing it opens account, language, theme, text size and settings (`aria-haspopup="dialog"`).
- **Asleep** (signed out): dashed ring, no wash, open rings for the mark. Pressing it opens sign-in. Theme and text size stay one press away in the nav foot, signed in or not.

## Markup

`<button class="yz-mission" aria-label="Mission Control: signed in as …">` wrapping a 100-unit SVG:
- an outer `<circle r="46.5">` with `fill: var(--mission-wash)`, `stroke: var(--mission)` at 2.5 and `vector-effect: non-scaling-stroke`
- a group `translate(50 50) scale(0.56) translate(-50 -50)` holding the mark's circles: (30.8, 30.6, r 12.3), (65.2, 26.9, r 16.3), (47.2, 67.4, r 22)

Sizes: 48px default, `--sm` 44px, `--lg` 56px. In the nav brand it is a `span role="img"` named "Yazhi".

## Rules

- `tn-mission` is Bubble's gold, tuned per theme: #6e5312 by day and #d3b36a at night. It is 4.5:1 or better on every surface.
- The mark inside takes `tn-ink`, so it is dark on pastel and cream at night, as in Bubble.
- Never recolour the mark to an app or thiṇai colour, and never drop the ring. The ring is what makes it Mission Control.
