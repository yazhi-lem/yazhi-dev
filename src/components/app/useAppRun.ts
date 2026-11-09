"use client";
/** The run engine behind the `/app` canvas.

    Two ways to ask a bubble, same UI, one hook:

      yazhi-api  POST /api/bubble/run through the typed client
                 (`createClient(origin).runBubble`) — the frozen route
                 api-kernel documents, streamed as NDJSON, Circle-gated.
      device     `streamOnDevice` from `@yazhi/bubble/lib/runtime` — the
                 OpenAI-compatible model server on this machine or LAN. Works
                 with the network cable pulled.

    Which one runs is `chooseRuntime` from the library (the bubble's
    preference; device whenever the browser is offline or the bubble has not
    declared the `yazhi-api` permission), or an explicit choice from the
    runtime switch, which the bubble's permissions can veto.

    Server APIs never reach this file:
      - the client is built from a **URL**, so ONE value import
        (`createClient` from `@/lib/api/client`) is all the browser graph sees;
      - `@/lib/api/ports` is not imported at all (`localPort()` would drag
        `local-port.ts` → `@/lib/circle/session`, which is `server-only`);
      - the error type is recognised structurally rather than by `instanceof`,
        so the `YazhiApiError` class never needs importing here either;
      - nothing under `@/lib/circle/` is imported, and nothing here reads
        `window` during render. */

import { useCallback, useEffect, useRef, useState } from "react";
import { STARTER_BUBBLES, effectiveSystemPrompt, type BubbleManifest, type BubbleMessage, type BubbleRuntime } from "@yazhi/bubble";
import { chooseRuntime, streamOnDevice } from "@yazhi/bubble/lib/runtime";
import { createClient } from "@/lib/api/client";
import type { AppBubble } from "./bubbles";

export type RuntimeMode = "auto" | "device" | "yazhi-api";

export interface RunTurn extends BubbleMessage {
  /** how the run ended: a finished answer, a person pressing stop, or an error */
  status?: "done" | "stopped" | "error";
}

/** One bubble's thread, as the host keeps it for this session. */
export interface BubbleRunHistory {
  thread: string;
  turns: RunTurn[];
}

export interface RunError {
  /** what went wrong, in the bubble's own words where the server has them */
  message: string;
  /** a localised explanation built from the copy table */
  kind: "session" | "unconfigured" | "start" | "stopped";
  code?: string;
}

/** A stable id for a turn or a run — no random source, so a re-render can
    never disagree with itself. Only ever called from event handlers. */
