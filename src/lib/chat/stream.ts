"use client";
import { readNdjson, streamOnDevice } from "@/lib/bubble/runtime";
import type { Agent, Message } from "./types";

/** Where a Yazhi Chat reply comes from.
    "cloud"  — yazhi.dev's /api/chat, which adds the agent's system prompt
               server-side and streams from yazhi-api.
    "device" — an OpenAI-compatible model server on this machine or LAN,
               the same one the Bubble UI uses; works with no internet. */
export type ChatRuntime = "cloud" | "device";

/** the model name sent to the on-device server (llama-server ignores it) */
const DEVICE_MODEL = "adhan-kutty";

export async function streamReply({
  agent,
  history,
  runtime,
  signal,
  onText,
}: {
  agent: Agent;
  history: Message[];
  runtime: ChatRuntime;
  signal: AbortSignal;
  onText: (chunk: string) => void;
}): Promise<void> {
  const turns = history.filter((m) => m.role === "user" || m.content.trim().length > 0);
  if (runtime === "device") {
    const plain = turns.map(({ id, role, content }) => ({ id, role, content }));
    return streamOnDevice({ model: DEVICE_MODEL, systemPrompt: agent.systemPrompt, history: plain, signal, onText });
  }
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId: agent.id, messages: turns }),
    signal,
  });
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    let message = detail;
    try {
      message = JSON.parse(detail).error ?? detail;
    } catch {
      // plain-text error body
    }
    throw new Error(message || `Request failed (${res.status})`);
  }
  await readNdjson(res.body, onText);
}
