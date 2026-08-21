"use client";
import { getAgent } from "@/lib/chat/agents";
import type { Session } from "@/lib/chat/types";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(ts).toLocaleDateString();
}

export function Sidebar({
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
  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={onNew}
        className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-night"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
        New chat
      </button>

      <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-widest text-ivory-dim/70">
        Sessions · {sessions.length}
      </p>

      <div className="chat-scroll flex-1 space-y-1 overflow-y-auto pr-1" data-lenis-prevent>
        {sessions.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-ivory-dim/70">
            No sessions yet — pick an agent to start.
          </p>
        )}
        {sessions.map((s) => {
          const agent = getAgent(s.agentId);
          const active = s.id === activeId;
          return (
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(s.id);
                }
              }}
              className={`group flex w-full cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${
                active
                  ? "border-gold/40 bg-gold/10"
                  : "border-transparent hover:border-ivory/10 hover:bg-night-2"
              }`}
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: agent?.accent ?? "#666" }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ivory">{s.title}</span>
                <span className="block text-[11px] text-ivory-dim/70">
                  {agent ? `${agent.name} · ${relativeTime(s.updatedAt)}` : "—"}
                </span>
              </span>
              <button
                type="button"
                aria-label={`Delete session ${s.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="rounded-md px-1 text-ivory-dim opacity-0 transition hover:text-red-400 group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