let counter = 0;
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}${counter.toString(36)}`;
}

/** Deep links carry at most this many questions in `?q=` (the last N). */
export const MAX_LINK_TURNS = 6;

/** The bubble's manifest as v0. The five starter bubbles already are v0; a
    registry bubble published as v1 is mapped onto the v0 fields the frozen
    /api/bubble/run route validates. The permission rule is the route's: only
    declare `yazhi-api` when the bubble runs there (declaring it otherwise is
    a 400, and *not* declaring it is a 403 from the route). */
export function runManifest(manifest: BubbleManifest): BubbleManifest {
  return {
    schema: "yazhi.bubble/v0",
    id: manifest.id,
    version: manifest.version,
    name: manifest.name,
    ...(manifest.taName ? { taName: manifest.taName } : {}),
    description: manifest.description,
    accent: manifest.accent,
    size: manifest.size,
    agent: {
      systemPrompt: manifest.agent.systemPrompt,
      greeting: manifest.agent.greeting,
      fivePosture: manifest.agent.fivePosture,
    },
    runtime: {
      prefer: manifest.runtime.prefer === "yazhi-api" ? "yazhi-api" : "device",
      model: manifest.runtime.model,
      deviceModel: manifest.runtime.deviceModel,
    },
    permissions: manifest.runtime.prefer === "yazhi-api" ? ["yazhi-api", "clipboard"] : ["clipboard"],
    createdAt: manifest.createdAt,
    updatedAt: manifest.updatedAt,
  };
}

/** The bubble's permission set, as the host reads it. */
export function declaredPermissions(manifest: BubbleManifest): ("yazhi-api" | "clipboard")[] {
  return runManifest(manifest).permissions;
}

/** Which runtime a run will use, given the bubble, the mode and the network. */
export function resolveRuntime(mode: RuntimeMode, bubble: AppBubble, online: boolean): BubbleRuntime {
  const manifest = bubble.manifest ?? STARTER_BUBBLES[0];
  const allowed = declaredPermissions(manifest);
  const base: BubbleManifest = { ...manifest, permissions: allowed };
  if (mode === "auto") return chooseRuntime(base, online);
  if (mode === "device") return "device";
  return allowed.includes("yazhi-api") ? "yazhi-api" : "device";
}

/** Turn whatever a run threw into something the canvas can say. A Circle
    gate, an unconfigured yazhi-api and a dead model server each deserve a
    different sentence, and the frozen route answers 401 / 503 for the first
    two. Recognised structurally: `YazhiApiError` carries `status` and a body
    on an `Error`, so no class import is needed here. */
export function classifyError(err: unknown): RunError {
  const shaped = err as { status?: unknown; message?: unknown; code?: unknown; name?: unknown } | null;
  if (shaped && typeof shaped.status === "number" && typeof shaped.message === "string") {
    const code = typeof shaped.code === "string" ? shaped.code : undefined;
    if (shaped.status === 401) return { message: shaped.message, kind: "session", code };
    if (shaped.status === 503) return { message: shaped.message, kind: "unconfigured", code };
    return { message: shaped.message, kind: "start", code };
  }
  if (shaped && shaped.name === "AbortError") return { message: "", kind: "stopped" };
  const message = err instanceof Error ? err.message : String(err);
  return { message, kind: "start" };
}

/** Stream one reply. Resolves with the full text; throws AbortError when the
    person pressed stop. Text already streamed stays with the caller. */
export async function streamReply({
  bubble,
  history,
  runtime,
  signal,
  onText,
}: {
  bubble: AppBubble;
  history: BubbleMessage[];
  runtime: BubbleRuntime;
  signal: AbortSignal;
  onText: (chunk: string) => void;
}): Promise<string> {
  const manifest = bubble.manifest ?? STARTER_BUBBLES[0];
  const v0 = runManifest(manifest);
  const turns: BubbleMessage[] = history
    .filter((m) => m.role === "user" || m.content.trim())
    .map((m, i) => ({ id: m.id ?? `h${i}`, role: m.role, content: m.content }));
  let full = "";

  if (runtime === "device") {
    await streamOnDevice({
      model: v0.runtime.deviceModel,
      systemPrompt: effectiveSystemPrompt(v0),
      history: turns,
      signal,
      onText: (chunk) => {
        full += chunk;
        onText(chunk);
      },
    });
    return full;
  }

  // Same origin, over HTTP. `createClient` takes a URL and builds the HTTP
  // port itself; the typed client adds retry/backoff on 429 and 503 and one
  // error type. `?format=sse` is left to the port default (NDJSON).
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const client = createClient(origin, { attempts: 2 });
  for await (const chunk of client.runBubble(v0, turns, { signal })) {
    if ("text" in chunk) {
      full += chunk.text;
      onText(chunk.text);
    } else if ("done" in chunk) {
      break;
    }
  }
  return full;
}

/* ── the hook ───────────────────────────────────────────────────────── */

export interface UseAppRun {
  streaming: boolean;
  /** the answer as it arrives, drawn on the canvas but NEVER in the live
      region — the canvas announces once, at completion */
  draft: string;
  error: RunError | null;
  send: (text: string, history: BubbleMessage[], bubble: AppBubble, runtime: BubbleRuntime) => Promise<void>;
  stop: () => void;
  clearError: () => void;
}

export function useAppRun(onDone: (text: string, runtime: BubbleRuntime) => void): UseAppRun {
  const [streaming, setStreaming] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<RunError | null>(null);
  const abort = useRef<AbortController | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      abort.current?.abort();
    };
  }, []);

  const stop = useCallback(() => {
    abort.current?.abort();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const send = useCallback(
    async (text: string, history: BubbleMessage[], bubble: AppBubble, runtime: BubbleRuntime) => {
      void text; // the question is already in `history`
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;
      setError(null);
      setDraft("");
      setStreaming(true);
      let full = "";
      try {
        await streamReply({
          bubble,
          history,
          runtime,
          signal: controller.signal,
          onText: (chunk) => {
            full += chunk;
            if (alive.current) setDraft(full);
          },
        });
        if (alive.current) onDone(full, runtime);
      } catch (err) {
        const failure = classifyError(err);
        if (alive.current && failure.kind !== "stopped") setError(failure);
        // a stopped run keeps the text it had — and is not announced
        if (alive.current && failure.kind === "stopped" && full) onDone(full, runtime);
      } finally {
        if (alive.current) {
          setStreaming(false);
          setDraft("");
        }
        abort.current = null;
      }
    },
    [onDone]
  );

  return { streaming, draft, error, send, stop, clearError };
}
