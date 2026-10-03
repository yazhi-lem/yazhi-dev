"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloudSky, Pill, T, toneStyle, type Tone } from "@/bubble";
import { useLang } from "@/lib/i18n";
import { AGENTS, getAgent } from "@/lib/chat/agents";
import type { Agent, BiString, ChatResponse, ChatStatus, Message } from "@/lib/chat/types";
import { uid, useChatStore } from "@/lib/chat/useChatStore";
import { AgentMark } from "./AgentMark";
import { BubbleMenu } from "./BubbleMenu";
import { Composer, type ComposerHandle } from "./Composer";
import { ConversationList } from "./ConversationList";
import { MessageLog } from "./MessageLog";
import { Sheet } from "./Sheet";
import { Welcome } from "./Welcome";
import { S, useBi } from "./strings";

const STATUS_COPY: Record<Exclude<ChatStatus["state"], "ready">, { title: BiString; tone: Tone }> = {
  unconfigured: { title: { ta: "இன்னும் இணைக்கப்படவில்லை", en: "Not connected yet" }, tone: "neutral" },
  not_sovereign: { title: { ta: "தற்சார்பு உறுதியாகும் வரை நிறுத்தம்", en: "Paused until inference is sovereign" }, tone: "error" },
  unavailable: { title: { ta: "yazhi-api பதில் தரவில்லை", en: "yazhi-api isn't answering" }, tone: "warn" },
};

