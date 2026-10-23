import type { AppIdentity } from "./AppFrame";

/** Metadata for the app page templates — plain data, safe to import from
    server components. The components themselves live in AppPages.tsx. */

export type TemplateSlug = "avai" | "nyaya" | "kural" | "guru" | "kadai" | "open-sangam" | "yazh-parent";

export const AVAI: AppIdentity = {
  name: "Avai",
  taName: "அவை",
  tagline: "Tamil literature, grammar and usage — every claim with its source",
  accent: "var(--kurinji)",
  runtime: "yazhi-api",
};

export const NYAYA: AppIdentity = {
  name: "Nyaya",
  taName: "நியாயம்",
  tagline: "What the law says, in Tamil — with the section it comes from",
  accent: "var(--marutham)",
  runtime: "yazhi-api",
};

export const KURAL_DESK: AppIdentity = {
  name: "Kural Desk",
  taName: "குறள்",
  tagline: "IT help in Tamil — proposes runbooks, never changes a system on its own",
  accent: "var(--palai)",
  runtime: "device",
};

export const GURU: AppIdentity = {
  name: "Guru",
  taName: "குரு",
  tagline: "Maths, science and English through Tamil — hints, never answers",
  accent: "var(--mullai)",
  runtime: "device",
};

export const KADAI: AppIdentity = {
  name: "Kadai",
  taName: "கடை",
  tagline: "A neighbourhood shop that takes orders in Tamil, with Annachi",
  accent: "var(--gold)",
  runtime: "yazhi-api",
};

export const OPEN_SANGAM: AppIdentity = {
  name: "Open Sangam",
  taName: "திறந்த சங்கம்",
  tagline: "Classical Tamil, line by line — published only after scholar sign-off",
  accent: "var(--neytal)",
  runtime: "device",
};

export const YAZH_PARENT: AppIdentity = {
  name: "Yazh — for parents",
  taName: "யாழ்",
  tagline: "The parent's door into Yazh. Children never see this page.",
  accent: "var(--neytal)",
  runtime: "yazhi-api",
};


export interface PageTemplate {
  slug: TemplateSlug;
  app: AppIdentity;
  summary: string;
  modules: string[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    slug: "avai",
    app: AVAI,
    summary: "Cited Q&A over Tamil literature, with the sources column and the reasoning trace.",
    modules: ["ChatThread", "CitedAnswer", "SourcesPanel", "FivePostureTrace", "KuralQuote", "IDontKnow", "Composer"],
  },
  {
    slug: "nyaya",
    app: NYAYA,
    summary: "Legal information with section citations, match score, the standing notice and where to get advice.",
    modules: ["LegalAnswerCard", "Disclaimer", "Composer"],
  },
  {
    slug: "kural",
    app: KURAL_DESK,
    summary: "Help-desk queue and runbooks where every system-changing step waits for a person.",
    modules: ["TicketCard", "RunbookPanel", "ConfirmGate", "IDontKnow"],
  },
  {
    slug: "guru",
    app: GURU,
    summary: "A lesson step with the hint ladder — the student does the last step.",
    modules: ["Stepper", "HintLadder"],
  },
  {
    slug: "kadai",
    app: KADAI,
    summary: "Orders in Tamil with Annachi; a payment intent the shop confirms, no money moved.",
    modules: ["ChatThread", "ProductCard", "PaymentIntentCard"],
  },
  {
    slug: "open-sangam",
    app: OPEN_SANGAM,
    summary: "Line-numbered reader with glosses and the scholar review state.",
    modules: ["VerseReader"],
  },
  {
    slug: "yazh-parent",
    app: YAZH_PARENT,
    summary: "The parent's consent gate. Child-facing Yazh screens are not in this library until counsel signs off.",
    modules: ["ConsentGate", "Disclaimer"],
  },
];
