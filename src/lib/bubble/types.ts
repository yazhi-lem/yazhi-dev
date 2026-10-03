/** Bubble manifest — the contract between a bubble a developer builds in
    Foundry and the Bubble UI host that runs it. Plain data; safe on server
    and client. Documented for builders at /bubble#manifest. */

export const BUBBLE_SCHEMA = "yazhi.bubble/v0" as const;

/** Where a bubble's model runs.
    - "device":    an OpenAI-compatible model server on this machine or LAN
                   (llama.cpp, Ollama, a yazhi-one box). Works with no internet.
    - "yazhi-api": Adhan through yazhi-api, reached via yazhi.dev's server.
                   Needs a Circle session and a network path to yazhi-api. */
export type BubbleRuntime = "device" | "yazhi-api";

/** What a bubble asks the host for. The host grants nothing undeclared. */
export type BubblePermission = "yazhi-api" | "clipboard";

export type BubbleSize = "s" | "m" | "l";

export interface BubbleManifest {
  schema: typeof BUBBLE_SCHEMA;
  /** reverse-dns style id, e.g. "circle.<account>.tamil-tutor" */
  id: string;
  version: string;
  name: string;
  /** Tamil display name — draft until a native speaker reviews it */
  taName?: string;
  description: string;
  /** hex accent for the bubble in the tray */
  accent: string;
  size: BubbleSize;
  agent: {
    systemPrompt: string;
    greeting: string;
    /** wrap the prompt in the Five-Posture Reasoning Kernel */
    fivePosture: boolean;
  };
  runtime: {
    /** tried first; the host falls back to "device" when offline */
    prefer: BubbleRuntime;
    /** model id on yazhi-api (allow-listed server-side) */
    model: string;
    /** model id on the device server, e.g. "adhan-kutty" or "qwen3:4b" */
    deviceModel: string;
  };
  permissions: BubblePermission[];
  /** set by Foundry from the signed-in Circle account; absent on drafts
      made while signed out */
  author?: { circleAccountId: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface BubbleMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** which runtime produced an assistant message */
  via?: BubbleRuntime;
}

/** The system prompt actually sent to a model for this bubble. */
export function effectiveSystemPrompt(m: BubbleManifest): string {
  if (!m.agent.fivePosture) return m.agent.systemPrompt;
  return [
    m.agent.systemPrompt.trim(),
    "",
    "Before you answer, work through these five postures silently and let them shape the reply:",
    "1. Context (சூழல் அறிதல்) — who is asking, which language mix they use, which rules apply.",
    "2. Reason (ஆய்தல்) — which sources support the answer, and what is missing.",
    "3. Plan (திட்டமிடல்) — the steps, and which of them need a human to confirm.",
    "4. Respond (உரைத்தல்) — answer in the user's register; cite sources you rely on.",
    "5. Reflect (மீளாய்வு) — if you cannot support a claim, say \"தெரியவில்லை / I don't know\".",
  ].join("\n");
}

const HEX = /^#[0-9a-f]{6}$/i;
const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
export const MAX_PROMPT_CHARS = 8000;

/** Validate untrusted manifest JSON (an import, or a /api/bubble/run body).
    Returns a list of problems; empty means valid. */
export function validateManifest(input: unknown): string[] {
  const errors: string[] = [];
  const m = input as Partial<BubbleManifest> | null;
  if (!m || typeof m !== "object") return ["Manifest must be a JSON object."];
  if (m.schema !== BUBBLE_SCHEMA) errors.push(`schema must be "${BUBBLE_SCHEMA}".`);
  if (typeof m.id !== "string" || !ID.test(m.id) || m.id.length > 120)
    errors.push("id must be lowercase letters, digits, dots or dashes.");
  if (typeof m.name !== "string" || !m.name.trim() || m.name.length > 60)
    errors.push("name is required (max 60 characters).");
  if (m.taName !== undefined && (typeof m.taName !== "string" || m.taName.length > 60))
    errors.push("taName must be text (max 60 characters).");
  if (typeof m.description !== "string" || m.description.length > 280)
    errors.push("description must be text (max 280 characters).");
  if (typeof m.accent !== "string" || !HEX.test(m.accent)) errors.push("accent must be a #rrggbb colour.");
  if (!["s", "m", "l"].includes(m.size as string)) errors.push('size must be "s", "m" or "l".');
  const a = m.agent;
  if (!a || typeof a.systemPrompt !== "string" || !a.systemPrompt.trim())
    errors.push("agent.systemPrompt is required.");
  else if (a.systemPrompt.length > MAX_PROMPT_CHARS)
    errors.push(`agent.systemPrompt must be at most ${MAX_PROMPT_CHARS} characters.`);
  if (!a || typeof a.greeting !== "string" || a.greeting.length > 1000)
    errors.push("agent.greeting must be text (max 1000 characters).");
  if (!a || typeof a.fivePosture !== "boolean") errors.push("agent.fivePosture must be true or false.");
  const r = m.runtime;
  if (!r || !["device", "yazhi-api"].includes(r.prefer as string))
    errors.push('runtime.prefer must be "device" or "yazhi-api".');
  if (!r || typeof r.model !== "string" || r.model.length > 80) errors.push("runtime.model must be text.");
  if (!r || typeof r.deviceModel !== "string" || r.deviceModel.length > 80)
    errors.push("runtime.deviceModel must be text.");
  if (!Array.isArray(m.permissions) || m.permissions.some((p) => !["yazhi-api", "clipboard"].includes(p)))
    errors.push('permissions may only contain "yazhi-api" and "clipboard".');
  return errors;
}
