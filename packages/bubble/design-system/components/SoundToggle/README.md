# SoundToggle

The speaker button beside a yazh. Off until a person turns it on; the choice is remembered in this browser only. Turning it on wakes the audio (it must come from this press) and answers with a soft run up the strings.

**The consumer provides** `className`. `useYazhSound()` returns `[on, setOn]`; `voiceStage(stage)` gives a figure's "yazh:pluck" events a voice — only a person's own plucks sound, never the figure's tour.

Styled in the landscape's ink: off is `-text-dim` on a 45% `-edge` hairline, on is `-text` on `-hi`. Source: `packages/bubble/src/sound/SoundToggle.tsx`, `yazhVoice.ts`.
