/** @yazhi/bubble — the Bubble UI/UX system: components, modules, pages,
    the five tinai environments, Hairline figures and Yazhi's agents.

    Three layers, each built only from the one below:
      components/  primitives every app shares (bubble, pills, citations, gates)
      modules/     app-level blocks (cited answers, runbooks, hint ladder, reader)
      pages/       full app screens (Avai, Nyaya, Kural, Guru, Kadai, Open Sangam, Yazh)

    Beside them: mission/ (Mission Control and the light/dark switch) and
    docs/ (the one-page library). Live at yazhi.dev/bubble. See README.md. */

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

export { TinaiScope } from "./tinai/TinaiScope";
export { TinaiAmbient } from "./tinai/TinaiAmbient";
export { MagneticTray, type MagneticItem } from "./tinai/MagneticTray";
export { ENVIRONMENTS, ENV_BY_KEY, envVars, type Environment } from "./tinai/environments";
export { HairlineFigure } from "./hairline/HairlineFigure";
export { TINAI_FIGURES, SANGAM_OBJECTS, type SangamObject } from "./hairline/figures";
export type { HairlineFigureDef } from "./hairline/types";

export { TINAI_KEYS, type ThinaiKey } from "./tinai/keys";

export { KARUPPORUL, KARU_BY_KEY, KARU_CATEGORIES, KARU_SOURCES, KARU_DRAFT, type TinaiKaru, type KaruCategory } from "./lib/karupporul";
export { YAZHI_AGENTS } from "./lib/agents";
export type { Agent } from "./lib/agent-types";
export { BUBBLE_SCHEMA, validateManifest, effectiveSystemPrompt, withFivePosture, type BubbleManifest, type BubbleRuntime } from "./lib/manifest";
export { STARTER_BUBBLES } from "./lib/starters";

export { MarkBubble } from "./mission/MarkBubble";
export { MissionControl, MissionSection, MissionHeader } from "./mission/MissionControl";
export { ModeSwitch } from "./mission/ModeSwitch";
export { useColorMode, setColorMode, onColorModeChange, type ColorMode } from "./mode";
export { MODE_SCRIPT, MODE_KEY } from "./mode-script";
export { tone, type Palette } from "./tinai/environments";
export { TinaiMark } from "./tinai/TinaiMark";
