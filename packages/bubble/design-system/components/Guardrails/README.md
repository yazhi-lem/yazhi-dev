# Guardrails

The standard notices, worded once so every app says them the same way: the honest `IDontKnow` and three `Disclaimer`s.

**IDontKnow** — `reason`, optional `next` (what would help). Aram rule 1: when no source supports an answer, say so instead of guessing. `gold` edge at 40%, `gold` tint at 5%. The Tamil form is "தெரியவில்லை".

**Disclaimer** — `kind` and optional `children`:
- `legal` — "Legal information, not legal advice", `marutham` edge. Nyaya shows it under every answer.
- `sample` — "Sample data", neutral. Every template showing illustrative data shows it.
- `children` — "For parents and guardians", `neytal` edge. Yazh's consent screens.

Don't reword these per app. Source: `packages/bubble/src/components/Guardrails.tsx`.
