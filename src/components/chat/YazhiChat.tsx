"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { ThinaiKey } from "@/lib/content";
import { AGENTS, PROVIDER_META, getAgent } from "@/lib/chat/agents";
import { streamReply, type ChatRuntime } from "@/lib/chat/stream";
import type { Agent, Message } from "@/lib/chat/types";
import { useChatStore } from "@/lib/chat/useChatStore";
import { DEFAULT_DEVICE_ENDPOINT, getDeviceEndpoint, setDeviceEndpoint } from "@/lib/bubble/runtime";
import { LogoMark } from "@/components/ui/LogoMark";
import { CircleProvider } from "@/components/circle/CircleProvider";
import { CircleButton } from "@/components/circle/CircleButton";
import { Markdown } from "./Markdown";
import { YazhStrings } from "./YazhStrings";
import { ChatComposer, type ComposerHandle } from "./ChatComposer";
import { ENVIRONMENTS, ENV_BY_KEY } from "@/ui/tinai/environments";
import { TinaiScope } from "@/ui/tinai/TinaiScope";
import { TinaiAmbient } from "@/ui/tinai/TinaiAmbient";
import { MagneticTray, type MagneticItem } from "@/ui/tinai/MagneticTray";
import { HairlineFigure } from "@/ui/hairline/HairlineFigure";
import type { HairlineFigureDef } from "@/ui/hairline/types";
import { firstGrapheme } from "@/ui/text";
import yazh from "@/ui/hairline/figures/yazh.js";
import olai from "@/ui/hairline/figures/olai.js";
import tide from "@/ui/hairline/figures/tide.js";
import cairn from "@/ui/hairline/figures/cairn.js";
import grove from "@/ui/hairline/figures/grove.js";
import vilakku from "@/ui/hairline/figures/vilakku.js";
import paddy from "@/ui/hairline/figures/paddy.js";
import parai from "@/ui/hairline/figures/parai.js";

/** Each agent's Hairline emblem, drawn while its room is empty. */
const EMBLEM: Record<string, HairlineFigureDef> = {
  pulavar: yazh as HairlineFigureDef,
  nyaya: paddy as HairlineFigureDef,
  kural: cairn as HairlineFigureDef,
  guru: grove as HairlineFigureDef,
  annachi: parai as HairlineFigureDef,
  "yazh-guide": yazh as HairlineFigureDef,
  "sangam-scholar": olai as HairlineFigureDef,
  "neythal-poet": tide as HairlineFigureDef,
  "code-companion": cairn as HairlineFigureDef,
  "adhan-architect": grove as HairlineFigureDef,
  "research-assistant": vilakku as HairlineFigureDef,
};

const glyphOf = (a: Agent) => a.glyph ?? firstGrapheme(a.taName);
const OWN = AGENTS.filter((a) => a.group === "yazhi");
const GUESTS = AGENTS.filter((a) => a.group === "guest");
const toItem = (a: Agent): MagneticItem => ({ id: a.id, label: a.name, ta: a.taName, accent: a.accent, glyph: glyphOf(a) });

const THEME_KEY = "yazhi-chat-tinai";
const RUNTIME_KEY = "yazhi-chat-runtime";
type ThemeChoice = "auto" | ThinaiKey;
type RuntimeChoice = "auto" | ChatRuntime;

