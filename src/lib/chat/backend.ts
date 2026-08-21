/** Server-only adapter that fronts the chat UI to the yazhi-api backend.
    THIS FILE IS THE SINGLE INTEGRATION POINT FOR yazhi-api.

    Contract (aligned with the OpenAI-compatible Chat Completions shape,
    which most agent backends — including yazhi-api — follow):
      POST {YAZHI_API_URL}{YAZHI_CHAT_PATH}
      body: { model, messages: [{role, content}...], stream: true }
      auth: Authorization: Bearer {YAZHI_API_KEY}   (optional)
      response: Server-Sent Events (data: {choices:[{delta:{content}}]}, data: [DONE])

    The route handler re-streams this to the browser as NDJSON lines of
    ChatChunk. If yazhi-api deviates from this shape, adapt parseSseLine()
    below — nothing else needs to change. */

import type { Agent, ChatChunk } from "./types";

const YAZHI_API_URL = process.env.YAZHI_API_URL;
const YAZHI_API_KEY = process.env.YAZHI_API_KEY;
const YAZHI_CHAT_PATH = process.env.YAZHI_CHAT_PATH ?? "/v1/chat/completions";

const encoder = new TextEncoder();

function errorStream(message: string): ReadableStream<Uint8Array> {
  const chunk: ChatChunk = { error: message };
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
      controller.close();
    },
  });
}

/** Convert an SSE "data:" line into text content, or null when there is
    nothing to forward (heartbeats, [DONE], malformed payloads). */
function parseSseLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const json = JSON.parse(payload);
    const delta = json.choices?.[0]?.delta?.content;
    return typeof delta === "string" ? delta : null;
  } catch {
    return null;
  }
}

export async function streamFromBackend({
  agent,
  messages,
}: {
  agent: Agent;
  messages: { role: "user" | "assistant"; content: string }[];
}): Promise<ReadableStream<Uint8Array>> {
  if (!YAZHI_API_URL) {
    return errorStream(
      "Chat is not configured yet — set YAZHI_API_URL (and YAZHI_API_KEY) in your .env to connect the yazhi-api backend. See .env.example."
    );
  }

  const upstream = await fetch(`${YAZHI_API_URL}${YAZHI_CHAT_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(YAZHI_API_KEY ? { Authorization: `Bearer ${YAZHI_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: agent.model,
      messages: [{ role: "system", content: agent.systemPrompt }, ...messages],
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return errorStream(
      `Backend responded ${upstream.status}: ${detail.slice(0, 300) || upstream.statusText}`
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode(JSON.stringify({ done: true } as ChatChunk) + "\n"));
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const text = parseSseLine(line);
        if (text) {
          controller.enqueue(
            encoder.encode(JSON.stringify({ text } as ChatChunk) + "\n")
          );
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
