"use client";
import { useEffect, useId, useRef, useState } from "react";
import { T, toneStyle } from "@/bubble";
import { getAgent } from "@/lib/chat/agents";
import type { Session } from "@/lib/chat/types";
import { AgentMark } from "./AgentMark";
import { S, useBi } from "./strings";

function relative(ts: number, lang: "ta" | "en"): string {
  const min = Math.floor((Date.now() - ts) / 60_000);
  const rtf = new Intl.RelativeTimeFormat(lang === "ta" ? "ta" : "en", { numeric: "auto", style: "short" });
  if (min < 60) return rtf.format(-Math.max(min, 0), "minute");
  const hr = Math.floor(min / 60);
  if (hr < 24) return rtf.format(-hr, "hour");
  const day = Math.floor(hr / 24);
  if (day < 7) return rtf.format(-day, "day");
  return new Date(ts).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short" });
}

/** Conversation history: a search field and a list of real buttons. Each
    row is one select button plus a separate delete button (never nested
    interactive controls); delete asks first and moves focus to "Keep". */
export function ConversationList({
  sessions,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: {
  sessions: Session[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  const t = useBi();
  const lang = t({ ta: "ta", en: "en" }) as "ta" | "en";
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const keepRef = useRef<HTMLButtonElement>(null);
  const searchId = useId();

  useEffect(() => {
    if (confirming) keepRef.current?.focus();
  }, [confirming]);

  const q = query.trim().toLowerCase();
  const shown = q ? sessions.filter((s) => s.title.toLowerCase().includes(q)) : sessions;

  return (
    <nav aria-label={t(S.conversations)} className="flex h-full min-h-0 flex-col gap-3">
      <button
        type="button"
        onClick={onNew}
        className="ybi-solid flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold"
        style={toneStyle("gold")}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
        <T text={S.newChat} />
      </button>

      <div>
        <label htmlFor={searchId} className="sr-only">
          {t(S.searchConversations)}
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(S.searchConversations)}
          className="ybi-field w-full rounded-full px-4 py-2 text-sm"
        />
      </div>

      <h2 className="px-1 text-xs text-ivory-dim">
        <T text={S.conversations} /> · {sessions.length}
      </h2>

      <ul className="chat-scroll -mr-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1" data-lenis-prevent>
        {shown.length === 0 && (
          <li className="px-1 py-6 text-center text-sm text-ivory-dim">
            <T text={sessions.length === 0 ? S.noConversations : S.noMatches} />
          </li>
        )}
        {shown.map((s) => {
          const agent = getAgent(s.agentId);
          const active = s.id === activeId;
          if (confirming === s.id) {
            return (
              <li key={s.id} className="ybi-soft flex flex-col gap-2 rounded-2xl p-3" style={toneStyle("palai")}>
                <p className="text-sm text-ivory">
                  <T text={S.confirmDelete} />
                  <span className="mt-0.5 block truncate text-xs text-ivory-dim">{s.title}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirming(null);
                      onDelete(s.id);
                    }}
                    className="ybi-solid min-h-9 flex-1 rounded-full px-3 text-sm font-semibold"
                    style={toneStyle("palai")}
                  >
                    <T text={S.delete} />
                  </button>
                  <button ref={keepRef} type="button" onClick={() => setConfirming(null)} className="min-h-9 flex-1 rounded-full border border-ivory/20 px-3 text-sm text-ivory">
                    <T text={S.keep} />
                  </button>
                </div>
              </li>
            );
          }
          return (
            <li key={s.id} className="group relative flex items-center">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={active ? "true" : undefined}
                className={`flex min-h-12 w-full items-center gap-2.5 rounded-2xl py-2 pl-2 pr-10 text-left transition-colors ${
                  active ? "ybi-soft" : "hover:bg-ivory/5"
                }`}
                style={agent ? toneStyle(agent.tone) : undefined}
              >
                {agent && <AgentMark tone={agent.tone} size={28} />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ivory">{s.title}</span>
                  <span className="block text-xs text-ivory-dim">
                    {agent ? `${t(agent.name)} · ${relative(s.updatedAt, lang)}` : relative(s.updatedAt, lang)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`${t(S.delete)}: ${s.title}`}
                onClick={() => setConfirming(s.id)}
                className="absolute right-1.5 grid h-8 w-8 place-items-center rounded-full text-ivory-dim opacity-70 transition hover:bg-ivory/10 hover:text-ivory focus-visible:opacity-100 group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
