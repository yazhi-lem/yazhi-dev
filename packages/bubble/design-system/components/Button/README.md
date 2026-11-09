# Button

Big pill buttons with a pressable ledge: green (`yz-btn--go`) moves forward, red (`yz-btn--stop`) halts or backs out, and soft (`yz-btn--soft`) covers everything else.

## The gadget rule

A screen has **at most one green and one red**, like the two buttons on a toy. If a screen needs a third action, make it soft. If it needs a fourth, the screen is doing too much — split it.

| Variant | Class | Means | Label examples |
| --- | --- | --- | --- |
| Go | `yz-btn yz-btn--go` | yes, start, next, send, play | தொடங்கு · Start, சரி · Yes, அடுத்து · Next |
| Stop | `yz-btn yz-btn--stop` | stop, no, exit, cancel | நிறுத்து · Stop, வேண்டாம் · No, வெளியே · Exit |
| Soft | `yz-btn yz-btn--soft` | everything neutral | மீண்டும் படி · Read again, கேள் · Ask |

## Placement

- In a pair (`yz-pair`), **red sits left, green sits right** — always. Forward is to the right, the direction a Tamil or English line reads.
- The one main pair on a screen uses `yz-btn--big` (`tap-big`, 72px). Everything else is `tap-min`, 56px.
- Keep at least `space-6` between the two buttons of a pair, so a small thumb never hits both.

## Never colour alone

Red and green sit at similar lightness, so colour-blind children cannot tell them apart by hue. Every go/stop button carries **a word and an icon**: send or check after a green label, cross or stop before a red one. Icons are inline `yz-ico` SVGs at 2.25 stroke with `aria-hidden="true"`; the word is the accessible name.

## Press

The ledge is a `press-depth` (5px) solid shadow in `tn-go-press` / `tn-stop-press` / `tn-tint-strong`. On `:active` the button drops by `press-depth` and the ledge vanishes — the satisfying click of a real button. Focus shows a 3px `tn-focus` ring at 4px offset.

## Disabled

`disabled` turns any variant into `tn-tint` with `tn-ink-muted` text, a `tn-control-edge` outline and no ledge. Prefer hiding an action a child cannot take yet over showing it disabled.

## Consumer provides

The `<button>` element, its label text (Tamil first, English second via `yz-btn__sub` when showing both), and the click handler.
