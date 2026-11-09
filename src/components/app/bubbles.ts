/** What the `/app` tray can hold — as plain data, safe on the server.

    Three kinds of "app bubble" share one shape, because in the Bubble UI an
    app *is* a set of bubbles in one host:

      agent       a runnable bubble: a v0 manifest from `@yazhi/bubble`
                  (the five STARTER_BUBBLES, end to end through the API
                  kernel) plus the seeded thread the canvas shows.
      workspace   one of the auth-free product workspaces (`apps/*`). Its
                  screen is the real workspace shell, mounted by the client;
                  the server renders the same identity so the first paint is
                  complete.
      template    one of the seven page templates from the Bubble UI library
                  (`packages/bubble/src/pages/catalog.ts`), filled with sample
                  data. Avai leads, per the Lead's brief.

    Nothing here fetches, imports a Circle module or reads storage.
    `/api/bubbles` (the registry) is merged in at runtime by the launcher —
    this file is the built-in half of the tray, so the host works with the
    registry down, empty or offline. */

import { effectiveSystemPrompt, PAGE_TEMPLATES, STARTER_BUBBLES, type BubbleManifest, type ThinaiKey } from "@yazhi/bubble";
import { WORKSPACES } from "@yazhi/apps/meta";

export type AppBubbleKind = "agent" | "workspace" | "template";

/** How a selection behaves: `link` changes the route (`/app?ws=guru`), `run`
    stays on the canvas with a live composer, `none` is a screen with no
    agent behind it (a page template's sample preview). */
export type AppBubbleAction = "link" | "run" | "none";

export interface SeedTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AppBubble {
  /** URL-safe id — what `?b=` carries */
  slug: string;
  kind: AppBubbleKind;
  /** English display name */
  name: string;
  /** Tamil display name — a draft until a native speaker reviews it */
  taName?: string;
  /** accent as a CSS colour (a token `var(--mullai)` or `#rrggbb`) */
  accent: string;
  /** how much room the bubble asks for in the tray */
  size: "s" | "m" | "l";
  /** the Sangam landscape it lives in */
  tinai: ThinaiKey;
  /** BCP-47 tags the bubble speaks, most-used first */
  languages: string[];
  /** what it is for, one line — the source string for a workspace or agent */
  summary: string;
  /** the Tamil line where the source has one (workspaces do) */
  summaryTa?: string;
  action: AppBubbleAction;
  /** `link` only */
  href?: string;
  /** `agent` only: the manifest POSTed to /api/bubble/run (as v0) */
  manifest?: BubbleManifest;
  /** `agent` only: the seeded thread's turns, before questions are asked */
  seed?: SeedTurn[];
  /** `agent` only: the opening questions the composer offers */
  starters?: string[];
  /** `agent` only: the system prompt, shown behind a disclosure */
  promptPreview?: string;
  /** `template` only: the library's template slug */
  template?: string;
}

const TINAI_BY_WORKSPACE: Record<string, ThinaiKey> = {
  guru: "mullai",
  nyaya: "marutham",
  kural: "palai",
  kadai: "neytal",
};

const TINAI_BY_TEMPLATE: Record<string, ThinaiKey> = {
  avai: "kurinji",
  nyaya: "marutham",
  kural: "palai",
  guru: "mullai",
  kadai: "neytal",
  "open-sangam": "neytal",
  "yazh-parent": "neytal",
};

/** Tamil display names for the page templates (drafts, as in the library). */
const TEMPLATE_TA: Record<string, string> = {
  avai: "அவை",
  nyaya: "நியாயம்",
  kural: "குறள் மேசை",
  guru: "குரு",
  kadai: "கடை",
  "open-sangam": "திறந்த சங்கம்",
  "yazh-parent": "யாழ் — பெற்றோருக்கு",
};

/** Starter questions per agent bubble, from its own prompt — the builder's
    bubble, not invented personas. */
const AGENT_STARTERS: Record<string, string[]> = {
  "yazhi.pulavar": [
    "திருக்குறளில் கேள்வி கேட்டலைப் பற்றி என்ன சொல்கிறது?",
    "What does the Kural say about listening to others?",
    "வினைத்தொகை என்பது என்ன?",
  ],
  "yazhi.kural-desk": [
    "என் மின்னஞ்சல் அனுப்ப முடியவில்லை — படிநிலைகளைச் சொல்லுங்கள்.",
    "My laptop won't connect to the office Wi-Fi.",
  ],
  "yazhi.code-pal": ["Why does this loop not terminate?", "இந்தக் குமிழில் Next.js 16-இல் URL நிலையை எப்படி வைப்பது?"],
  "yazhi.sangam-lens": ["குறுந்தொகை 40 — இதன் திணை எது?", "Read this line by its imagery: “முல்லை நிலம்”."],
  "yazhi.sol": ["இன்றைய சொல் என்ன?", "Give me a word for “patience” with its root."],
};

/** The seeded first turn of each agent bubble: the agent's own greeting,
    then, as a *sample*, the opening question its composer offers. Both are
    deterministic, so the server and the browser build the same list. Nothing
    here pretends a model answered — the greeting is the bubble's manifest
    text and the question carries no reply. */
function seededThread(manifest: BubbleManifest): SeedTurn[] {
  const starters = AGENT_STARTERS[manifest.id] ?? [];
  const turns: SeedTurn[] = [{ role: "assistant", content: manifest.agent.greeting }];
  if (starters[0]) turns.push({ role: "user", content: starters[0] });
  return turns;
}

