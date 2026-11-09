# Icons

Yazhi Thiṇai's own icon set: 37 line icons and 7 theme marks, drawn for this system and ready to upload as they are.

- **Grid and stroke:** 24 × 24, 1.75 stroke (2.25 inside buttons), round caps and joins, with no fill except the small dots and the stop square.
- **Files:** `yz-<name>.svg` for line icons, `yz-thinai-<name>.svg` for the solid theme marks. These files are drawn in ink `#1b1b1b`. In the product the same paths are inlined with `currentColor` and the `yz-ico` class, so they take the text colour of every theme.
- **The ask icon** carries the Yazhi three-bubble mark inside a speech bubble. It is the only icon that borrows the mark, and it stays the "ask" icon in every app.

| Group | Icons |
|---|---|
| Navigation | ask, book, practice, glossary, document, scales, draft, ticket, chats, parcel, layers, settings |
| Actions | send, check, cross, stop, mic, upload, phone, person, deeper, back, handover, mail |
| Status | verified, unknown, info, alert, lock, sample |
| Settings | textsize, look, motion, focus, language, speaker, server |
| Theme marks | kurinji (hill and bloom), mullai (jasmine), marutham (paddy), neithal (moon over waves), paalai (sun over dune), contrast, night |

## Rules

- **An icon never stands alone.** It sits beside a word. The one exception is the composer's Speak button, which carries `aria-label="Speak"`.
- Decorative icons are `aria-hidden="true"`. Status icons (✓ / ✕ meanings) also get a visually hidden word (`yz-sr`).
- Sizes: `yz-ico` 24px, `yz-ico--sm` 18px, `yz-ico--lg` 32px. Don't scale strokes; scale the box.
- Use the theme marks on their own pastel in the theme picker and thiṇai chips, in `tn-on-pastel` ink.
