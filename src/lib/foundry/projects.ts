/** The Foundry project registry. A Foundry project is one yazhi-api
    domain's data programme: the YazhiFactory pipelines that collect it,
    the stage chain that refines it, and the corpus + quality Insight
    reports on. Six projects, one per core/router.DOMAIN_MODEL entry.

    `pipelines` mirrors yazhi-api factory/configs/<domain>/<language>/*.json
    (snapshot 2026-09-30). yazhi-api has no RPC that lists the factory
    catalog yet — proposed as yazhi.factory.v1.YazhiFactory/ListPipelines in
    docs/BUBBLE-INTERFACE.md. When it lands, this file shrinks to the
    presentation fields (names, tone) and pipelines come from the wire. */
import type { Tone } from "@/bubble/tone";
import type { DomainId } from "./types";

export interface PipelineSpec {
  /** `<domain>.<language>.<slug>` — the factory config's `name` */
  name: string;
  language: "ta" | "en" | "hi" | "multi";
  description: string;
  intervalSeconds: number;
  collector: string;
  enricher?: string;
}

export interface FoundryProject {
  id: DomainId;
  name: { ta: string; en: string };
  tone: Tone;
  /** worker model this domain routes to (core/router.py DOMAIN_MODEL) */
  model: string;
  summary: string;
  /** the domain's stage CLI, in order (factory/<domain>/ and `yz <domain>`);
      domains without one run only the generic factory loop */
  stages: string[];
  pipelines: PipelineSpec[];
}

/** The YazhiFactory run loop every pipeline shares
    (factory/orchestrator.py: collect → audit → raw → enrich). */
export const FACTORY_LOOP = ["collect", "audit", "raw", "enrich"] as const;

export const FOUNDRY_PROJECTS: FoundryProject[] = [
  {
    id: "legal",
    name: { ta: "சட்டம்", en: "Legal" },
    tone: "palai",
    model: "yazh",
    summary: "Central acts from India Code — fetched act by act, parsed into sections, validated and embedded for legal information retrieval.",
    stages: ["fetch", "parse", "validate", "embed"],
    pipelines: [
      {
        name: "legal.en.indiacode",
        language: "en",
        description: "Central acts from indiacode.nic.in, parsed, validated and embedded.",
        intervalSeconds: 86400,
        collector: "legal.indiacode",
        enricher: "legal.acts",
      },
    ],
  },
  {
    id: "education",
    name: { ta: "கல்வி", en: "Education" },
    tone: "mullai",
    model: "yazh",
    summary: "Samacheer Kalvi textbooks, Tamil medium first — PDFs and OCR text paginated into structured JSON with a table of contents.",
    stages: ["fetch", "parse", "validate", "store"],
    pipelines: [
      {
        name: "education.ta.samacheer_tamil_medium",
        language: "ta",
        description: "Tamil-medium Samacheer Kalvi textbooks: download PDF, extract pages, paginate into structured JSON with a separate table of contents.",
        intervalSeconds: 604800,
        collector: "education.samacheer_pdf",
        enricher: "education.textbook_pdf",
      },
      {
        name: "education.multi.tntextbooks_catalog",
        language: "multi",
        description: "tntextbooks.in school-books catalog plus the archive.org OCR-text registry.",
        intervalSeconds: 86400,
        collector: "education.tntextbooks_catalog",
        enricher: "education.textbook",
      },
    ],
  },
  {
    id: "governance",
    name: { ta: "ஆளுகை", en: "Governance" },
    tone: "marutham",
    model: "yazh",
    summary: "Tamil Nadu and central government schemes from myScheme — the civic knowledge Sevai and citizens ask about.",
    stages: ["fetch", "parse", "validate", "embed", "store"],
    pipelines: [
      {
        name: "governance.en.myscheme",
        language: "en",
        description: "Tamil Nadu and central government schemes from myscheme.gov.in.",
        intervalSeconds: 3600,
        collector: "governance.myscheme",
        enricher: "governance.scheme",
      },
    ],
  },
  {
    id: "health",
    name: { ta: "சுகாதாரம்", en: "Health" },
    tone: "neytal",
    model: "amudh",
    summary: "Public health scheme metadata (CMCHIS) today; OCR'd medical documents feed the retriever through services/health.",
    stages: [],
    pipelines: [
      {
        name: "health.en.cmchis",
        language: "en",
        description: "Chief Minister's Comprehensive Health Insurance Scheme (TN) metadata.",
        intervalSeconds: 86400,
        collector: "health.cmchis",
        enricher: "generic",
      },
    ],
  },
  {
    id: "sovereign",
    name: { ta: "தற்சார்பு", en: "Sovereign" },
    tone: "kurinji",
    model: "yazh",
    summary: "Constitutional ground truth — the preamble and fundamental-rights articles, English text under Tamil titles.",
    stages: [],
    pipelines: [
      {
        name: "sovereign.multi.constitution",
        language: "multi",
        description: "Constitution of India preamble and fundamental-rights articles (English text, Tamil titles).",
        intervalSeconds: 86400,
        collector: "sovereign.constitution",
        enricher: "generic",
      },
    ],
  },
  {
    id: "core",
    name: { ta: "மையம்", en: "Core" },
    tone: "gold",
    model: "adhan",
    summary: "The yazhi-api system manifest and agent postures — what Adhan knows about the platform it runs on.",
    stages: [],
    pipelines: [
      {
        name: "core.en.manifest",
        language: "en",
        description: "yazhi-api system manifest and agent postures.",
        intervalSeconds: 86400,
        collector: "core.manifest",
        enricher: "generic",
      },
    ],
  },
];

export function getProject(id: string): FoundryProject | undefined {
  return FOUNDRY_PROJECTS.find((p) => p.id === id);
}

export function formatInterval(seconds: number): string {
  if (seconds % 604800 === 0) return seconds === 604800 ? "weekly" : `every ${seconds / 604800} weeks`;
  if (seconds % 86400 === 0) return seconds === 86400 ? "daily" : `every ${seconds / 86400} days`;
  if (seconds % 3600 === 0) return seconds === 3600 ? "hourly" : `every ${seconds / 3600} hours`;
  return `every ${seconds}s`;
}
