# ChatThread

A scrolling conversation — the canvas of most Yazhi apps. Turns are any node, so they can hold cited answers, cards or gates.

**The consumer provides** `turns` (`ThreadTurn`: `id`, `role`, `content`, optional `runtime`, `pending`, `footer`) and `className` (give it a height). The thread is a polite live region; announce a reply when it finishes, not token by token.

Source: `packages/bubble/src/modules/ChatThread.tsx`.
