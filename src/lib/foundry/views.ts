/** Foundry pages as data. Each function turns yazhi-api responses into a
    Bubble page spec (src/bubble/spec/types.ts); the route files only
    fetch and render. This is the pattern for every future Bubble page:
    load → view(data) → <BubbleView blocks={…} />. Pure functions, so
    they are trivially testable and an agent can emit the same shapes. */
import type { Block, StageSpec, StageState, StatItem } from "@/bubble";
import { scoreTone } from "@/bubble/tone";
import { FACTORY_LOOP, FOUNDRY_PROJECTS, formatInterval, type FoundryProject } from "./projects";
import type { DataSource, DomainQuality, PipelineHealth, QualityOverview } from "./types";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** proto3 JSON drops zero values and encodes int64 as strings. */
export function num(v: number | string | undefined): number {
  if (v === undefined) return 0;
  return typeof v === "number" ? v : Number(v) || 0;
}

export const FOUNDRY_TITLE = { ta: "வார்ப்பகம்", en: "Foundry" };

function sourceNotice(source: DataSource): Block {
  return source.kind === "live"
    ? { kind: "notice", tone: "ok", badge: "Live", title: "Live from yazhi-api.", body: `YazhiInsight, ${source.at}.` }
    : {
        kind: "notice",
        tone: "warn",
        badge: "Sample",
        title: `Sample data — ${source.reason}.`,
        body: `Figures are from the ${source.snapshot}. Set YAZHI_RPC_URL to read live Insight data.`,
      };
}

function hasCorpus(q?: DomainQuality): boolean {
  return Boolean(q?.hasCorpus) && num(q?.stats?.recordCount) > 0;
}

// ── /foundry ────────────────────────────────────────────────────────────

export function overviewView(overview: QualityOverview, source: DataSource): Block[] {
  const byDomain = new Map((overview.domains ?? []).map((d) => [d.domain, d]));
  const withCorpus = FOUNDRY_PROJECTS.filter((p) => hasCorpus(byDomain.get(p.id))).length;
  const pipelines = FOUNDRY_PROJECTS.flatMap((p) => p.pipelines.map((pl) => ({ project: p, pl })));
  const score = num(overview.score);

  return [
    {
      kind: "header",
      eyebrow: "Yazhi Dev · Foundry",
      title: FOUNDRY_TITLE,
      tone: "gold",
      description: {
        ta: "யாழியின் இறையாண்மை மாதிரிகளுக்கு தரவு வார்க்கும் ஆறு களங்கள்.",
        en: "Six domain data programmes feeding Yazhi's sovereign models — what each collects, how much of it is trustworthy, and what is blocking it.",
      },
    },
    sourceNotice(source),
    {
      kind: "stats",
      items: [
        { label: { ta: "தரம்", en: "Corpus score" }, value: `${score}`, hint: "0–100, ranks domains", tone: scoreTone(score) },
        { label: { ta: "பதிவுகள்", en: "Records" }, value: fmt(num(overview.totalRecords)), tone: "info" },
        {
          label: { ta: "குறைகள்", en: "Findings" },
          value: fmt(num(overview.totalFindings)),
          hint: `${fmt(num(overview.totalErrors))} errors · ${fmt(num(overview.totalWarnings))} warnings`,
          tone: num(overview.totalErrors) > 0 ? "error" : "ok",
        },
        { label: { ta: "தரவுத் தொகுப்பு", en: "With a corpus" }, value: `${withCorpus} / ${FOUNDRY_PROJECTS.length}`, tone: "kurinji" },
      ],
    },
    {
      kind: "section",
      title: { ta: "திட்டங்கள்", en: "Projects" },
      description: "One per yazhi-api domain. Open a project for its stage chain, pipelines and quality findings.",
      blocks: [{ kind: "cards", items: FOUNDRY_PROJECTS.map((p) => projectCard(p, byDomain.get(p.id))) }],
    },
    {
      kind: "section",
      title: { ta: "குழாய்கள்", en: "Pipelines" },
      description: "Every YazhiFactory config, classified by domain and content language (factory/configs/<domain>/<language>/).",
      framed: true,
      blocks: [
        {
          kind: "table",
          caption: "Factory pipelines",
          columns: ["Pipeline", "Project", "Language", "Schedule", "Collector → enricher"],
          rows: pipelines.map(({ project, pl }) => [
            pl.name,
            project.name.en,
            pl.language,
            formatInterval(pl.intervalSeconds),
            `${pl.collector} → ${pl.enricher ?? "—"}`,
          ]),
        },
      ],
    },
  ];
}

