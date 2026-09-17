"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getAgent } from "@/lib/chat/agents";
import type { Agent } from "@/lib/chat/types";
import { useChatStore } from "@/lib/chat/useChatStore";
import { LogoMark } from "@/components/ui/LogoMark";
import { Sidebar } from "./Sidebar";
import { AgentPicker } from "./AgentPicker";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function ChatApp() {
  const store = useChatStore();
  const [streaming, setStreaming] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { activeSession, sessions, activeId } = store;
  const agent: Agent | null = activeSession ? getAgent(activeSession.agentId) ?? null : null;

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      stop();
      store.selectSession(id);
      setDrawerOpen(false);
    },
    [stop, store]
  );

  const handleNew = useCallback(() => {
    stop();
    store.reset();
    setDrawerOpen(false);
  }, [stop, store]);

  const handlePickAgent = useCallback(
    (a: Agent) => {
      store.createSession(a);
    },
    [store]
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeSession || streaming) return;
      const agentFor = getAgent(activeSession.agentId);
      if (!agentFor) return;

      const now = Date.now();
      const userMsg = { id: uid("m"), role: "user" as const, content: text, createdAt: now };
      const assistantMsg = { id: uid("m"), role: "assistant" as const, content: "", createdAt: now + 1 };
      store.addMessage(activeSession.id, userMsg);
      store.addMessage(activeSession.id, assistantMsg);

      const history = [...activeSession.messages, userMsg].filter(
        (m) => m.role === "user" || m.content.trim().length > 0
      );

      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming(true);
      let acc = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId: agentFor.id, messages: history }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          throw new Error(detail || `Request failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            if (!line.trim()) continue;
            let chunk: { text?: string; error?: string; done?: boolean };
            try {
              chunk = JSON.parse(line);
            } catch {
              continue;
            }
            if (chunk.error) throw new Error(chunk.error);
            if (chunk.text) {
              acc += chunk.text;
              store.setMessageContent(activeSession.id, assistantMsg.id, acc);
            }
          }
        }
        if (!acc) store.setMessageContent(activeSession.id, assistantMsg.id, "_no response_");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          store.setMessageContent(
            activeSession.id,
            assistantMsg.id,
            `⚠️ ${(err as Error).message}`
          );
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [activeSession, streaming, store]
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-night">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-ivory/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ivory/15 md:hidden"
            aria-label="Toggle sessions"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Yazhi home">
            <LogoMark size={26} />
            <span className="display font-display text-base font-semibold text-ivory">
              யாழி
              <span className="ml-1 font-normal text-ivory-dim">Chat</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {agent && (
            <span
              className="hidden items-center gap-1.5 rounded-full border border-ivory/15 bg-night-2 px-3 py-1 text-xs text-ivory-dim sm:flex"
              title={`${agent.name} — ${agent.model}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: agent.accent }} />
              {agent.name}
            </span>
          )}
          <button
            type="button"
            onClick={handleNew}
            className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold hover:text-night"
          >
            New chat
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-ivory/10 bg-night/40 md:block">
          <div className="flex h-full flex-col p-3">
            <Sidebar
              sessions={sessions}
              activeId={activeId}
              onSelect={handleSelect}
              onDelete={store.deleteSession}
              onNew={handleNew}
            />
          </div>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {activeSession ? (
            <>
              <div className="chat-scroll flex-1 overflow-y-auto" data-lenis-prevent>
                <MessageList
                  agent={agent!}
                  messages={activeSession.messages}
                  streaming={streaming}
                />
              </div>
              <Composer
                onSend={handleSend}
                onStop={stop}
                streaming={streaming}
                placeholder={agent ? `Message ${agent.name}…` : "Pick an agent to start"}
              />
            </>
          ) : (
            <div className="chat-scroll flex flex-1 overflow-y-auto" data-lenis-prevent>
              <AgentPicker onSelect={handlePickAgent} />
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sessions"
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-ivory/10 bg-night-2 p-3 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Sidebar
                sessions={sessions}
                activeId={activeId}
                onSelect={handleSelect}
                onDelete={store.deleteSession}
                onNew={handleNew}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
