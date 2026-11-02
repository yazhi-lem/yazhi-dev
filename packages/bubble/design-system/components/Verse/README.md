# Verse

`KuralQuote` sets a Thirukkural couplet (or any two-line verse); `Stepper` shows numbered steps with a current position.

**KuralQuote** — `number`, `lines` (two strings), optional `gloss` and `glossDraft` (default true: shows "(draft gloss)" in `gold` until a scholar reviews it). The verse is `lang="ta"`, set in `tamil-base`, never letter-spaced.

**Stepper** — `steps` (labels), `current` (index). Done steps are `mullai` with ✓, the current step `accent`, the rest outlined. For onboarding, wizards and runbooks.

Source: `packages/bubble/src/components/Verse.tsx`.
