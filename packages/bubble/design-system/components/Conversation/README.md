# Conversation

Bubble's conversation canvas made readable: big message bubbles, citation chips you can actually tap, and a source card showing the exact text.

## Classes

- `yz-thread` with `role="log"`: the column. A streaming reply is announced once, when it finishes.
- `yz-msg yz-msg--me`: the person's message, right-aligned on `tn-tint-strong`.
- `yz-msg yz-msg--app`: the app's reply on `tn-panel` with a ledge. `yz-msg__who` names the app with its bubble and where the answer came from.
- `yz-cite`: a 32px pill such as "Section [n] · 1" or "p. [n] · 1". It links to its source card. It says what it points to, not just a number.
- `yz-source`: the source card. `yz-source__head` gives the number and title plus `yz-verified` ("✓ verified" / "✓ teacher approved"), `yz-source__where` the section or page, and `yz-source__quote` the exact text on a `tn-tint` block.

## Rules

- Every factual sentence carries a `yz-cite`. If none can, show Notice → I don't know instead.
- Sources sit beside the thread (`yz-split`) on wide screens and below it on narrow ones.
- Tamil lines get `yz-ta`, which sets 1.25rem at 1.7 leading inside messages.
