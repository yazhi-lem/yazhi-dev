/** Shared chat data model — used by the client UI, the session store,
    and the /api/chat route handler. Plain data only (no React), so it
    is safe to import from server and client code alike. */

import type { ThinaiKey } from "@/lib/content";

export type Provider = "adhan" | "gemini" | "openai";

export interface Agent {
  id: string;
  provider: Provider;
  /** short display name (English) */
  name: string;
  /** Tamil display name */
  taName: string;
  description: string;
  /** upstream model id sent to the yazhi-api backend */
  model: string;
  /** system prompt that defines the agent's persona */
  systemPrompt: string;
  /** opening assistant message shown in a fresh session */
  greeting: string;
  /** accent hex used for the agent's avatar/badges */
  accent: string;
  /** the landscape the agent's chat room is dressed in */
  tinai: ThinaiKey;
  /** a few first questions, shown before the conversation starts */
  starters: string[];
  /** "yazhi": Yazhi's own agents, on Adhan through yazhi-api;
      "guest": general assistants on outside models */
  group: "yazhi" | "guest";
  /** the bubble's mark; defaults to the first letter of taName */
  glyph?: string;
  /** Yazhi agents: who the agent is, in a sentence or two */
  persona?: string;
  /** Yazhi agents: the product it lives in */
  home?: string;
  /** Yazhi agents: the rule it never breaks (Aram harness §4) */
  rule?: string;
  /** Yazhi agents: where it is on the launch line */
  status?: string;
  /** one illustrative exchange, labelled as a sample in the UI */
  sample?: { q: string; a: string };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  /** where an assistant reply was generated */
  via?: "cloud" | "device";
}

export interface Session {
  id: string;
  title: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/** The contract between this route handler and the client.
    Messages are the raw conversation (system prompt is added server-side). */
export interface ChatRequest {
  agentId: string;
  messages: Message[];
}

/** NDJSON lines streamed back to the client. */
export type ChatChunk =
  | { text: string }
  | { error: string }
  | { done: boolean };
