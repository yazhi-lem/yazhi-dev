# Pill

A small status label in one of six tones; `RuntimeBadge` and `DraftTag` are the two standard pills built on it.

**Pill** — `children`, `tone` (`neutral` · `ok` · `warn` · `risk` · `info` · `accent`), `lang`, `title`. Latin text is set in `mono-label` (tracked caps); pass `lang="ta"` for Tamil, which drops to 11px and is **never letter-spaced** — the pill also detects Tamil or Telugu script in plain-text children and does the same.

Tones map to tokens: ok → `mullai`, warn → `gold`, risk → `palai`, info → `neytal`, accent → `accent`, neutral → `ivory-dim` on a 20% `ivory` border.

**RuntimeBadge** — `runtime`: `device` (on-device, ok), `yazhi-api` (info) or `offline` (warn). Every AI surface shows one.

**DraftTag** — `what` (default "Tamil copy"). Put it beside any Tamil that has not passed native-speaker review.

Source: `packages/bubble/src/components/Pill.tsx`.
