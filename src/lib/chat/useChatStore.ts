"use client";
import { useCallback, useEffect, useState } from "react";
import type { Agent, Message, Session } from "./types";

const STORAGE_KEY = "yazhi-chat";

interface Persisted {
  sessions: Session[];
  activeId: string | null;
}

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function titleFor(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean || "New chat";
}

export function useChatStore() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // hydrate from localStorage once — deferred a tick so React's hydration
  // render never differs from the server HTML
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Persisted;
          if (Array.isArray(parsed.sessions)) {
            setSessions(
              parsed.sessions
                .filter((s) => s && s.id)
                .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
            );
          }
          if (parsed.activeId) setActiveId(parsed.activeId);
        }
      } catch {
        // corrupt storage — start clean
      }
      setLoaded(true);
    });
  }, []);

  // persist on every change
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessions, activeId } satisfies Persisted)
      );
    } catch {
      // storage full / private mode — non-fatal
    }
  }, [sessions, activeId, loaded]);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  const createSession = useCallback(
    (agent: Agent): Session => {
      const now = Date.now();
      const session: Session = {
        id: uid("s"),
        title: "New chat",
        agentId: agent.id,
        messages: [
          { id: uid("m"), role: "assistant", content: agent.greeting, createdAt: now },
        ],
        createdAt: now,
        updatedAt: now,
      };
      setSessions((prev) => [session, ...prev]);
      setActiveId(session.id);
      return session;
    },
    []
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeId === id) setActiveId(next[0]?.id ?? null);
        return next;
      });
    },
    [activeId]
  );

  const renameSession = useCallback(
    (id: string, title: string) => {
      const t = title.trim();
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: t || s.title } : s))
      );
    },
    []
  );

  const selectSession = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const reset = useCallback(() => {
    setActiveId(null);
  }, []);

  const addMessage = useCallback(
    (sessionId: string, message: Message) => {
      const now = Date.now();
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const isFirstUser = s.messages.filter((m) => m.role === "user").length === 0;
          return {
            ...s,
            messages: [...s.messages, message],
            title: isFirstUser && message.role === "user" ? titleFor(message.content) : s.title,
            updatedAt: now,
          };
        })
      );
    },
    []
  );

  const setMessageContent = useCallback(
    (sessionId: string, messageId: string, content: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
                updatedAt: Date.now(),
              }
            : s
        )
      );
    },
    []
  );

  return {
    sessions,
    activeId,
    activeSession,
    loaded,
    createSession,
    deleteSession,
    renameSession,
    selectSession,
    addMessage,
    setMessageContent,
    reset,
  };
}
