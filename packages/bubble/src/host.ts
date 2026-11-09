/** Barrel for the Bubble UI **host** — `/app`.
 *
 *  `/app` (src/app/app, src/components/app) is composition only: it wires one
 *  canvas, one tray of app bubbles, one composer and one workspace to the
 *  Bubble UI library below. The runtime primitives a host needs — which a
 *  builder's bubble manifest never does — are re-exported here so the host
 *  imports ONE path, per packages/bubble/docs/BUBBLE-UI.md.
 *
 *  Everything re-exported below already exists in this package; nothing here
 *  adds behaviour, state or a second copy of anything. `packages/bubble/src/
 *  index.ts` ends with `export * from "./host"`.
 *
 *  DE-DUPLICATION RULE: because `index.ts` re-exports this file, any name the
 *  root barrel ALSO exports must not appear here (TypeScript: "Module has
 *  already exported a member") — and a `export *` re-export of a module we
 *  also name explicitly is an ambiguity error in ES modules, so it is avoided
 *  too. `ComposerHandle` is the one name this file adds to the package. */

export { Composer, type ComposerHandle } from "./components/Composer";
export { EmptyState } from "./components/Panel";
export { MessageBubble, TypingDots } from "./components/Message";
export { IDontKnow, Disclaimer } from "./components/Guardrails";
export { SampleTag } from "./components/Workspace";

export type { ThreadTurn } from "./modules/ChatThread";
export type { MagneticItem } from "./tinai/MagneticTray";

export { PAGE_COMPONENTS } from "./pages/AppPages";

export type { BubbleMessage } from "./lib/manifest";
export { effectiveSystemPrompt, withFivePosture } from "./lib/manifest";
