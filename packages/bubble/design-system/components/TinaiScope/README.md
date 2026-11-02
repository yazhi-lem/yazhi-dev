# TinaiScope

Puts everything inside it in one tiṇai environment: ground, surfaces, text, accent and hairline strokes. Change `tinai` and the whole subtree cross-fades (~900 ms, instant under reduced motion).

**The consumer provides** `tinai` (`palai` · `mullai` · `kurinji` · `marutham` · `neytal`), `children`, optional `as` (div·section·main·article·aside), `className`, `ground` (false lets an outer scope's ground show through), `id`, and `scheme` (`light` · `dark`) to pin one subtree.

Inside a scope the brand colours follow the landscape: `night` → `<tiṇai>-ground`, `night-2` → `-surface`, `ivory` → `-text`, `ivory-dim` → `-text-dim`, `accent` → `-accent`, and the Hairline strokes take `-hi`, `-edge`, `-mid`, `-lo`. So every library component takes the landscape on.

Without React: link the theme CSS and set `data-tinai="neytal"` on an element (this system's stylesheet does the same mapping from the tokens).

Pick the tiṇai from what the screen is for, never from a colour you like; change landscape across whole sections, never inside one card. Source: `packages/bubble/src/tinai/TinaiScope.tsx`, `environments.ts`.
