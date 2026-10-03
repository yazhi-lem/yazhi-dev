/** Yazhi UI — the component library behind the Bubble UI and the Yazhi apps.

    Three layers, each built only from the one below:
      components/  primitives every app shares (bubble, pills, citations, gates)
      modules/     app-level blocks (cited answers, runbooks, hint ladder, reader)
      pages/       full app screens (Avai, Nyaya, Kural, Guru, Kadai, Open Sangam, Yazh)

    Browse it live at /bubble/components, /bubble/modules and /bubble/pages. */

export { Bubble } from "./components/Bubble";
export { Pill, RuntimeBadge, DraftTag, type Tone } from "./components/Pill";
export { Panel, EmptyState } from "./components/Panel";
export { CitationMark, SourceCard, type Source } from "./components/Citation";
export { IDontKnow, Disclaimer } from "./components/Guardrails";
export { ConfirmGate, type GateState } from "./components/ConfirmGate";
export { MessageBubble, TypingDots } from "./components/Message";
export { Composer } from "./components/Composer";
export { KuralQuote, Stepper } from "./components/Verse";

export { BubbleTray, type TrayItem } from "./modules/BubbleTray";
export { ChatThread, type ThreadTurn } from "./modules/ChatThread";
export { SourcesPanel, CitedAnswer, LegalAnswerCard, type AnswerPart } from "./modules/Answer";
export { HintLadder } from "./modules/HintLadder";
export { TicketCard, RunbookPanel } from "./modules/Support";
export { VerseReader } from "./modules/VerseReader";
export { ProductCard, PaymentIntentCard, type CartLine } from "./modules/Commerce";
export { FivePostureTrace, ConsentGate, type PostureResult } from "./modules/Trust";

export { AppFrame, type AppIdentity } from "./pages/AppFrame";
export { PAGE_TEMPLATES, type PageTemplate, type TemplateSlug } from "./pages/catalog";
export { PAGE_COMPONENTS } from "./pages/AppPages";
