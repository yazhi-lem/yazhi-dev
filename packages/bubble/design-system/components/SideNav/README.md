# SideNav

The left-hand rail: the Yazhi mark, a tray of app bubbles with their names, up to five word destinations, and Settings in the foot.

## Anatomy

- `yz-nav` — `nav-width` (248px), `tn-tint` background, `radius-lg`.
- `yz-nav__brand` — MissionControl and "யாழி · Yazhi".
- `yz-tray` — the Bubble UI app switcher: Guru, Nyaya, Kural, each a bubble over its name. The current app is lifted onto `tn-panel`.
- `yz-nav__item` — an icon, then `yz-nav__label` (Tamil) over `yz-nav__sub` (English). At least `tap-min` tall. The current page is `aria-current="page"`: `tn-panel` with a 2px `tn-state` ring, no stripes or side borders.
- `yz-nav__count` — a red count on a destination that needs attention (Kural's new tickets). Its `aria-label` says "4 new".
- `yz-nav__foot` — Settings, and any grown-up or admin area, pinned to the bottom.

## Rules

- Five destinations at most, as words. In a single-language mode drop `yz-nav__sub`.
- Below 720px the rail becomes a top bar with the same words, and the tray becomes a row.
