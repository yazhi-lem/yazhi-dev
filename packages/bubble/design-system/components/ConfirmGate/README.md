# ConfirmGate

A human confirm in front of any action that changes a system — Aram rule 3: the agent proposes, a person decides, and the rollback is stated before anything runs.

**The consumer provides** `action` (what will happen, one line), `impact` (what it affects), `rollback` (how to undo it); optional `confirmWord` — the person must type it for risky steps; `onConfirm`, `onDecline`; and `state` (`pending` · `confirmed` · `declined`) to control it.

Pending gates sit on a `palai` edge with a "Needs a human confirm" `mono-label`; confirmed turns `mullai`; declined dims. The confirm button is `gold` with `night` text.

Never run a system change without one. Source: `packages/bubble/src/components/ConfirmGate.tsx`.