function projectCard(p: FoundryProject, q?: DomainQuality) {
  const corpus = hasCorpus(q);
  return {
    title: p.name,
    subtitle: `${p.id} · ${p.model}`,
    body: p.summary,
    tone: p.tone,
    href: `/foundry/${p.id}`,
    meter: { value: corpus ? num(q?.score) : null, label: `${p.name.en} quality score`, caption: "—" },
    pills: [
      corpus ? { label: "Corpus", tone: "ok" as const } : { label: "No corpus", tone: "neutral" as const },
      q?.hasRetriever ? { label: "Retriever", tone: "info" as const } : { label: "No retriever", tone: "neutral" as const },
    ],
    meta: [
      { label: "Records", value: corpus ? fmt(num(q?.stats?.recordCount)) : "0" },
      { label: "Pipelines", value: `${p.pipelines.length}` },
      { label: "Coverage", value: corpus ? `${Math.round(num(q?.coveragePct))}%` : "—" },
    ],
  };
}

// ── /foundry/[project] ──────────────────────────────────────────────────

function stageStates(p: FoundryProject, q: DomainQuality, health: PipelineHealth | null): StageSpec[] {
  const corpus = hasCorpus(q);
  const failures = new Map((health?.failuresByStage ?? []).map((s) => [s.stage, num(s.count)]));
  const validated = num(q.validatedParents);
  const total = num(q.totalParents);

  return p.stages.map((stage) => {
    const failed = failures.get(stage) ?? 0;
    let state: StageState = corpus ? "done" : "pending";
    let note: string | undefined = corpus ? undefined : "awaiting first run";
    if (failed > 0) {
      state = "attention";
      note = `${fmt(failed)} failures`;
    } else if (stage === "validate" && corpus && total > 0 && validated < total) {
      state = "attention";
      note = `${fmt(validated)} / ${fmt(total)} validated`;
    }
    return { id: stage, label: stage, state, note };
  });
}

function loopStates(corpus: boolean): StageSpec[] {
  return FACTORY_LOOP.map((s) => ({
    id: s,
    label: s,
    state: corpus ? "done" : "pending",
    note: corpus ? undefined : "awaiting first run",
  }));
}

