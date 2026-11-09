# LanguageToggle

A three-way pill switch — தமிழ், English, Both — that sets the language of every label and every reading block on the screen.

## Anatomy

- `yz-seg` — the `tn-tint` track, `radius-pill`, `space-1` padding.
- `yz-seg__opt` — each option, 48px tall, `tn-ink-muted` when off; `aria-pressed="true"` lifts it onto `tn-panel` in `tn-ink` with a `tn-tint-strong` ledge.

## Rules

- **Strict separation.** In தமிழ் mode no English appears, and the reverse. Only Both shows two lines, always Tamil above, English below in `tn-ink-muted`.
- Default is தமிழ். The choice persists per child.
- Lives in the top-right of the main area, or in the parents' area for younger children.

## Consumer provides

The `role="group"` with `aria-label`, the state, and applying the chosen mode to the app.
