/** Sample Foundry data, shown when yazhi-api is not connected.
    Every number is from yazhi-api docs/API_AUDIT_AND_ROADMAP.md §1–2
    (audited at v0.3.0, 2026-08-19) — nothing here is invented. Where
    the audit is silent (pipeline failures, validation dates) the sample
    leaves the field empty, and the page renders "no data" rather than
    a made-up figure. */
import type { DomainQuality, QualityOverview } from "./types";

export const SAMPLE_SNAPSHOT = "yazhi-api audit, 2026-08-19 (v0.3.0)";

const legal: DomainQuality = {
  domain: "legal",
  label: "Legal",
  hasCorpus: true,
  hasRetriever: true,
  model: "yazh",
  score: 54,
  stats: { domain: "legal", recordCount: 5609, parentCount: 153, byLanguage: { en: 5609 } },
  validatedParents: 4,
  totalParents: 153,
  coveragePct: 2.6,
  findings: [
    {
      code: "PROVENANCE_STUB",
      severity: "error",
      domain: "legal",
      title: "Placeholder provenance URL",
      detail: "The source URL is a stub, so the record cannot be traced back to a real source document.",
      count: 5595,
    },
    {
      code: "TITLE_CONTENT_MISMATCH",
      severity: "error",
      domain: "legal",
      title: "Act title does not match its text",
      detail: "Section 1 names a different act than the title the file is stored under.",
      count: 2,
    },
    {
      code: "VALIDATION_MISSING",
      severity: "warning",
      domain: "legal",
      title: "Never validated",
      detail: "In the corpus, but no validation report has ever been written for it.",
      count: 149,
    },
  ],
};

const education: DomainQuality = {
  domain: "education",
  label: "Education",
  hasCorpus: true,
  hasRetriever: true,
  model: "yazh",
  score: 100,
  stats: { domain: "education", recordCount: 21, parentCount: 21, byLanguage: { ta: 21 } },
  validatedParents: 21,
  totalParents: 21,
  coveragePct: 100,
  findings: [],
};

function empty(domain: string, label: string, model: string, hasRetriever: boolean): DomainQuality {
  return { domain, label, hasCorpus: false, hasRetriever, model, findings: [] };
}

export const SAMPLE_OVERVIEW: QualityOverview = {
  generatedAt: "2026-08-19",
  score: 77,
  totalRecords: 5630,
  totalFindings: 3,
  totalErrors: 2,
  totalWarnings: 1,
  domains: [
    legal,
    education,
    empty("governance", "Governance", "yazh", false),
    empty("health", "Health", "amudh", true),
    empty("sovereign", "Sovereign", "yazh", true),
    empty("core", "Core", "adhan", false),
  ],
};
