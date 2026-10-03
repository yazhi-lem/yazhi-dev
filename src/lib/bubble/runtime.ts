"use client";
import {
  effectiveSystemPrompt,
  type BubbleManifest,
  type BubbleMessage,
  type BubbleRuntime,
} from "./types";

/** Runs a bubble's agent on one of two runtimes and streams text back.

    "device"    — the browser talks straight to an OpenAI-compatible server
                  on this machine or the LAN (llama.cpp `llama-server`,
                  Ollama, a yazhi-one box). Nothing crosses the internet, so
                  this works with the network cable pulled.
    "yazhi-api" — the browser posts to yazhi.dev's /api/bubble/run, which
                  checks the Circle session and streams from yazhi-api. */

const DEVICE_ENDPOINT_KEY = "yazhi-bubble-device-endpoint";
export const DEFAULT_DEVICE_ENDPOINT = "http://localhost:8080/v1";

export function getDeviceEndpoint(): string {
  try {
    return window.localStorage.getItem(DEVICE_ENDPOINT_KEY) || DEFAULT_DEVICE_ENDPOINT;
  } catch {
    return DEFAULT_DEVICE_ENDPOINT;
  }
}

export function setDeviceEndpoint(url: string): void {
  try {
    window.localStorage.setItem(DEVICE_ENDPOINT_KEY, url.trim().replace(/\/+$/, ""));
  } catch {
    // private mode — the default endpoint still works
  }
}

/** Pick a runtime: the bubble's preference, but always the device when the
    browser is offline, and never yazhi-api unless the bubble declared it. */
export function chooseRuntime(m: BubbleManifest, online: boolean): BubbleRuntime {
  if (!online || !m.permissions.includes("yazhi-api")) return "device";
  return m.runtime.prefer;
}

interface RunArgs {
  manifest: BubbleManifest;
  history: BubbleMessage[];
  runtime: BubbleRuntime;
  signal: AbortSignal;
  onText: (chunk: string) => void;
}

const toTurns = (history: BubbleMessage[]) =>
  history
    .filter((m) => m.role === "user" || m.content.trim())
    .map((m) => ({ role: m.role, content: m.content }));

export async function runBubble(args: RunArgs): Promise<void> {
  return args.runtime === "device" ? runOnDevice(args) : runOnYazhiApi(args);
}

async function runOnDevice({ manifest, history, signal, onText }: RunArgs): Promise<void> {
  const endpoint = getDeviceEndpoint();
  let res: Response;
  try {
    res = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: manifest.runtime.deviceModel,
        stream: true,
        messages: [{ role: "system", content: effectiveSystemPrompt(manifest) }, ...toTurns(history)],
      }),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new Error(
      `No on-device model answered at ${endpoint}. Start one (e.g. \`llama-server -m <model>.gguf --port 8080\`) and allow this site's origin, or change the endpoint in runtime settings.`
    );
  }
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`On-device model responded ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }
  await readSse(res.body, onText);
}

async function runOnYazhiApi({ manifest, history, signal, onText }: RunArgs): Promise<void> {
  const res = await fetch("/api/bubble/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manifest, messages: toTurns(history) }),
    signal,
  });
  if (!res.ok || !res.body) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  await readNdjson(res.body, onText);
}

/** OpenAI-style SSE: `data: {choices:[{delta:{content}}]}` … `data: [DONE]` */
async function readSse(body: ReadableStream<Uint8Array>, onText: (t: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data:")) continue;
      const payload = t.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta) onText(delta);
      } catch {
        // heartbeat or partial frame
      }
    }
  }
}

/** yazhi.dev NDJSON: `{text}` | `{error}` | `{done}` per line */
async function readNdjson(body: ReadableStream<Uint8Array>, onText: (t: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      let chunk: { text?: string; error?: string };
      try {
        chunk = JSON.parse(line);
      } catch {
        continue;
      }
      if (chunk.error) throw new Error(chunk.error);
      if (chunk.text) onText(chunk.text);
    }
  }
}
