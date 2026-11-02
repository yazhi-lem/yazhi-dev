# ModeSwitch

Light, dark or the system's choice. Always available, signed in or not — the theme switch is never behind a sign-in.

**The consumer provides** `compact` (one 44px button that steps system → light → dark) and `className`. Otherwise a three-way radio group with names; the chosen mode is an `ivory` pill with `night` text, and keyboard focus shows a 2px `gold` outline.

It sets `data-mode` on `<html>` through `useColorMode`; `MODE_SCRIPT` applies a stored choice before the first paint. Source: `packages/bubble/src/mission/ModeSwitch.tsx`, `mode.ts`.
