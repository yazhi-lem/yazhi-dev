# AppFrame

The shell every Yazhi app page shares: an identity header (bubble, names, runtime, account slot), an optional sample-data notice, a main column and an optional 20rem side column. It sets `accent` for everything inside.

**The consumer provides** `app` (`AppIdentity`: `name`, `taName`, `tagline`, `accent` — usually a tiṇai token like `var(--marutham)` — and `runtime`), `children`; optional `account` (the header's right side, usually MissionControl), `sample` (default true: shows the sample Disclaimer), `aside`, `embedded` (columns become plain divs inside another page).

The seven templates (`PAGE_TEMPLATES`, `PAGE_COMPONENTS`) are built on it: Avai (Kurinji), Nyaya (Marutham), Kural Desk (Palai), Guru (Mullai), Kadai (Gold), Open Sangam (Neytal) and Yazh — for parents (Neytal). Source: `packages/bubble/src/pages/AppFrame.tsx`, `pages/catalog.ts`, `pages/AppPages.tsx`.
