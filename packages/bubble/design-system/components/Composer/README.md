# Composer

The message bar from the Bubble UI sketch: a leading slot (Mission Control), the input, and ▷ send — or ■ stop while a reply streams.

**The consumer provides** `onSend(text)`, optional `onStop`, `streaming`, `placeholder` (also the input's accessible name; default "Message…"), `leading` (put `MissionControl` here), `disabled`.

A pill on `night` at 70% with a 15% `ivory` border that turns `gold` at 60% on focus. Send is a `gold` disc, disabled at 30% until there is text.

Enter sends; Shift+Enter breaks a line; **Enter never sends while an input method is composing** — Tamil keyboards confirm letters with Enter.

```tsx
<Composer leading={<MissionControl active={signedIn} who={name} onPress={open} />} onSend={send} />
```
Source: `packages/bubble/src/components/Composer.tsx`.
