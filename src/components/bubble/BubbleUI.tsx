"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Markdown } from "@/components/chat/Markdown";
import { Composer } from "@/ui/components/Composer";
import { firstGrapheme } from "@/ui/text";
import { CircleButton } from "@/components/circle/CircleButton";
import {
  chooseRuntime,
  DEFAULT_DEVICE_ENDPOINT,
  getDeviceEndpoint,
  runBubble,
  setDeviceEndpoint,
} from "@/lib/bubble/runtime";
import type { BubbleManifest, BubbleMessage, BubbleRuntime } from "@/lib/bubble/types";
import { BubbleTray, type TrayItem } from "@/ui/modules/BubbleTray";


let counter = 0;
const uid = () => `b-${Date.now().toString(36)}-${(counter += 1).toString(36)}`;

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}
const useOnline = () =>
  useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

function glyph(m: BubbleManifest): string {
  return firstGrapheme(m.taName || m.name);
}

const greetingOf = (m: BubbleManifest): BubbleMessage => ({
  id: `greet-${m.id}`,
  role: "assistant",
  content: m.agent.greeting,
});

type RuntimeChoice = "auto" | BubbleRuntime;

/** The Yazhi Bubble UI: a conversation canvas, a tray of bubbles (agents,
    tools, views — each one a manifest a builder made), and a composer with
    the Circle account button. Runs bubbles on-device or through yazhi-api;
    falls back to the device when the browser is offline. */
export function BubbleUI({
  bubbles,
  activeId,
  onActiveChange,
  className = "",
}: {
  bubbles: BubbleManifest[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}) {
  const [localActive, setLocalActive] = useState(bubbles[0]?.id);
  const currentId = activeId ?? localActive;
  const active = bubbles.find((b) => b.id === currentId) ?? bubbles[0];
  const select = (id: string) => (onActiveChange ? onActiveChange(id) : setLocalActive(id));

  const [threads, setThreads] = useState<Record<string, BubbleMessage[]>>({});
  const [streaming, setStreaming] = useState(false);
  const [choice, setChoice] = useState<RuntimeChoice>("auto");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [endpoint, setEndpoint] = useState(DEFAULT_DEVICE_ENDPOINT);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const online = useOnline();

  useEffect(() => {
    queueMicrotask(() => setEndpoint(getDeviceEndpoint()));
  }, []);

  const thread = active ? threads[active.id] ?? [greetingOf(active)] : [];
  const runtime: BubbleRuntime | null = active
    ? choice === "auto"
      ? chooseRuntime(active, online)
      : choice === "yazhi-api" && !online
        ? "device"
        : choice
    : null;

  const trayItems = useMemo<TrayItem[]>(
    () =>
      bubbles.map((b) => ({
        id: b.id,
        label: b.name,
        accent: b.accent,
        size: b.size,
        glyph: glyph(b),
        title: `${b.taName ? `${b.taName} · ` : ""}${b.name}\n${b.description}`,
      })),
    [bubbles]
  );

  const lastContent = thread[thread.length - 1]?.content;
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.length, lastContent]);

  const send = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!active || !runtime || !value || streaming) return;
      const user: BubbleMessage = { id: uid(), role: "user", content: value };
      const reply: BubbleMessage = { id: uid(), role: "assistant", content: "", via: runtime };
      const history = [...(threads[active.id] ?? [greetingOf(active)]), user];
      setThreads((t) => ({ ...t, [active.id]: [...history, reply] }));

      const setReply = (content: string) =>
        setThreads((t) => ({
          ...t,
          [active.id]: (t[active.id] ?? []).map((m) => (m.id === reply.id ? { ...m, content } : m)),
        }));

      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming(true);
      let acc = "";
      try {
        await runBubble({
          manifest: active,
          history,
          runtime,
          signal: controller.signal,
          onText: (chunk) => {
            acc += chunk;
            setReply(acc);
          },
        });
        if (!acc) setReply("_no response_");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setReply(`⚠️ ${(err as Error).message}`);
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [active, runtime, streaming, threads]
  );

  if (!active) return null;

  return (
    <div
      className={`relative flex min-h-[32rem] flex-col overflow-hidden rounded-[1.75rem] border border-ivory/15 bg-night-2/90 shadow-2xl shadow-black/40 ${className}`}
    >
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-ivory/10 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold text-night"
            style={{ backgroundColor: active.accent }}
          >
            {glyph(active)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ivory">
              {active.taName && <span lang="ta">{active.taName} · </span>}
              {active.name}
            </p>
            <p className="truncate text-[11px] text-ivory-dim">{active.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
              online ? "border-mullai/40 text-mullai" : "border-gold/50 text-gold"
            }`}
            title={online ? "Online — yazhi-api reachable through yazhi.dev" : "Offline — on-device models only"}
          >
            {online ? "online" : "offline"}
          </span>
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-expanded={settingsOpen}
            className="rounded-full border border-ivory/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim hover:text-ivory"
            title="Runtime settings"
          >
            {runtime === "device" ? "on-device" : "yazhi-api"} ▾
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className="grid gap-3 border-b border-ivory/10 bg-night/70 px-4 py-3 text-xs text-ivory-dim sm:grid-cols-2">
          <fieldset>
            <legend className="mb-1.5 font-semibold text-ivory">Runtime</legend>
            {(["auto", "device", "yazhi-api"] as RuntimeChoice[]).map((c) => (
              <label key={c} className="mr-3 inline-flex items-center gap-1.5">
                <input
                  type="radio"
                  name="bubble-runtime"
                  checked={choice === c}
                  onChange={() => setChoice(c)}
                  className="accent-[var(--gold)]"
                />
                {c === "auto" ? "auto" : c === "device" ? "on-device" : "yazhi-api"}
              </label>
            ))}
          </fieldset>
          <label className="block">
            <span className="mb-1.5 block font-semibold text-ivory">On-device endpoint (OpenAI-compatible)</span>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              onBlur={() => setDeviceEndpoint(endpoint)}
              spellCheck={false}
              className="w-full rounded-md border border-ivory/15 bg-night px-2 py-1 font-mono text-[11px] text-ivory focus:border-gold/60 focus:outline-none"
            />
          </label>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
        {/* canvas */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" data-lenis-prevent>
            {thread.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ivory/10 px-3.5 py-2 text-sm text-ivory">
                  {m.content}
                </div>
              ) : (
                <div key={m.id} className="max-w-[92%] text-sm text-ivory">
                  {m.content ? (
                    <Markdown>{m.content}</Markdown>
                  ) : (
                    <span className="inline-flex gap-1" aria-label="Thinking">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ivory-dim" style={{ animationDelay: `${i * 120}ms` }} />
                      ))}
                    </span>
                  )}
                  {m.via && m.content && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ivory-dim/60">
                      via {m.via === "device" ? "on-device model" : "yazhi-api"}
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          {/* composer: Circle · input · send */}
          <div className="border-t border-ivory/10 px-3 py-3">
            <Composer
              leading={<CircleButton size={38} />}
              onSend={(t) => void send(t)}
              onStop={() => abortRef.current?.abort()}
              streaming={streaming}
              placeholder={`Message ${active.name}…`}
            />
          </div>
        </div>

        {/* bubble tray */}
        <div className="chat-scroll shrink-0 border-ivory/10 max-md:border-b md:w-[150px] md:overflow-y-auto md:border-l" data-lenis-prevent>
          <BubbleTray items={trayItems} activeId={active.id} onSelect={select} />
        </div>
      </div>
    </div>
  );
}
