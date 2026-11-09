# AppShell

The whole screen: SideNav on the left, the app header (bubble, Tamil name, draft tag, English line, language switch) across the top of the main column, then the content and the Composer.

## Anatomy

- `yz-shell` — set `data-theme` and `data-tn` here. Each app opens in its own thiṇai (Guru `data-tn="mullai"`, Nyaya `"marutham"`, Kural `"paalai"`, all with `data-theme="light"`) unless the person chose a theme in Settings; Night is `data-theme="dark"`.
- `yz-main__top` — `yz-main__app` (bubble + `yz-hello yz-hello--sm`) and `yz-main__tools` (LanguageToggle).
- Content — a Conversation, a Card, a list (`yz-list` / `yz-item`), or Settings.
- `yz-split` — main column plus a 20rem side column for sources or exact figures. It stacks below 900px.

## Rules

- One screen, one job, one go/stop pair.
- The app name in the header carries `† draft` until a Pulavar reviews it.
