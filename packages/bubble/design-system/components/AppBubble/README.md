# AppBubble

An app or agent drawn as a flat pastel disc with its first Tamil grapheme. It is always shown with its name.

## Classes

- `yz-bubble` plus an app class: `yz-bubble--guru`, `yz-bubble--nyaya` or `yz-bubble--kural`. Any other app sets `--app` to a pastel token.
- Sizes: `yz-bubble--l` (76px), default (56px), `--s` (42px), `--xs` (36px).
- `yz-tray` with `yz-tray__app` links: the app switcher at the top of the SideNav. Bubble above, name below. `aria-current="true"` lifts the current app onto `tn-panel`.

## Rules

- **Never a bubble without its name.** Guru and Kural both start with கு, so the grapheme alone can't tell them apart. Show the name as visible text.
- Flat fill with a thin inner edge. No gradient, no glow. This replaces Bubble's lit sphere. The Yazhi mark is not an app bubble: it lives in MissionControl.
- Bubbles never touch: keep at least `space-1` between them.

## Consumer provides

The app, its Tamil grapheme, its name and the link.
