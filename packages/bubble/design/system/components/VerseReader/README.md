# VerseReader

Open Sangam's reader: numbered verses on the left, the selected verse with its gloss and review state on the right.

**The consumer provides** `title`, `verses` (`Couplet`: `number`, `lines`, `gloss`) and `reviewed` — the scholar sign-off gate. Unreviewed text says so ("awaiting scholar review", warn); reviewed shows "scholar-verified" (ok).

Verse lines are `lang="ta"` at `tamil-lg`; the list truncates by grapheme (`truncateGraphemes`), never by code unit. Dress it in Neytal.

Source: `packages/bubble/src/modules/VerseReader.tsx`.
