import "server-only";

/** GET /api/agents — the public roster.
 *
 *  Deliberately a summary: id, names, provider, model and whether a Tamil
 *  name exists. The system prompt, greeting and persona notes stay server-
 *  side — a prompt is the rules an agent must keep, and publishing it invites
 *  prompt injection from outside.
 */

import { AGENTS } from "@/lib/chat/agents";
import type { AgentSummary, AgentsResponse } from "../types";
import { json, type Handler, type HandlerResult } from "./core";

export function agentSummaries(): AgentSummary[] {
  return AGENTS.map((agent) => ({
    id: agent.id,
    name: agent.name,
    ...(agent.taName ? { taName: agent.taName } : {}),
    provider: agent.provider,
    model: agent.model,
    hasTa: Boolean(agent.taName && agent.taName.trim()),
  }));
}

export const agents: Handler = async (): Promise<HandlerResult> => {
  const body: AgentsResponse = { agents: agentSummaries() };
  return json(200, body, { "Cache-Control": "public, max-age=60" });
};
