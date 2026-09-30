/** Yazhi Bubble Interface — the component system for Yazhi Dev's product
    pages. Import from "@/bubble" only; the folders behind it are layers:

      tone      colour input (thinai + semantic tones)
      core/     primitives: Bubble, Pill, Meter, Stat, T (bilingual text)
      patterns/ compositions: PageHeader, BubbleCard, StageTrack, …
      shell/    the app frame: BubbleShell + ShellNav
      spec/     pages as JSON blocks: Block, PageSpec, BubbleView

    See docs/BUBBLE-INTERFACE.md for scope, rules and roadmap. */
export * from "./tone";

export { Bubble } from "./core/Bubble";
export { Pill } from "./core/Pill";
export { Meter } from "./core/Meter";
export { Stat } from "./core/Stat";
export { T, plain, type BiText } from "./core/Text";

export { PageHeader, type PageHeaderProps, type Crumb, type PillSpec } from "./patterns/PageHeader";
export { BubbleCard, type BubbleCardProps } from "./patterns/BubbleCard";
export { StageTrack, type StageSpec, type StageState } from "./patterns/StageTrack";
export { FindingList, type FindingSpec } from "./patterns/FindingList";
export { KeyValue, type KeyValueItem } from "./patterns/KeyValue";
export { DataTable, type DataTableProps } from "./patterns/DataTable";
export { EmptyState } from "./patterns/EmptyState";
export { Notice } from "./patterns/Notice";

export { BubbleShell } from "./shell/BubbleShell";
export type { ShellNavItem } from "./shell/ShellNav";

export { BubbleView } from "./spec/BubbleView";
export type { Block, BlockKind, PageSpec, StatItem } from "./spec/types";
