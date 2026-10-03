"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Markdown } from "@/components/chat/Markdown";
import { CircleButton } from "@/components/circle/CircleButton";
import {
  chooseRuntime,
  DEFAULT_DEVICE_ENDPOINT,
  getDeviceEndpoint,
  runBubble,
  setDeviceEndpoint,
} from "@/lib/bubble/runtime";
import type { BubbleManifest, BubbleMessage, BubbleRuntime } from "@/lib/bubble/types";
import { packColumn } from "./pack";

const TRAY_WIDTH = 150;

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
  return Array.from(m.taName || m.name)[0] ?? "•";
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
  draftId,
  className = "",
}: {
  bubbles: BubbleManifest[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  /** the bubble currently being edited in Foundry — drawn with a dashed ring */
  draftId?: string;
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
  const [text, setText] = useState("");
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

  const { placed, height } = useMemo(
    () => packColumn(bubbles.map((b) => b.size), TRAY_WIDTH),
    [bubbles]
  );

  const lastContent = thread[thread.length - 1]?.content;
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.length, lastContent]);

  const send = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const value = text.trim();
      if (!active || !runtime || !value || streaming) return;
      setText("");
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
    [active, runtime, streaming, text, threads]
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
          <form onSubmit={send} className="flex items-center gap-2 border-t border-ivory/10 px-3 py-3">
            <CircleButton size={38} />
            <div className="flex min-w-0 flex-1 items-center rounded-full border border-ivory/15 bg-night/70 pl-4 pr-1 focus-within:border-gold/60">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Message ${active.name}…`}
                aria-label={`Message ${active.name}`}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ivory placeholder:text-ivory-dim/50 focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-gold hover:text-night"
                  aria-label="Stop"
                >
                  <span className="block h-2.5 w-2.5 rounded-[3px] bg-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-gold text-night transition enabled:hover:bg-bronze disabled:opacity-30"
                  aria-label="Send"
                >
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M6 4l14 8-14 8z" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* bubble tray */}
        <nav
          aria-label="Bubbles"
          className="shrink-0 border-ivory/10 max-md:border-b md:w-[150px] md:border-l"
        >
          {/* phone: a single scrolling row */}
          <ul className="flex gap-2 overflow-x-auto px-3 py-2 md:hidden" data-lenis-prevent>
            {bubbles.map((b) => (
              <li key={b.id}>
                <BubbleDot b={b} r={20} active={b.id === active.id} draft={b.id === draftId} onSelect={select} />
              </li>
            ))}
          </ul>
          {/* desktop: the packed column from the sketch */}
          <div className="chat-scroll hidden h-full overflow-y-auto md:block" data-lenis-prevent>
            <ul className="relative" style={{ width: TRAY_WIDTH, height }}>
              {bubbles.map((b, i) => (
                <li
                  key={b.id}
                  className="absolute"
                  style={{ left: placed[i].x - placed[i].r, top: placed[i].y - placed[i].r }}
                >
                  <BubbleDot b={b} r={placed[i].r} active={b.id === active.id} draft={b.id === draftId} onSelect={select} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

function BubbleDot({
  b,
  r,
  active,
  draft,
  onSelect,
}: {
  b: BubbleManifest;
  r: number;
  active: boolean;
  draft: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(b.id)}
      aria-pressed={active}
      aria-label={`${b.name}${draft ? " (draft)" : ""}`}
      title={`${b.taName ? `${b.taName} · ` : ""}${b.name}${draft ? " — draft" : ""}\n${b.description}`}
      className={`bubble-dot group relative grid place-items-center rounded-full transition-transform hover:scale-105 ${
        active ? "ring-2 ring-ivory ring-offset-2 ring-offset-night-2" : ""
      } ${draft ? "outline-dashed outline-2 outline-offset-2 outline-gold" : ""}`}
      style={{
        width: r * 2,
        height: r * 2,
        background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${b.accent} 55%, white) 0%, ${b.accent} 55%, color-mix(in oklab, ${b.accent} 60%, black) 100%)`,
      }}
    >
      <span className="font-semibold text-night" style={{ fontSize: Math.max(11, r * 0.6) }}>
        {glyph(b)}
      </span>
    </button>
  );
}
