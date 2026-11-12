# ThinaiComposer

The input bar from Bubble UI: Mission Control (the bordered flat bubble) first, then the text box, then a Speak icon button, then a green Send. While a reply is streaming, Send becomes a red Stop.

## Classes

`yz-composer` (the pill, `tn-control-edge` outline), `button.yz-mission`, `yz-composer__input`, `yz-btn--soft yz-btn--small yz-btn--icon` with the mic icon and `aria-label="Speak"`, and `yz-btn--go yz-btn--small` with the send icon. While a reply streams, Speak and Send give way to a `yz-btn--stop` with the stop icon.

## Rules

- The placeholder is Tamil-only and short. The English goes in `aria-label`.
- Enter sends and Shift+Enter breaks a line, but **Enter never sends while an input method is composing**: Tamil keyboards confirm letters with Enter.
- Mission Control opens the account, theme and settings. It is asleep (dashed ring, open rings) until the person signs in, and pressing it then opens sign-in.
- Focus shows a 3px `tn-focus` ring around the whole pill.
- Speak stays disabled, with "Coming 2027", until Kural's Tamil voice ships.
