# Workspace primitives

The pieces the product workspaces (Guru, Nyaya, Kural, Kadai) share. Same rules as the rest of Bubble: hairlines, not shadows; gold for the one action; Tamil never letter-spaced.

**PageChip** — `book`, `page`, `active`, `verified`, `onOpen`. A citation to one page, section, clause or record (`p. 118`, `s.138`, `cl. 4`, `#KD-1042`). Pressing it opens the source beside the answer. ✓ when the citation verifier found the span; `?` when it did not. Mono 11px in the `accent` tone; filled at 20% `accent` when active. Aram rule 1.

**MachineDraft** — `approvedBy`. "இயந்திர வரைவு · machine draft" (warn) on every generated item until a person approves; then "✓ approved · <who>" (ok).

**SampleTag** — "மாதிரித் தரவு · sample data" on every reply in demo mode.

**HandoffCard** — `title`, `reason`, `ticket`, `who`. When the agent isn't sure it hands the conversation to a person and says so, with the ticket the person will pick up. Neytal tone.

**UploadCard** — `title`, `hint`, `accept`, `items`, `onFiles`, `consent`. Drop zone plus a gold "Choose files"; an optional consent line must be ticked first (DPDP). The card sends nothing anywhere; the host decides what happens to the files.

**Segmented** — `label`, `options`, `value`, `onChange`. A radio group drawn as pills: tiers, channels, languages. The chosen pill is filled `accent` with `night` text.

Source: `packages/bubble/src/components/Workspace.tsx`. Used by `packages/workspace` and `apps/*`.
