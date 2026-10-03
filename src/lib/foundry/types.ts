/** TypeScript mirrors of the yazhi-api messages the Foundry pages read.
    Source of truth: yazhi-api services/yazhi/proto/insight.proto
    (package yazhi.insight.v1). Field names are the proto3 JSON mapping
    (lowerCamelCase); int64 arrives as a string. proto3 JSON omits
    default values, so every scalar here is optional on the wire —
    normalise with the helpers in client.ts before rendering.
    Replace with buf-generated types once the yazhi-api protos are
    published as a package (docs/BUBBLE-INTERFACE.md, Phase 2). */

export type DomainId = "legal" | "education" | "governance" | "health" | "sovereign" | "core";

export interface Finding {
  code: string;
  severity: "error" | "warning" | "info";
  domain: string;
  title: string;
  detail?: string;
  count?: number;
  examples?: string[];
}

export interface FacetValue {
  value: string;
  count?: number;
}

export interface Facet {
  field: string;
  values?: FacetValue[];
}

export interface CorpusStats {
  domain: string;
  recordCount?: number;
  parentCount?: number;
  totalChars?: string | number; // int64
  byLanguage?: Record<string, number>;
  facets?: Facet[];
  unreadableFiles?: string[];
}

export interface ValidationSummary {
  recordId: string;
  kind?: string;
  status?: "pass" | "warnings" | "fail" | "unknown";
  reportDate?: string;
  errorCount?: number;
  warningCount?: number;
}

export interface DomainQuality {
  domain: string;
  label?: string;
  hasCorpus?: boolean;
  hasRetriever?: boolean;
  model?: string;
  score?: number;
  stats?: CorpusStats;
  validatedParents?: number;
  totalParents?: number;
  coveragePct?: number;
  findings?: Finding[];
  reports?: ValidationSummary[];
}

export interface QualityOverview {
  generatedAt?: string;
  domains?: DomainQuality[];
  score?: number;
  totalRecords?: number;
  totalFindings?: number;
  totalErrors?: number;
  totalWarnings?: number;
}

export interface StageCount {
  stage: string;
  count?: number;
}

export interface FailureCause {
  cause: string;
  count?: number;
  stages?: string[];
}

export interface PipelineHealth {
  totalFailures?: number;
  failuresByStage?: StageCount[];
  failuresByCause?: FailureCause[];
  processingStates?: StageCount[];
  stuckItems?: string[];
}

/** Where a page's numbers came from. Every Foundry page shows this. */
export type DataSource =
  | { kind: "live"; at: string }
  | { kind: "sample"; snapshot: string; reason: string };
