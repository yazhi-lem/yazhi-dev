/** Yazhi Bubble Interface — the component system for Yazhi Dev's product
    pages. Import from "@/bubble" only; the folders behind it are layers:

      tone      colour input (thinai + semantic tones)
      color     WCAG maths: contrast(), mix(), grade()
      palette   the Mugil palette, traced to the Yazhi art
      core/     primitives: Bubble, Pill, Meter, Stat, T, Button, Field,
                Switch, Progress, Avatar
      patterns/ compositions: PageHeader, BubbleCard, StageTrack, …
      shell/    the app frame: BubbleShell, ShellNav, ThemeSwitch, CloudSky
      spec/     pages as JSON blocks: Block, PageSpec, BubbleView

    See docs/BUBBLE-INTERFACE.md for scope, rules and roadmap. */
export * from "./tone";
export { contrast, luminance, mix, grade, type WcagGrade } from "./color";
export { MUGIL, MUGIL_PALETTE, MUGIL_CLOUDS, type MugilColour } from "./palette";

export { Bubble } from "./core/Bubble";
export { Pill } from "./core/Pill";
export { Meter } from "./core/Meter";
export { Stat } from "./core/Stat";
export { T, plain, type BiText } from "./core/Text";
export { Button } from "./core/Button";
export { Field } from "./core/Field";
export { Switch } from "./core/Switch";
export { Progress } from "./core/Progress";
export { Avatar, YAZH_MOODS, type YazhMood } from "./core/Avatar";

export { PageHeader, type PageHeaderProps, type Crumb, type PillSpec } from "./patterns/PageHeader";
export { BubbleCard, type BubbleCardProps } from "./patterns/BubbleCard";
export { StageTrack, type StageSpec, type StageState } from "./patterns/StageTrack";
export { FindingList, type FindingSpec } from "./patterns/FindingList";
export { KeyValue, type KeyValueItem } from "./patterns/KeyValue";
export { DataTable, type DataTableProps } from "./patterns/DataTable";
export { EmptyState } from "./patterns/EmptyState";
export { Notice } from "./patterns/Notice";
export { Tabs, type TabItem } from "./patterns/Tabs";

export { BubbleShell } from "./shell/BubbleShell";
export type { ShellNavItem } from "./shell/ShellNav";
export { ThemeSwitch, useYbiTheme, THEME_OPTIONS, type YbiTheme } from "./shell/ThemeSwitch";
export { CloudSky } from "./shell/CloudSky";

export { BubbleView } from "./spec/BubbleView";
export type { Block, BlockKind, PageSpec, StatItem } from "./spec/types";
