"use client";
import { useCallback, useEffect, useState } from "react";
import { getAgent } from "./agents";
import type { Agent, Message, Session } from "./types";

/** Conversations live only in this browser (localStorage) — nothing is
    stored server-side. v2: sessions from the retired provider-bound
    agents (key "yazhi-chat") are left untouched in storage, not migrated. */
const STORAGE_KEY = "yazhi-chat-v2";

interface Persisted {
  sessions: Session[];
  activeId: string | null;
}

let counter = 0;
export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function titleFor(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || "New conversation";
}

export function useChatStore() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // hydrate once, a tick after mount, so the first client render matches the server HTML
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Persisted;
          if (Array.isArray(parsed.sessions)) {
            setSessions(
              parsed.sessions
                .filter((s) => s && s.id && getAgent(s.agentId))
                // a reload mid-request leaves a pending bubble with no request behind it
                .map((s) => ({
                  ...s,
                  messages: s.messages.filter((m) => m.status !== "pending"),
                }))
                .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)),
            );
          }
          if (parsed.activeId) setActiveId(parsed.activeId);
        }
      } catch {
        // corrupt or blocked storage — start clean
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, activeId } satisfies Persisted));
    } catch {
      // storage full / private mode — non-fatal
    }
  }, [sessions, activeId, loaded]);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  const createSession = useCallback((agent: Agent): Session => {
    const now = Date.now();
    const session: Session = {
      id: uid("s"),
      title: "New conversation",
      agentId: agent.id,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
    return session;
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeId === id) setActiveId(null);
        return next;
      });
    },
    [activeId],
  );

  const selectSession = useCallback((id: string | null) => setActiveId(id), []);

  const addMessage = useCallback((sessionId: string, message: Message) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const firstUser = message.role === "user" && !s.messages.some((m) => m.role === "user");
        return {
          ...s,
          messages: [...s.messages, message],
          title: firstUser ? titleFor(message.content) : s.title,
          updatedAt: Date.now(),
        };
      }),
    );
  }, []);

  const updateMessage = useCallback((sessionId: string, messageId: string, patch: Partial<Message>) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)), updatedAt: Date.now() }
          : s,
      ),
    );
  }, []);

  const removeMessage = useCallback((sessionId: string, messageId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, messages: s.messages.filter((m) => m.id !== messageId) } : s)),
    );
  }, []);

  return {
    sessions,
    activeId,
    activeSession,
    loaded,
    createSession,
    deleteSession,
    selectSession,
    addMessage,
    updateMessage,
    removeMessage,
  };
}