let counter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(counter += 1).toString(36)}`;

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}
const useOnline = () => useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

function load<T extends string>(key: string, fallback: T, valid: readonly string[]): T {
  try {
    const v = window.localStorage.getItem(key);
    return v && valid.includes(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // private mode: the choice lasts for this visit
  }
}

/** Yazhi Chat: talk to Yazhi's agents in a room dressed as their landscape.

    The agents are bubbles in a magnetic tray; each lives in one tinai, so
    choosing an agent cross-fades the whole room to its ground, ink and
    ambient field (or keep one landscape, from Settings). An empty room shows
    the agent's Hairline emblem and a few first questions. Replies stream
    from yazhi-api through /api/chat, or from a model on this device when
    you are offline or choose it. */
export function YazhiChat() {
  return (
    <CircleProvider>
      <ChatRoom />
    </CircleProvider>
  );
}

function ChatRoom() {
  const store = useChatStore();
  const { activeSession, sessions, activeId } = store;
  const online = useOnline();

  const [agentId, setAgentId] = useState(AGENTS[0].id);
  const [theme, setTheme] = useState<ThemeChoice>("auto");
  const [runtimeChoice, setRuntimeChoice] = useState<RuntimeChoice>("auto");
  const [endpoint, setEndpoint] = useState(DEFAULT_DEVICE_ENDPOINT);
  const [panel, setPanel] = useState<null | "threads" | "settings">(null);
  const [streaming, setStreaming] = useState(false);
  const [announce, setAnnounce] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const composer = useRef<ComposerHandle>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // remembered choices, read after hydration so the first render matches the server
  useEffect(() => {
    queueMicrotask(() => {
      setTheme(load<ThemeChoice>(THEME_KEY, "auto", ["auto", ...ENVIRONMENTS.map((e) => e.key)]));
      setRuntimeChoice(load<RuntimeChoice>(RUNTIME_KEY, "auto", ["auto", "cloud", "device"]));
      setEndpoint(getDeviceEndpoint());
    });
  }, []);

  const agent: Agent = getAgent(activeSession?.agentId ?? agentId) ?? AGENTS[0];
  const tinai: ThinaiKey = theme === "auto" ? agent.tinai : theme;
  const runtime: ChatRuntime =
    runtimeChoice === "auto" ? (online ? "cloud" : "device") : runtimeChoice === "cloud" && !online ? "device" : runtimeChoice;

  const messages = activeSession?.messages ?? [];
  const started = messages.some((m) => m.role === "user");

  // keep the newest words in view while a reply streams
  const last = messages[messages.length - 1]?.content;
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // a new room opens at the top, on the agent's emblem
    if (!started) {
      el.scrollTo({ top: 0 });
      return;
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages.length, last, started, agent.id]);

  // Escape closes whichever panel is open
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const chooseAgent = useCallback(
    (id: string) => {
      if (id === agent.id && !started) {
        composer.current?.focus();
        return;
      }
      stop();
      setAgentId(id);
      store.reset();
      const a = getAgent(id);
      if (a) setAnnounce(`${a.name}. ${a.description}`);
      requestAnimationFrame(() => composer.current?.focus());
    },
    [agent.id, started, stop, store]
  );

  const newThread = useCallback(() => {
    stop();
    store.reset();
    setPanel(null);
    requestAnimationFrame(() => composer.current?.focus());
  }, [stop, store]);

  const openThread = useCallback(
    (id: string) => {
      stop();
      const s = sessions.find((x) => x.id === id);
      if (s) setAgentId(s.agentId);
      store.selectSession(id);
      setPanel(null);
    },
    [sessions, stop, store]
  );

  const send = useCallback(
    async (text: string) => {
      if (streaming) return;
      const session = activeSession ?? store.createSession(agent);
      const now = Date.now();
      const user: Message = { id: uid("m"), role: "user", content: text, createdAt: now };
      const reply: Message = { id: uid("m"), role: "assistant", content: "", createdAt: now + 1, via: runtime };
      store.addMessage(session.id, user);
      store.addMessage(session.id, reply);

      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming(true);
      setAnnounce(`${agent.name} is replying.`);
      let acc = "";
      try {
        await streamReply({
          agent,
          history: [...session.messages, user],
          runtime,
          signal: controller.signal,
          onText: (chunk) => {
            acc += chunk;
            store.setMessageContent(session.id, reply.id, acc);
          },
        });
        if (!acc) store.setMessageContent(session.id, reply.id, "_No reply came back._");
        setAnnounce(acc ? `${agent.name} replied: ${acc}` : `${agent.name} sent no reply.`);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setAnnounce("Stopped.");
          if (!acc) store.setMessageContent(session.id, reply.id, "_Stopped._");
        } else {
          const msg = (err as Error).message;
          store.setMessageContent(session.id, reply.id, `**Couldn't reach ${agent.name}.** ${msg}`);
          setAnnounce(`Error: ${msg}`);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [activeSession, agent, runtime, store, streaming]
  );

  const ownItems = useMemo(() => OWN.map(toItem), []);
  const guestItems = useMemo(() => GUESTS.map(toItem), []);

  return (
    <TinaiScope tinai={tinai} as="div" className="yazhi-chat relative flex h-dvh flex-col overflow-hidden">
      <a href="#yazhi-composer" className="sr-only z-50 rounded-full bg-[color:var(--env-surface)] px-4 py-2 focus:not-sr-only focus:absolute focus:left-3 focus:top-3">
        Skip to message box
      </a>

      {/* the landscape, behind everything; purely decorative */}
      <div className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_35%,black_20%,transparent_75%)]">
        <TinaiAmbient key={tinai} tinai={tinai} className="book-fade" />
      </div>

      {/* header: logo, the agent you are with, settings */}
      <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-3 hair-lo sm:px-5" style={{ background: "color-mix(in oklab, var(--env-ground) 78%, transparent)" }}>
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-full p-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--env-hi)]" aria-label="Yazhi home">
            <span style={{ ["--ivory" as string]: "var(--env-text)" }}>
              <LogoMark size={30} />
            </span>
            <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
              <span lang="ta">யாழி</span> <span className="font-normal text-[color:var(--env-text-dim)]">Chat</span>
            </span>
          </Link>
        </div>
        <h1 className="sr-only">Yazhi Chat, with {agent.name}</h1>
        <p className="min-w-0 truncate text-center text-sm" aria-hidden>
          <span lang="ta" className="font-display">{agent.taName}</span>
          <span className="text-[color:var(--env-text-dim)]"> · {agent.name}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className="hidden rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-text-dim)] hair-lo sm:inline"
            title={runtime === "cloud" ? "Replies come from yazhi-api" : "Replies come from a model on this device"}
          >
            {runtime === "cloud" ? "yazhi-api" : "on device"}
            {!online && " · offline"}
          </span>
          <IconButton label="Threads" pressed={panel === "threads"} onClick={() => setPanel((p) => (p === "threads" ? null : "threads"))}>
            <path d="M5 7h14M5 12h14M5 17h9" />
          </IconButton>
          <IconButton label="Settings" pressed={panel === "settings"} onClick={() => setPanel((p) => (p === "settings" ? null : "settings"))}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
          </IconButton>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* agents: a vertical tray of bubbles on wide screens */}
        <nav aria-label="Agents" className="hidden shrink-0 flex-col items-center border-r pt-3 hair-lo md:flex md:w-[84px]">
          <RailLabel>யாழி</RailLabel>
          <MagneticTray items={ownItems} tinai={tinai} activeId={agent.id} onSelect={chooseAgent} size={40} vertical label="Yazhi agents" />
          <RailLabel>Guests</RailLabel>
          <MagneticTray items={guestItems} tinai={tinai} activeId={agent.id} onSelect={chooseAgent} size={40} vertical label="Guest agents" />
          <button
            type="button"
            onClick={newThread}
            className="mt-2 grid h-11 w-11 place-items-center rounded-full border border-dashed text-[color:var(--env-text-dim)] transition-colors hair hover:text-[color:var(--env-text)]"
            aria-label="New thread"
            title="New thread"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </nav>

        <main id="conversation" className="flex min-w-0 flex-1 flex-col" aria-label={`Conversation with ${agent.name}`}>
          {/* agents on phones: the same bubbles in a row */}
          <nav aria-label="Agents" className="-mb-3 shrink-0 md:hidden">
            <div className="flex items-end overflow-x-auto [scrollbar-width:none]" data-lenis-prevent>
              <div className="shrink-0">
                <MagneticTray items={ownItems} tinai={tinai} activeId={agent.id} onSelect={chooseAgent} size={38} label="Yazhi agents" />
              </div>
              <span aria-hidden className="mb-8 h-8 w-px shrink-0 bg-[color:var(--env-edge)] opacity-40" />
              <div className="shrink-0">
                <MagneticTray items={guestItems} tinai={tinai} activeId={agent.id} onSelect={chooseAgent} size={38} label="Guest agents" />
              </div>
            </div>
          </nav>

          <div ref={scroller} className="chat-scroll min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
            {!started ? (
              <Welcome agent={agent} onPick={(q) => composer.current?.fill(q)} />
            ) : (
              <div role="log" aria-label="Messages" aria-busy={streaming}>
                <ol className="mx-auto flex max-w-3xl flex-col gap-7 px-4 pb-8 pt-8 sm:px-6">
                  {messages.map((m, i) => (
                    <ChatMessage key={m.id} agent={agent} message={m} live={streaming && i === messages.length - 1} />
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <ChatComposer
                ref={composer}
                onSend={(t) => void send(t)}
                onStop={stop}
                streaming={streaming}
                placeholder={`Message ${agent.name}`}
                leading={<CircleButton size={40} />}
                hint={
                  <>
                    Enter to send · Shift+Enter for a new line. Replies can be wrong — check what matters.{" "}
                    <span className="whitespace-nowrap">{runtime === "cloud" ? "Runs on yazhi-api." : "Runs on this device."}</span>
                  </>
                }
              />
            </div>
          </div>
        </main>

        {panel && (
          <>
            <button type="button" aria-label="Close panel" tabIndex={-1} onClick={() => setPanel(null)} className="absolute inset-0 z-20 bg-black/40 md:hidden" />
            <aside
              aria-label={panel === "threads" ? "Threads" : "Settings"}
              className="absolute inset-y-0 right-0 z-30 flex w-[min(22rem,100%)] flex-col border-l bg-[color:var(--env-surface)] hair-lo"
            >
              {panel === "threads" ? (
                <ThreadsPanel
                  sessions={sessions}
                  activeId={activeId}
                  onOpen={openThread}
                  onDelete={store.deleteSession}
                  onNew={newThread}
                  onClose={() => setPanel(null)}
                />
              ) : (
                <SettingsPanel
                  theme={theme}
                  agentTinai={agent.tinai}
                  onTheme={(t) => {
                    setTheme(t);
                    save(THEME_KEY, t);
                  }}
                  runtime={runtimeChoice}
                  onRuntime={(r) => {
                    setRuntimeChoice(r);
                    save(RUNTIME_KEY, r);
                  }}
                  endpoint={endpoint}
                  onEndpoint={setEndpoint}
                  onEndpointCommit={() => setDeviceEndpoint(endpoint)}
                  onClose={() => setPanel(null)}
                />
              )}
            </aside>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
    </TinaiScope>
  );
}

/* ------------------------------------------------------------------ */

function IconButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
        pressed ? "bg-[color:var(--env-surface)] [border-color:var(--env-hi)]" : "hair-lo hover:bg-[color:var(--env-surface)]"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

function Welcome({ agent, onPick }: { agent: Agent; onPick: (q: string) => void }) {
  const emblem = EMBLEM[agent.id];
  return (
    <section aria-labelledby="welcome-title" className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-6 pt-6 text-center sm:pt-10">
      {emblem && (
        <div className="w-full max-w-[19rem]">
          <HairlineFigure key={agent.id} figure={emblem} play caption={false} className="w-full" />
        </div>
      )}
      <h2 id="welcome-title" className="mt-1">
        <span lang="ta" className="block font-display text-3xl font-semibold sm:text-4xl" style={{ lineHeight: "var(--leading-tamil-display)" }}>
          {agent.taName}
        </span>
        <span className="mt-1 block text-sm text-[color:var(--env-text-dim)]">{agent.name}</span>
      </h2>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-[color:var(--env-text-dim)]">{agent.description}</p>
      <Persona agent={agent} />
      <ul className="mt-7 flex w-full max-w-xl flex-col gap-2" aria-label="Ways to start">
        {agent.starters.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onPick(q)}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors duration-300 hair-lo hover:bg-[color:var(--env-surface)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--env-hi)]"
            >
              <span>{q}</span>
              <span aria-hidden className="text-[color:var(--env-text-dim)] transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
      {agent.sample && <Sample agent={agent} />}
    </section>
  );
}

function RailLabel({ children }: { children: ReactNode }) {
  return (
    <p aria-hidden className="mb-1 mt-2 w-full border-t pt-2 text-center font-mono text-[9px] uppercase tracking-wider text-[color:var(--env-text-dim)] first:mt-0 first:border-t-0 first:pt-0 hair-lo">
      {children}
    </p>
  );
}

/** Who the agent is: where it lives, its launch status, and the one rule it keeps. */
function Persona({ agent }: { agent: Agent }) {
  const provider = PROVIDER_META[agent.provider];
  const chips =
    agent.group === "yazhi"
      ? [agent.home && `Lives in ${agent.home}`, `${provider.label} · yazhi-api`, agent.status && `Preview · ${agent.status}`]
      : [`Guest · ${provider.label}`, "Runs on an outside model"];
  return (
    <div className="mt-5 flex w-full max-w-xl flex-col items-center gap-3">
      <ul className="flex flex-wrap justify-center gap-1.5" aria-label="About this agent">
        {chips.filter(Boolean).map((c) => (
          <li key={c as string} className="rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide text-[color:var(--env-text-dim)] hair-lo">
            {c}
          </li>
        ))}
      </ul>
      {agent.persona && <p className="max-w-lg text-sm leading-relaxed">{agent.persona}</p>}
      {agent.rule && (
        <p className="flex items-center gap-2 text-xs text-[color:var(--env-text-dim)]">
          <span aria-hidden className="h-px w-5 bg-[color:var(--env-edge)]" />
          <span>
            <span className="font-mono uppercase tracking-wider text-[color:var(--env-hi)]">Rule</span> {agent.rule}
          </span>
          <span aria-hidden className="h-px w-5 bg-[color:var(--env-edge)]" />
        </p>
      )}
    </div>
  );
}

/** One illustrative exchange, folded away until asked for. */
function Sample({ agent }: { agent: Agent }) {
  if (!agent.sample) return null;
  return (
    <details
      className="group mt-6 w-full max-w-xl rounded-2xl border text-left hair-lo"
      onToggle={(e) => {
        const d = e.currentTarget;
        if (d.open) requestAnimationFrame(() => d.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
        <span>See how {agent.name} answers</span>
        <span aria-hidden className="text-[color:var(--env-text-dim)] transition-transform duration-300 group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="space-y-4 border-t px-4 pb-4 pt-4 hair-lo">
        <p className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-[1.2rem] rounded-br-md border bg-[color:var(--env-surface)] px-3.5 py-2 text-sm hair-lo">
          <span className="sr-only">Sample question: </span>
          {agent.sample.q}
        </p>
        <div className="flex gap-3">
          <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] hair-lo" style={{ color: "var(--env-hi)" }}>
            {glyphOf(agent)}
          </span>
          <div className="min-w-0 text-sm">
            <span className="sr-only">Sample answer: </span>
            <Markdown>{agent.sample.a}</Markdown>
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-text-dim)]">
          Sample · illustrative, not a live answer{agent.group === "yazhi" ? " · Tamil is a draft for native review" : ""}
        </p>
      </div>
    </details>
  );
}

function ChatMessage({ agent, message, live }: { agent: Agent; message: Message; live: boolean }) {
  const [copied, setCopied] = useState(false);
  if (message.role === "user") {
    return (
      <li className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-[1.4rem] rounded-br-md border bg-[color:var(--env-surface)] px-4 py-2.5 text-[0.95rem] leading-relaxed hair-lo">
          <span className="sr-only">You: </span>
          {message.content}
        </div>
      </li>
    );
  }
  return (
    <li className="group flex gap-3">
      <span
        aria-hidden
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-semibold"
        style={{ borderColor: "color-mix(in oklab, var(--env-edge) 70%, transparent)", color: "var(--env-hi)" }}
      >
        {glyphOf(agent)}
      </span>
      <div className="min-w-0 flex-1">
        <span className="sr-only">{agent.name}: </span>
        {message.content ? (
          <Markdown>{message.content}</Markdown>
        ) : (
          <YazhStrings className="mt-1" label={`${agent.name} is thinking`} />
        )}
        {message.content && !live && (
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[color:var(--env-text-dim)] opacity-80 transition-opacity group-hover:opacity-100">
            {message.via && <span className="font-mono uppercase tracking-wider">{message.via === "cloud" ? "yazhi-api" : "on device"}</span>}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(message.content).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }, () => {});
              }}
              className="rounded px-1 underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-text)]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  return (
    <div className="flex items-center justify-between border-b px-4 py-3 hair-lo">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} className="grid h-9 w-9 place-items-center rounded-full border hair-lo hover:bg-[color:var(--env-ground)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

function ThreadsPanel({
  sessions,
  activeId,
  onOpen,
  onDelete,
  onNew,
  onClose,
}: {
  sessions: { id: string; title: string; agentId: string; updatedAt: number }[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <PanelHeader title="Threads" onClose={onClose} />
      <div className="p-3">
        <button type="button" onClick={onNew} className="w-full rounded-full border px-4 py-2.5 text-sm transition-colors hair hover:bg-[color:var(--env-ground)]">
          New thread
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[color:var(--env-text-dim)]">No threads yet. They stay on this device.</p>
      ) : (
        <ul className="chat-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-4" data-lenis-prevent>
          {sessions.map((s) => {
            const a = getAgent(s.agentId);
            const current = s.id === activeId;
            return (
              <li key={s.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpen(s.id)}
                  aria-current={current ? "true" : undefined}
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors hover:bg-[color:var(--env-ground)] ${current ? "bg-[color:var(--env-ground)]" : ""}`}
                >
                  <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] hair-lo" style={{ color: a ? ENV_BY_KEY[a.tinai].palette.hi : undefined }}>
                    {a ? glyphOf(a) : "•"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{s.title}</span>
                    <span className="block truncate text-[11px] text-[color:var(--env-text-dim)]">{a?.name ?? "Agent"}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  aria-label={`Delete thread: ${s.title}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[color:var(--env-text-dim)] opacity-60 hover:bg-[color:var(--env-ground)] hover:text-[color:var(--env-text)] focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
                    <path d="M5 7h14M10 11v6M14 11v6M7 7l1 12h8l1-12M9 7V5h6v2" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function SettingsPanel({
  theme,
  agentTinai,
  onTheme,
  runtime,
  onRuntime,
  endpoint,
  onEndpoint,
  onEndpointCommit,
  onClose,
}: {
  theme: ThemeChoice;
  agentTinai: ThinaiKey;
  onTheme: (t: ThemeChoice) => void;
  runtime: RuntimeChoice;
  onRuntime: (r: RuntimeChoice) => void;
  endpoint: string;
  onEndpoint: (v: string) => void;
  onEndpointCommit: () => void;
  onClose: () => void;
}) {
  const themes: { key: ThemeChoice; ta: string; en: string; swatch: string; note: string }[] = [
    { key: "auto", ta: "தானாக", en: "Follow the agent", swatch: ENV_BY_KEY[agentTinai].palette.accent, note: `Now ${ENV_BY_KEY[agentTinai].en}` },
    ...ENVIRONMENTS.map((e) => ({ key: e.key as ThemeChoice, ta: e.ta, en: e.en, swatch: e.palette.accent, note: e.signature })),
  ];
  return (
    <>
      <PanelHeader title="Settings" onClose={onClose} />
      <div className="chat-scroll min-h-0 flex-1 space-y-7 overflow-y-auto px-4 py-5" data-lenis-prevent>
        <fieldset>
          <legend className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Landscape</legend>
          <div className="mt-3 grid gap-1.5">
            {themes.map((t) => (
              <label
                key={t.key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:[border-color:var(--env-hi)] ${
                  theme === t.key ? "bg-[color:var(--env-ground)] [border-color:var(--env-edge)]" : "border-transparent hover:bg-[color:var(--env-ground)]"
                }`}
              >
                <input type="radio" name="yazhi-chat-theme" className="sr-only" checked={theme === t.key} onChange={() => onTheme(t.key)} />
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.swatch }} />
                <span className="min-w-0 flex-1">
                  <span lang="ta">{t.ta}</span> <span className="text-[color:var(--env-text-dim)]">· {t.en}</span>
                  <span className="block text-[11px] text-[color:var(--env-text-dim)]">{t.note}</span>
                </span>
                {theme === t.key && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Where replies come from</legend>
          <div className="mt-3 grid gap-1.5">
            {(
              [
                ["auto", "Automatic", "yazhi-api when online, this device when not"],
                ["cloud", "yazhi-api", "Yazhi's servers, through yazhi.dev"],
                ["device", "On this device", "A local model; nothing leaves your machine"],
              ] as [RuntimeChoice, string, string][]
            ).map(([key, title, note]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:[border-color:var(--env-hi)] ${
                  runtime === key ? "bg-[color:var(--env-ground)] [border-color:var(--env-edge)]" : "border-transparent hover:bg-[color:var(--env-ground)]"
                }`}
              >
                <input type="radio" name="yazhi-chat-runtime" className="sr-only" checked={runtime === key} onChange={() => onRuntime(key)} />
                <span className="min-w-0 flex-1">
                  {title}
                  <span className="block text-[11px] text-[color:var(--env-text-dim)]">{note}</span>
                </span>
                {runtime === key && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </label>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="block text-[11px] text-[color:var(--env-text-dim)]">On-device endpoint (OpenAI-compatible)</span>
            <input
              value={endpoint}
              onChange={(e) => onEndpoint(e.target.value)}
              onBlur={onEndpointCommit}
              spellCheck={false}
              inputMode="url"
              className="mt-1.5 w-full rounded-xl border bg-[color:var(--env-ground)] px-3 py-2 font-mono text-xs hair-lo focus:outline-none focus:[border-color:var(--env-hi)]"
            />
          </label>
        </fieldset>

        <p className="text-[11px] leading-relaxed text-[color:var(--env-text-dim)]">
          Threads and these choices are kept in this browser only. The landscapes and their motion are described in the{" "}
          <Link href="/bubble/design" className="underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-text)]">
            Bubble UI design book
          </Link>
          .
        </p>
      </div>
    </>
  );
}
