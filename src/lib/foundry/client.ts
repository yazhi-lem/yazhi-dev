/** Foundry data access for Server Components. Reads yazhi-api's
    YazhiInsight service when YAZHI_RPC_URL is set; otherwise — or when
    the call fails — falls back to the audited sample and says so via
    `source`, so a page never shows sample numbers as if they were live. */
import "server-only";
import { RpcError, rpcConfigured, unary } from "@/lib/yazhi-api/rpc";
import { SAMPLE_OVERVIEW, SAMPLE_SNAPSHOT } from "./sample";
import type { DataSource, DomainQuality, PipelineHealth, QualityOverview } from "./types";

const INSIGHT = "yazhi.insight.v1.YazhiInsight";

function sample(reason: string): DataSource {
  return { kind: "sample", snapshot: SAMPLE_SNAPSHOT, reason };
}

function reasonFor(err: unknown): string {
  if (err instanceof RpcError) return err.code === "unconfigured" ? "yazhi-api not connected" : err.message;
  return "yazhi-api request failed";
}

export async function loadOverview(): Promise<{ overview: QualityOverview; source: DataSource }> {
  if (!rpcConfigured()) return { overview: SAMPLE_OVERVIEW, source: sample("yazhi-api not connected") };
  try {
    const overview = await unary<object, QualityOverview>(INSIGHT, "GetQualityOverview", {}, { tags: ["foundry"] });
    return { overview, source: { kind: "live", at: overview.generatedAt ?? new Date().toISOString() } };
  } catch (err) {
    return { overview: SAMPLE_OVERVIEW, source: sample(reasonFor(err)) };
  }
}

export async function loadProject(
  domain: string,
): Promise<{ quality: DomainQuality; health: PipelineHealth | null; source: DataSource }> {
  const fallback = SAMPLE_OVERVIEW.domains?.find((d) => d.domain === domain) ?? { domain };
  if (!rpcConfigured()) return { quality: fallback, health: null, source: sample("yazhi-api not connected") };
  try {
    const [quality, health] = await Promise.all([
      unary<{ domain: string }, DomainQuality>(INSIGHT, "GetDomainQuality", { domain }, { tags: ["foundry", `foundry:${domain}`] }),
      // PipelineHealth is corpus-wide; a failure here shouldn't sink the page
      unary<object, PipelineHealth>(INSIGHT, "GetPipelineHealth", {}, { tags: ["foundry"] }).catch(() => null),
    ]);
    return { quality, health, source: { kind: "live", at: new Date().toISOString() } };
  } catch (err) {
    return { quality: fallback, health: null, source: sample(reasonFor(err)) };
  }
}
