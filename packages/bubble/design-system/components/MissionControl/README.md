# MissionControl

Mission Control: the three-mark bubble that leads every composer and header, plus `MissionHeader` and `MissionSection` for the panel it opens.

**MissionControl** (the button) — `active` (a Circle account is signed in), `onPress`; optional `busy` (session being checked: a `gold` ping), `open`, `controls` (panel id for `aria-controls`), `who` (for the accessible name), `size`, `className`. The hit area is at least 44px. Asleep, pressing it asks you to sign in or join; awake it opens the person's controls. The mark breathes once when it wakes.

**MissionHeader** — `title` (default "Mission Control"), `onClose`. The awake mark, a `font-display` title, and a 44px close button that takes focus.

**MissionSection** — `title` (a `mono-label` heading), `children`, optional `aside`. Blocks are divided by 10% `ivory` hairlines.

The host decides where the panel opens (a side sheet in a chat, a drop-down under a header) and what it holds: the account, the theme, the landscape, where replies run. Source: `packages/bubble/src/mission/MissionControl.tsx`.
