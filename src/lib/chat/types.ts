/** Shared chat data model — used by the client UI, the session store and
    the /api/chat route handlers. Plain data only (no React), so it is
    safe to import from server and client code alike. */
import type { Tone } from "@/bubble/tone";

export interface BiString {
  ta: string;
  en: string;
}

/** A Yazhi agent reachable through yazhi-api's
    yazhi.v1.AgentQueryService/QueryAgent. `id` is its agent_name_id. */
export interface Agent {
  id: string;
  name: BiString;
  /** tinai tone — sets the agent's colour everywhere it appears */
  tone: Tone;
  summary: BiString;
  /** the agent's hard rule, shown to the user before they ask */
  rule: BiString;
  /** release state, said plainly (Aram rule 5: never present a plan as done) */
  status: BiString;
  /** one-click starters; mirror yazhi-api data/agent_test_prompts.yaml */
  prompts: { label: BiString; prompt: string }[];
}

export type MessageStatus = "done" | "pending" | "error";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  status?: MessageStatus;
}

export interface Session {
  id: string;
  title: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/** POST /api/chat */
export interface ChatRequest {
  agentId: string;
  messages: Pick<Message, "role" | "content">[];
}

export type ChatErrorCode =
  | "bad_request"
  | "unknown_agent"
  | "unconfigured"
  | "not_sovereign"
  | "unavailable"
  | "upstream";

export type ChatResponse = { reply: string } | { error: { code: ChatErrorCode; message: string } };

/** GET /api/chat/status — whether a turn may be sent at all. */
export type ChatStatus =
  | { state: "ready"; residency: string }
  | { state: "unconfigured" | "not_sovereign" | "unavailable"; detail: string };

/** Limits enforced on both sides (client counter, server validation). */
export const MAX_MESSAGE_CHARS = 4000;
export const MAX_HISTORY_TURNS = 8;
