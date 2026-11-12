# ThinaiConfirmGate

The pause before anything changes: it says what will happen, what it touches and how to undo it, then offers red No and green Yes.

## Anatomy

`yz-confirm` with `role="dialog"`, a `yz-card__h` question in both languages, a `dl` of **Action**, **Affects** and **Undo**, and a `yz-pair`: red `yz-btn--stop` on the left, green `yz-btn--go` on the right.

## Where it is required

- Kural: sending any reply, recording a refund or return, changing an order.
- Nyaya: saving a notice draft ("Draft, for advocate review").
- Guru: a teacher publishing an approved draft to the class.

## Rules

- Focus moves into the gate when it opens; Escape means No.
- If it can't be undone, Undo says so plainly ("Can't unsend — edit it first").
- Money: add the notice "No money moves through Yazhi".
