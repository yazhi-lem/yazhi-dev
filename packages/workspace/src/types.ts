import type { ComponentType, ReactNode } from "react";
import type { ThinaiKey } from "@yazhi/bubble";

/** The languages a workspace can speak. Tamil leads; English is second;
    Telugu is the next local language (Nyaya first). */
export type WsLang = "ta" | "en" | "te";

/** A string in every language the screen may show. `te` falls back to
    `en` when missing. Tamil and Telugu here are AI drafts (†) until a
    native reviewer signs them off. */
export interface Bi {
  ta: string;
  en: string;
  te?: string;
}

/** Where a module sits in a view. */
export type Column = "main" | "aside";

/** The default arrangement of one view: module ids per column, in order. */
export interface Layout {
  main: string[];
  aside: string[];
}

/** One screen of a workspace — a route of its own (/guru/quiz). */
export interface ViewMeta {
  id: string;
  label: Bi;
  /** one line under the tabs: what this view is for */
  purpose: Bi;
  layout: Layout;
}

/** A step in a workflow: a place (the view) and a thing to do there. */
export interface WorkflowStep {
  id: string;
  view: string;
  title: Bi;
  hint: Bi;
  /** a person must confirm this step — it changes data (Aram rule 3) */
  gate?: boolean;
}

/** A workflow: a named path through the workspace — the PRD demo script,
    a teacher's week, a morning's mail triage. Steps can be switched off,
    reordered and combined into new workflows by the person using it. */
export interface WorkflowDef {
  id: string;
  title: Bi;
  /** who walks it: "Aspirant", "Teacher", "Clinic volunteer" */
  who: Bi;
  summary: Bi;
  /** about how long, e.g. "3 min" */
  length?: string;
  steps: WorkflowStep[];
  /** made by the person in Customize, not shipped */
  custom?: boolean;
}

/** Plain-data description of a workspace — safe to import from server
    components (routes, metadata, the launcher). */
export interface WorkspaceMeta {
  id: string;
  name: string;
  taName: string;
  teName?: string;
  tagline: Bi;
  /** the Sangam landscape the workspace lives in */
  tinai: ThinaiKey;
  /** optional accent over the landscape's own (Kadai is gold) */
  accent?: string;
  runtime: "device" | "yazhi-api";
  languages: WsLang[];
  /** base path of its routes, e.g. "/guru" */
  base: string;
  owner: string;
  status: Bi;
  pilot: Bi;
  agents: string[];
  views: ViewMeta[];
  workflows: WorkflowDef[];
  /** the workspace this one can be mounted inside, e.g. Kural → Kadai */
  mountsIn?: string;
}

/** What every module is handed. */
export interface ModuleContext {
  meta: WorkspaceMeta;
  view: ViewMeta;
  lang: WsLang;
  /** pick the string for the current language */
  t: (b: Bi | string) => string;
  /** write to Pettagam, the workspace's audit log */
  log: (what: string, sources?: string[]) => void;
  /** a link to another view of this workspace */
  href: (viewId: string) => string;
  Link: LinkLike;
  /** the workspace's workflows as this person has arranged them */
  workflows: WorkflowDef[];
}

export type LinkLike = ComponentType<{ href: string; className?: string; children: ReactNode; "aria-current"?: "page" | undefined }>;

/** A block on a view. Modules are registered by id; views place them; the
    person can hide, reorder and move them between columns. */
export interface ModuleDef {
  id: string;
  title: Bi;
  /** one line for the Customize drawer */
  about: Bi;
  component: ComponentType<{ ctx: ModuleContext }>;
}

/** The full client-side workspace: its data plus the modules it can show. */
export interface WorkspaceManifest extends WorkspaceMeta {
  modules: Record<string, ModuleDef>;
}
