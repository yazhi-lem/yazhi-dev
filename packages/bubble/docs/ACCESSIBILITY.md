# Access and Tamil

Rules every Bubble screen keeps. Yazhi Chat meets them with no axe-core
WCAG A/AA or best-practice violations.

## Everyone
- **Hit areas stay put.** Only the drawing moves.
- **Everything has a name.** Figures are `role="img"` with a sentence of
  meaning; ambient canvases are `aria-hidden`.
- **Keyboard is a pointer.** Focus lifts a bubble the way hover does; focus
  rings use the landscape's bright stroke, never colour alone.
- **Announce once.** A streaming reply is announced when it finishes, not
  token by token; the conversation is a `log` region.
- **Targets are at least 44 px.** Escape closes panels; focus moves into a
  panel when it opens.
- **Contrast.** Text and the bright stroke stay above WCAG AA on every
  ground (text ≥ 16.9:1, dim text ≥ 9.7:1, accents ≥ 4.56:1).
- **Reduced motion.** Springs and tweens jump to their end, ambient fields
  draw one still frame, colour changes are instant.
- **Sleep.** Animated surfaces sleep offscreen and in hidden tabs.

## Tamil
- **Never letter-spaced** — tracking splits grapheme clusters.
- **Cut by grapheme** (`src/text.ts`, `Intl.Segmenter`), so கு is never
  torn into க and ு.
- **Line height:** 1.75 in text, 1.35 in display.
- **Noto Sans Tamil** for every Tamil run.
- **Input methods:** never act on Enter while `isComposing`.
- **Drafts:** all Tamil is a draft until a native reviewer signs it off, and
  the screen says so.
