# Card

A white page of words, `measure` wide, lifted off the thiṇai by a `tn-tint-strong` ledge — the main reading surface of every screen.

## Anatomy

- `yz-card` — `tn-panel`, `radius-lg`, `space-6` padding, `space-4` between lines, max width `measure` (640px).
- `yz-card__eyebrow` — what this is, in `caption` and `tn-ink-muted`.
- `yz-card__title` — the `title` style, Tamil first.
- `yz-card__ta` — Tamil reading text (`tamil-lg`, 24/38).
- `yz-card__en` — English reading text (`body-lg`, 22/34). Add `yz-card__en--sub` when it is the second language under Tamil.
- An optional `yz-pair` at the bottom: the one go/stop pair for the card.

## Tones

- `yz-card--go` — `tn-go-soft` with `tn-go-press` text, for praise and success. No ledge.
- `yz-card--stop` — `tn-stop-soft` with `tn-stop-press` text, for a gentle "wait". Never for scolding.

## Rules

- **One idea per card.** If it needs a scroll, it is two cards.
- At most two cards on a child's screen at once.
- No images inside the reading block; words lead.

## Consumer provides

The text, the language mode, and the button handlers.
