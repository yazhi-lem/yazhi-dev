/** Server-only adapter between /chat and yazhi-api.

    A turn goes to yazhi.v1.AgentQueryService/QueryAgent (unary; the
    agent's five-posture run returns one complete answer) through the same
    Connect-JSON transport as every Bubble page (src/lib/yazhi-api/rpc.ts).

    SOVEREIGNTY GATE (Aram rule 2 — data stays home; the Yazhi mark never
    appears on anything that breaks it). Before a turn is forwarded,
    yazhi.v1.YazhiSystem/GetHealth must report:
      sovereignty.externalCalls === 0      (proto3 omits 0 → absent = 0)
      sovereignty.inferenceLocal === true  (absent = false: must be stated)
      sovereignty.dataResidency === "on-prem"
    Otherwise the turn is refused with the reason. The check is enforced
    here in code, not in a prompt, and is only as good as yazhi-api's
    reporting — see docs/YBI-DEV-GUIDE.md §11. */
import "server-only";
import { RpcError, rpcConfigured, unary } from "@/lib/yazhi-api/rpc";
import type { Agent, ChatErrorCode, ChatStatus, Message } from "./types";
import { MAX_HISTORY_TURNS } from "./types";

interface HealthSnapshot {
  status?: string;
  sovereignty?: {
    externalCalls?: number;
    inferenceLocal?: boolean;
    dataResidency?: string;
    lastAuditTs?: string;
  };
}

interface AgentQueryResponse {
  response?: string;
  agentNameId?: string;
  trace?: string;
}

export class ChatError extends Error {
  constructor(
    readonly code: ChatErrorCode,
    message: string,
  ) {
    super(message);
  }
}

/** Is yazhi-api reachable and sovereign right now? Checked fresh on every call. */
export async function chatStatus(): Promise<ChatStatus> {
  if (!rpcConfigured()) {
    return { state: "unconfigured", detail: "yazhi-api is not connected to this site yet (YAZHI_RPC_URL is unset)." };
  }
  let health: HealthSnapshot;
  try {
    // never cached: a gate must judge the service as it is now — a cached
    // "ready" (stale-while-revalidate) would let turns through after
    // yazhi-api stopped being sovereign
    health = await unary<object, HealthSnapshot>("yazhi.v1.YazhiSystem", "GetHealth", {}, { revalidate: 0, timeoutMs: 4000 });
  } catch (err) {
    return { state: "unavailable", detail: err instanceof RpcError ? err.message : "yazhi-api did not answer." };
  }
  const s = health.sovereignty ?? {};
  const external = s.externalCalls ?? 0;
  const local = s.inferenceLocal === true;
  const residency = s.dataResidency ?? "";
  if (external !== 0 || !local || residency !== "on-prem") {
    const why = [
      external !== 0 && `${external} outbound call${external === 1 ? "" : "s"} since start-up`,
      !local && "inference is not reported as local",
      residency !== "on-prem" && `data residency is “${residency || "unreported"}”`,
    ]
      .filter(Boolean)
      .join("; ");
    return { state: "not_sovereign", detail: `yazhi-api is not running sovereign: ${why}.` };
  }
  return { state: "ready", residency };
}

/** Run one turn. Prior turns travel in context.history as JSON so the
    agent can read the conversation; the newest user message is the query. */
export async function askAgent(agent: Agent, messages: Pick<Message, "role" | "content">[], lang: string): Promise<string> {
  const status = await chatStatus();
  if (status.state !== "ready") throw new ChatError(status.state, status.detail);

  const last = messages[messages.length - 1];
  const history = messages.slice(0, -1).slice(-MAX_HISTORY_TURNS * 2);

  let res: AgentQueryResponse;
  try {
    res = await unary<{ agentNameId: string; query: string; context: Record<string, string> }, AgentQueryResponse>(
      "yazhi.v1.AgentQueryService",
      "QueryAgent",
      {
        agentNameId: agent.id,
        query: last.content,
        context: { history: JSON.stringify(history), lang, surface: "yazhi-dev/chat" },
      },
      { revalidate: 0, timeoutMs: 60_000 },
    );
  } catch (err) {
    if (err instanceof RpcError && err.code === "unavailable") throw new ChatError("unavailable", err.message);
    throw new ChatError("upstream", err instanceof Error ? err.message : "yazhi-api returned an error.");
  }
  const reply = res.response?.trim();
  if (!reply) throw new ChatError("upstream", `${agent.name.en} returned an empty answer.`);
  return reply;
}
