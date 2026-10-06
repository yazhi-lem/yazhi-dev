/** Shared chat data model — used by the client UI, the session store,
    and the /api/chat route handler. Plain data only (no React), so it
    is safe to import from server and client code alike. */

export type Provider = "gemini" | "openai";

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
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
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