function fromAgent(manifest: BubbleManifest): AppBubble {
  const starters = AGENT_STARTERS[manifest.id] ?? [];
  return {
    slug: manifest.id,
    kind: "agent",
    name: manifest.name,
    taName: manifest.taName,
    accent: manifest.accent,
    size: manifest.size,
    tinai: manifest.id === "yazhi.sangam-lens" ? "kurinji" : manifest.id === "yazhi.kural-desk" ? "palai" : "mullai",
    languages: ["ta", "en"],
    summary: manifest.description,
    action: "run",
    manifest,
    seed: seededThread(manifest),
    starters,
    promptPreview: effectiveSystemPrompt(manifest),
  };
}

function fromWorkspace(meta: (typeof WORKSPACES)[number]): AppBubble {
  return {
    slug: `ws.${meta.id}`,
    kind: "workspace",
    name: meta.name,
    taName: meta.taName,
    // a workspace may name its own accent (Kadai is gold); the landscape's
    // token is the default, exactly as its own routes do it
    accent: meta.accent ?? `var(--${meta.tinai})`,
    size: meta.id === "guru" || meta.id === "nyaya" ? "l" : "m",
    tinai: TINAI_BY_WORKSPACE[meta.id] ?? meta.tinai,
    languages: [...meta.languages],
    summary: meta.tagline.en,
    summaryTa: meta.tagline.ta,
    action: "link",
    href: `/app?ws=${meta.id}`,
  };
}

function fromTemplate(t: (typeof PAGE_TEMPLATES)[number]): AppBubble {
  return {
    slug: `tpl.${t.slug}`,
    kind: "template",
    name: t.app.name,
    taName: TEMPLATE_TA[t.slug] ?? t.app.taName,
    accent: t.app.accent,
    // yazh-parent is the narrowest screen in the library; Avai gets the most
    // room because it is the first surface a person meets
    size: t.slug === "yazh-parent" ? "s" : t.slug === "avai" ? "l" : "m",
    tinai: TINAI_BY_TEMPLATE[t.slug] ?? "kurinji",
    languages: ["ta", "en"],
    summary: t.summary,
    // a template is a preview of a page, not an agent: no composer of its own
    action: "none",
    template: t.slug,
  };
}

/** Built-in app bubbles, in tray order: the agent bubbles that run through
    the API kernel, then the auth-free workspaces, then the page templates
    with Avai first. */
export const APP_BUBBLES: AppBubble[] = [
  ...STARTER_BUBBLES.map(fromAgent),
  ...WORKSPACES.map(fromWorkspace),
  ...PAGE_TEMPLATES.map(fromTemplate),
];

export const APP_BUBBLE_BY_SLUG: Record<string, AppBubble> = Object.fromEntries(APP_BUBBLES.map((b) => [b.slug, b]));

/** The bubble a bare `/app` shows: Avai, the Lead's first demo surface. */
export const DEFAULT_BUBBLE_SLUG = "tpl.avai";

/** The workspace a `?ws=` value names, if any. */
export function workspaceFor(slug: string | null | undefined) {
  if (!slug) return undefined;
  const id = slug.startsWith("ws.") ? slug.slice(3) : slug;
  return WORKSPACES.find((w) => w.id === id);
}

/** Resolve `?b=` to a bubble. Unknown ids fall back to the default rather
    than 404 — a shared link should still land somewhere readable. */
export function bubbleFor(slug: string | null | undefined): AppBubble {
  if (!slug) return APP_BUBBLE_BY_SLUG[DEFAULT_BUBBLE_SLUG];
  const direct = APP_BUBBLE_BY_SLUG[slug];
  if (direct) return direct;
  const byWorkspace = APP_BUBBLES.find((b) => b.kind === "workspace" && workspaceFor(b.slug)?.id === slug);
  if (byWorkspace) return byWorkspace;
  const byTemplate = APP_BUBBLES.find((b) => b.kind === "template" && b.template === slug);
  if (byTemplate) return byTemplate;
  return APP_BUBBLE_BY_SLUG[DEFAULT_BUBBLE_SLUG];
}

/** Bubbles `[` and `]` cycle through — agents and templates you can open in
    place (workspaces change route, so they are not in the cycle). */
export const CYCLE_BUBBLES = APP_BUBBLES.filter((b) => b.action !== "link");

/** Language filters on the tray. A bubble matches when any of its tags has
    the primary subtag — "ta-IN" matches "ta". */
export const LANGUAGE_FILTERS = ["all", "ta", "en", "te"] as const;
export type LanguageFilter = (typeof LANGUAGE_FILTERS)[number];

export function matchesLanguage(bubble: AppBubble, filter: LanguageFilter): boolean {
  if (filter === "all") return true;
  return bubble.languages.some((tag) => tag.toLowerCase() === filter || tag.toLowerCase().startsWith(`${filter}-`));
}

/** The size a tray bubble asks for → the diameter the packed tray draws. */
export const TRAY_DIAMETER: Record<AppBubble["size"], number> = { s: 40, m: 48, l: 56 };

/** Key-independent list of every bubble's slug, for tests and links. */
export function bubbleSlugs(): string[] {
  return APP_BUBBLES.map((b) => b.slug);
}
