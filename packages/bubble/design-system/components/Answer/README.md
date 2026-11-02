# Answer

Answers whose every sentence carries a citation or is not said: `CitedAnswer`, `SourcesPanel`, and Nyaya's `LegalAnswerCard`.

**AnswerPart** (type) — `text`, optional `cite` (index into `sources`).

**CitedAnswer** — `parts`, `sources`, optional `fallbackReason`. With no sources or parts it renders `IDontKnow` instead.

**SourcesPanel** — `sources`, `title` (default "Sources"). The evidence column of Avai, Nyaya and Guru; numbering matches the marks.

**LegalAnswerCard** — `question`, `parts`, `sources`, `validity` (0–1, the share of cited sections matched to stored Act text; below 95% the pill turns `palai`). Always ends with the legal Disclaimer. Nyaya informs; it never advises.

Legal sources here are bracketed placeholders, as in the repo's samples. Source: `packages/bubble/src/modules/Answer.tsx`.
