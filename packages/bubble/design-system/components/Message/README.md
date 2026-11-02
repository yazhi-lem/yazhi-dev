# Message

One turn in a conversation (`MessageBubble`), and the three `TypingDots` while a reply streams.

**MessageBubble** — `role` (`user` · `assistant`), `children`, optional `runtime` (`device` · `yazhi-api`, shown as a RuntimeBadge), `footer` (citations, actions), `pending` (shows TypingDots).

User turns sit right in a filled bubble (`ivory` at 10%, tail corner bottom-right); agent turns sit left as plain prose at `text-sm` with relaxed leading. Announce a streamed reply once, when it finishes.

Source: `packages/bubble/src/components/Message.tsx`.
