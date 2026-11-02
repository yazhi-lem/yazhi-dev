# Support

Kural Desk's help desk: `TicketCard` for the queue and `RunbookPanel` for the steps the agent proposes.

**TicketCard** — `ticket` (`id`, `title`, `requester`, `priority` low·normal·high·urgent, `status`, `opened`), `selected`, `onSelect`. Priority maps to tones neutral·info·warn·risk.

**RunbookPanel** — `title`, `steps` (`RunbookStep`: `id`, `text`, optional `changes` {`impact`, `rollback`, `confirmWord`}). Read-only steps are checkboxes; any step with `changes` sits behind a ConfirmGate with its rollback stated. Nothing runs without a person.

Dress it in Palai. Source: `packages/bubble/src/modules/Support.tsx`.
