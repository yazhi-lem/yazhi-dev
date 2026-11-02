# Citation

Aram rule 1 in the interface: every claim carries an inline `CitationMark`, and the sources are listed as `SourceCard`s — or the answer says it doesn't know.

**Source** (type) — `id`, `title` ("Thirukkural", "India Code"), `locator` (verse, section, page), optional `href`, `excerpt` (a short supporting quote), `verified` (checked by a scholar, lawyer or reviewer).

**CitationMark** — `n`, `source`. A superscript `[n]` in `accent` on a 20% `accent` tint; links to `href`, else to `#src-<id>` on the page.

**SourceCard** — `n`, `source`, optional `footer`. Shows ✓ verified in `mullai` or unverified in `gold`; the excerpt sits behind a 50% `accent` rule.

Number marks and cards the same way (SourcesPanel does this for you). Source: `packages/bubble/src/components/Citation.tsx`.
