"use client";
import { useState } from "react";
import { ConfirmGate, type GateState } from "../components/ConfirmGate";
import { Panel } from "../components/Panel";
import { Pill, type Tone } from "../components/Pill";
import type { RunbookStep, Ticket } from "../samples";

const PRIORITY: Record<Ticket["priority"], Tone> = { low: "neutral", normal: "info", high: "warn", urgent: "risk" };

/** A Kural help-desk ticket in a queue. */
export function TicketCard({ ticket, selected = false, onSelect }: { ticket: Ticket; selected?: boolean; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected ? "border-[color:var(--accent)]/70 bg-[color:var(--accent)]/10" : "border-ivory/10 bg-night/60 hover:border-ivory/25"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ivory-dim">{ticket.id}</span>
        <span className="flex gap-1">
          <Pill tone={PRIORITY[ticket.priority]}>{ticket.priority}</Pill>
          <Pill>{ticket.status}</Pill>
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-ivory">{ticket.title}</p>
      <p className="mt-0.5 text-xs text-ivory-dim">
        {ticket.requester} · {ticket.opened}
      </p>
    </button>
  );
}

/** Kural's runbook: numbered steps the agent proposes. Read-only steps can
    be ticked off; any step that changes a system sits behind a ConfirmGate
    with its rollback stated. Nothing runs without a person. */
export function RunbookPanel({ title, steps }: { title: string; steps: RunbookStep[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [gates, setGates] = useState<Record<string, GateState>>({});
  return (
    <Panel eyebrow={<span lang="ta">குறள் · Kural runbook</span>} title={title} accentEdge>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ivory/20 font-mono text-[11px] text-ivory-dim">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              {s.changes ? (
                <ConfirmGate
                  action={s.text}
                  impact={s.changes.impact}
                  rollback={s.changes.rollback}
                  confirmWord={s.changes.confirmWord}
                  state={gates[s.id]}
                  onConfirm={() => setGates((g) => ({ ...g, [s.id]: "confirmed" }))}
                  onDecline={() => setGates((g) => ({ ...g, [s.id]: "declined" }))}
                />
              ) : (
                <label className="flex items-start gap-2 text-sm text-ivory">
                  <input
                    type="checkbox"
                    checked={!!done[s.id]}
                    onChange={(e) => setDone((d) => ({ ...d, [s.id]: e.target.checked }))}
                    className="mt-1 accent-[var(--gold)]"
                  />
                  <span className={done[s.id] ? "text-ivory-dim line-through" : ""}>{s.text}</span>
                </label>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