export function projectView(
  p: FoundryProject,
  q: DomainQuality,
  health: PipelineHealth | null,
  source: DataSource,
): Block[] {
  const corpus = hasCorpus(q);
  const score = num(q.score);
  const findings = (q.findings ?? []).map((f) => ({
    code: f.code,
    severity: f.severity,
    title: f.title,
    detail: f.detail,
    count: num(f.count),
  }));

  const stats: StatItem[] = [
    {
      label: { ta: "தரம்", en: "Quality score" },
      value: corpus ? `${score}` : "—",
      hint: corpus ? "0–100, ranks domains" : "no corpus to score",
      tone: corpus ? scoreTone(score) : "neutral",
    },
    { label: { ta: "பதிவுகள்", en: "Records" }, value: fmt(num(q.stats?.recordCount)), tone: p.tone },
    {
      label: { ta: "சரிபார்த்தவை", en: "Validated" },
      value: num(q.totalParents) > 0 ? `${fmt(num(q.validatedParents))} / ${fmt(num(q.totalParents))}` : "—",
      hint: "sources with a validation report",
      tone: "info",
    },
    {
      label: { ta: "குறைகள்", en: "Findings" },
      value: fmt(findings.length),
      hint: `${fmt(findings.filter((f) => f.severity === "error").length)} errors`,
      tone: findings.some((f) => f.severity === "error") ? "error" : "ok",
    },
  ];

  const blocks: Block[] = [
    {
      kind: "header",
      crumbs: [{ label: "Foundry", href: "/foundry" }, { label: p.name.en }],
      eyebrow: `${p.id} · routes to ${p.model}`,
      title: p.name,
      description: p.summary,
      tone: p.tone,
      pills: [
        corpus ? { label: "Corpus", tone: "ok" } : { label: "No corpus", tone: "neutral" },
        q.hasRetriever ? { label: "Retriever", tone: "info" } : { label: "No retriever", tone: "neutral" },
        { label: `${p.pipelines.length} pipeline${p.pipelines.length === 1 ? "" : "s"}`, tone: p.tone },
      ],
    },
    sourceNotice(source),
    { kind: "stats", items: stats },
  ];

  if (!corpus) {
    blocks.push({
      kind: "empty",
      title: { ta: "இன்னும் தரவு இல்லை", en: "No corpus yet" },
      body: `The ${p.name.en} pipelines are configured but nothing has been collected into the Agazhi lake. Run one pass with the command below and this page fills in.`,
      art: "sleepy",
    });
  }

  blocks.push({
    kind: "section",
    title: { ta: "நிலைகள்", en: "Stage chain" },
    description: p.stages.length
      ? `The ${p.id} stage CLI, then the YazhiFactory loop every pipeline shares.`
      : "This domain runs the generic YazhiFactory loop only — no domain-specific stage CLI yet.",
    framed: true,
    tone: p.tone,
    blocks: [
      ...(p.stages.length ? [{ kind: "stages" as const, label: `${p.name.en} stages`, stages: stageStates(p, q, health) }] : []),
      { kind: "stages", label: "YazhiFactory loop", stages: loopStates(corpus) },
    ],
  });

  blocks.push({
    kind: "section",
    title: { ta: "குழாய்கள்", en: "Pipelines" },
    blocks: [
      {
        kind: "cards",
        columns: 2,
        items: p.pipelines.map((pl) => ({
          title: pl.name,
          body: pl.description,
          tone: p.tone,
          pills: [
            { label: pl.language, tone: "info" },
            { label: formatInterval(pl.intervalSeconds), tone: "neutral" },
          ],
          meta: [
            { label: "Collector", value: pl.collector },
            { label: "Enricher", value: pl.enricher ?? "—" },
          ],
        })),
      },
    ],
  });

  blocks.push({
    kind: "section",
    title: { ta: "தரக் குறைகள்", en: "Quality findings" },
    description: "Aggregated by root cause across every record they affect (yazhi.insight.v1.Finding).",
    framed: true,
    blocks: [{ kind: "findings", items: findings, empty: corpus ? "No findings — every check passes." : "Nothing to check until a corpus exists." }],
  });

  const causes = health?.failuresByCause ?? [];
  if (causes.length > 0) {
    blocks.push({
      kind: "section",
      title: { ta: "குழாய் நலம்", en: "Pipeline health" },
      description: "Ingestion failures across all domains, grouped by normalised root cause.",
      framed: true,
      blocks: [
        {
          kind: "table",
          caption: "Failures by cause",
          columns: ["Cause", "Stages", "Count"],
          numeric: [2],
          rows: causes.map((c) => [c.cause, (c.stages ?? []).join(", "), fmt(num(c.count))]),
        },
      ],
    });
  }

  const langs = Object.entries(q.stats?.byLanguage ?? {});
  blocks.push({
    kind: "section",
    title: { ta: "உருவாக்குங்கள்", en: "Build on it" },
    framed: true,
    blocks: [
      {
        kind: "keyvalue",
        items: [
          { label: "Run one pass", value: `yz factory -d ${p.id} --once`, mono: true },
          { label: "List the catalog", value: "yz factory --list", mono: true },
          { label: "Worker model", value: p.model, mono: true },
          { label: "Languages", value: langs.length ? langs.map(([l, n]) => `${l} (${fmt(n)})`).join(", ") : "—" },
        ],
      },
    ],
  });

  return blocks;
}