/** Strip markdown punctuation for a screen-reader announcement. */
function speakable(md: string, max = 280): string {
  const s = md
    .replace(/```[\s\S]*?```/g, " (code) ")
    .replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, " ") // table divider rows
    .replace(/[#*_`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

/** /chat — a Bubble UI conversation app over Yazhi's own agents.

    Accessibility contract: landmarks (header, nav, main), a skip link to
    the message box, every control ≥ 44px or padded to it, nothing shown
    by colour alone, one polite status region that announces each reply
    once, native <dialog> sheets, an ARIA menu button for the floating
    Yazhi menu, IME-safe Enter, and all motion off under reduced motion. */
export function ChatApp() {
  const store = useChatStore();
  const { lang } = useLang();
  const t = useBi();
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const [pending, setPending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [fabBottom, setFabBottom] = useState(24);
  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const composerWrapRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLHeadingElement>(null);

  const { activeSession, sessions, activeId } = store;
  const agent = activeSession ? getAgent(activeSession.agentId) ?? null : null;
  const ready = status?.state === "ready";

  const announce = useCallback((text: string) => {
    // clear first so an identical message is announced again
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(text), 30);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/status", { cache: "no-store" });
      setStatus((await res.json()) as ChatStatus);
    } catch {
      setStatus({ state: "unavailable", detail: "This site could not reach its own chat service." });
    }
  }, []);

  useEffect(() => {
    queueMicrotask(refreshStatus);
  }, [refreshStatus]);

  // keep the floating menu just above the composer, whatever its height
  useEffect(() => {
    const el = composerWrapRef.current;
    if (!el) {
      queueMicrotask(() => setFabBottom(24));
      return;
    }
    const ro = new ResizeObserver(() => setFabBottom(el.offsetHeight + 16));
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeSession?.id]);

  const ask = useCallback(
    async (sessionId: string, forAgent: Agent, history: Pick<Message, "role" | "content">[]) => {
      const pendingId = uid("m");
      store.addMessage(sessionId, { id: pendingId, role: "assistant", content: "", createdAt: Date.now(), status: "pending" });
      setPending(true);
      announce(`${t(forAgent.name)} ${t(S.thinking)}`);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId: forAgent.id, messages: history, lang }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as ChatResponse | null;
        if (!data) throw new Error(`The chat service answered ${res.status} without a body.`);
        if ("error" in data) {
          if (data.error.code === "not_sovereign" || data.error.code === "unconfigured") void refreshStatus();
          throw new Error(data.error.message);
        }
        store.updateMessage(sessionId, pendingId, { content: data.reply, status: "done", createdAt: Date.now() });
        announce(`${t(forAgent.name)}: ${speakable(data.reply)}`);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          store.removeMessage(sessionId, pendingId);
          announce(t(S.stopped));
        } else {
          const message = (err as Error).message || "Something went wrong.";
          store.updateMessage(sessionId, pendingId, { content: message, status: "error", createdAt: Date.now() });
          announce(message);
        }
      } finally {
        setPending(false);
        abortRef.current = null;
      }
    },
    [store, announce, t, lang, refreshStatus],
  );

  const historyOf = (messages: Message[]) =>
    messages.filter((m) => (m.status ?? "done") === "done" && m.content.trim()).map(({ role, content }) => ({ role, content }));

  const handleSend = useCallback(
    (text: string) => {
      if (!activeSession || !agent || pending || !ready) return;
      const user: Message = { id: uid("m"), role: "user", content: text, createdAt: Date.now(), status: "done" };
      store.addMessage(activeSession.id, user);
      void ask(activeSession.id, agent, [...historyOf(activeSession.messages), user]);
    },
    [activeSession, agent, pending, ready, store, ask],
  );

  const start = useCallback(
    (a: Agent, prompt?: string) => {
      abortRef.current?.abort();
      const session = store.createSession(a);
      setDrawerOpen(false);
      if (prompt && ready) {
        const user: Message = { id: uid("m"), role: "user", content: prompt, createdAt: Date.now(), status: "done" };
        store.addMessage(session.id, user);
        void ask(session.id, a, [user]);
      } else {
        // not sendable yet (or no prompt): keep the prompt in the box, don't lose it
        window.setTimeout(() => (prompt ? composerRef.current?.fill(prompt) : composerRef.current?.focus()), 50);
      }
    },
    [store, ready, ask],
  );

  const retry = useCallback(
    (messageId: string) => {
      if (!activeSession || !agent || pending || !ready) return;
      const idx = activeSession.messages.findIndex((m) => m.id === messageId);
      store.removeMessage(activeSession.id, messageId);
      void ask(activeSession.id, agent, historyOf(activeSession.messages.slice(0, idx)));
    },
    [activeSession, agent, pending, ready, store, ask],
  );

  const select = useCallback(
    (id: string) => {
      abortRef.current?.abort();
      store.selectSession(id);
      setDrawerOpen(false);
      window.setTimeout(() => composerRef.current?.focus(), 50);
    },
    [store],
  );

  const goWelcome = useCallback(() => {
    abortRef.current?.abort();
    store.selectSession(null);
    setDrawerOpen(false);
    window.setTimeout(() => welcomeRef.current?.focus(), 50);
  }, [store]);

  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard?.writeText(text).then(
        () => announce(t(S.copied)),
        () => {},
      );
    },
    [announce, t],
  );

  const statusPill = !status ? (
    <Pill label={t(S.checking)} tone="neutral" />
  ) : status.state === "ready" ? (
    <Pill label={t(S.sovereign)} tone="ok" pulse />
  ) : (
    <Pill label={status.state === "unconfigured" ? t(S.notConnected) : t(S.paused)} tone={STATUS_COPY[status.state].tone} />
  );

  const conversationList = (
    <ConversationList sessions={sessions} activeId={activeId} onSelect={select} onDelete={store.deleteSession} onNew={goWelcome} />
  );

  return (
    <div data-ybi-root="" data-ybi-theme="mugil" className="fixed inset-0 flex flex-col overflow-hidden">
      <CloudSky />
      <a
        href={activeSession ? "#composer-input" : "#chat-main"}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        {t(S.skipToComposer)}
      </a>

      <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b border-ivory/10 bg-night/60 px-4 backdrop-blur sm:px-6">
        <h1 className="whitespace-nowrap font-display text-base text-ivory sm:text-lg">
          <T text={S.app} />
        </h1>
        {agent && (
          <span className="flex min-w-0 items-center gap-2 border-l border-ivory/15 pl-3 text-sm text-ivory-dim">
            <AgentMark tone={agent.tone} size={26} />
            <span className="hidden truncate sm:inline">
              <T text={agent.name} />
            </span>
          </span>
        )}
        <div className="ml-auto" role="status" aria-label={t({ ta: "இணைப்பு நிலை", en: "Connection status" })}>
          {statusPill}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {sidebarOpen && (
          <aside className="hidden w-80 shrink-0 border-r border-ivory/10 bg-night/40 p-4 backdrop-blur md:flex md:flex-col">
            {conversationList}
          </aside>
        )}

        <main id="chat-main" tabIndex={-1} className="flex min-w-0 flex-1 flex-col focus:outline-none">
          {activeSession && agent ? (
            <MessageLog
              agent={agent}
              messages={activeSession.messages}
              onCopy={copy}
              onRetry={retry}
              onPrompt={(p) => (ready ? handleSend(p) : composerRef.current?.fill(p))}
            />
          ) : (
            <Welcome ref={welcomeRef} onStart={start} />
          )}

          {status && status.state !== "ready" && (
            <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-2 sm:px-6">
              <div id="chat-status-reason" className="ybi-bubble rounded-3xl px-4 py-3 text-sm" style={toneStyle(STATUS_COPY[status.state].tone)}>
                <p className="font-semibold text-ivory">
                  <T text={STATUS_COPY[status.state].title} />
                </p>
                <p className="mt-0.5 text-ivory-dim">{status.detail}</p>
                {status.state === "not_sovereign" && (
                  <p className="mt-1 text-ivory-dim">
                    <T
                      text={{
                        ta: "yazhi-api வெளி அழைப்புகளைப் புகாரளிக்கும் வரை எந்தச் செய்தியும் அனுப்பப்படாது.",
                        en: "No message is sent while yazhi-api reports outbound calls.",
                      }}
                    />
                  </p>
                )}
              </div>
            </div>
          )}

          {activeSession && agent && (
            <div ref={composerWrapRef}>
              <Composer
                ref={composerRef}
                agentName={t(agent.name)}
                tone={agent.tone}
                pending={pending}
                disabled={!ready}
                disabledReasonId={status && status.state !== "ready" ? "chat-status-reason" : undefined}
                onSend={handleSend}
                onStop={() => abortRef.current?.abort()}
              />
            </div>
          )}
        </main>
      </div>

      <BubbleMenu
        bottom={activeSession ? fabBottom : 24}
        conversationsLabel={t(S.conversations)}
        onNew={goWelcome}
        onConversations={() => {
          if (isDesktop()) setSidebarOpen((v) => !v);
          else setDrawerOpen(true);
        }}
        onAbout={() => setAboutOpen(true)}
      />

      <Sheet open={drawerOpen} onClose={() => setDrawerOpen(false)} title={S.conversations} side="left">
        {conversationList}
      </Sheet>

      <Sheet open={aboutOpen} onClose={() => setAboutOpen(false)} title={S.about}>
        <div className="chat-scroll max-h-[60dvh] space-y-4 overflow-y-auto pr-1 text-sm text-ivory-dim" data-lenis-prevent>
          <p>
            <T
              text={{
                ta: "யாழி முகவர்கள் yazhi-api வழியாக, யாழியின் சொந்த மாதிரிகளில் பதில் தருகின்றனர்.",
                en: "Answers come from Yazhi's own agents, served by yazhi-api on Yazhi's own models.",
              }}
              separator=" "
            />
          </p>
          <ul className="space-y-2">
            {AGENTS.map((a) => (
              <li key={a.id} className="flex gap-3">
                <AgentMark tone={a.tone} size={28} />
                <span>
                  <span className="font-semibold text-ivory">
                    <T text={a.name} />
                  </span>{" "}
                  — <T text={a.rule} />
                </span>
              </li>
            ))}
          </ul>
          <p>
            <T
              text={{
                ta: "தற்சார்பு: yazhi-api வெளி அழைப்பு 0, உள்ளூர் கணிப்பு, தரவு சொந்தச் சேவையகத்தில் — இவை மூன்றும் உறுதியானால் மட்டுமே செய்தி அனுப்பப்படும்.",
                en: "Sovereignty: a message is sent only when yazhi-api reports zero outbound calls, local inference and on-prem data.",
              }}
              separator=" "
            />
          </p>
          <p>
            <T text={S.keptHere} separator=" " />
          </p>
          <p className="text-xs">
            <T text={S.tamilDraft} separator=" " />
          </p>
        </div>
      </Sheet>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
