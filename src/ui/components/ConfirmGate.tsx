"use client";
import { useState } from "react";

export type GateState = "pending" | "confirmed" | "declined";

/** A human confirm in front of any action that changes a system.
    Aram rule 3 — think, then act: the agent proposes, a person decides,
    and the rollback is stated before anything runs. */
export function ConfirmGate({
  action,
  impact,
  rollback,
  confirmWord,
  onConfirm,
  onDecline,
  state: controlled,
}: {
  /** what will happen, in one line */
  action: string;
  /** what it affects */
  impact: string;
  /** how to undo it */
  rollback: string;
  /** when set, the person must type this word to confirm (for risky steps) */
  confirmWord?: string;
  onConfirm?: () => void;
  onDecline?: () => void;
  state?: GateState;
}) {
  const [local, setLocal] = useState<GateState>("pending");
  const [typed, setTyped] = useState("");
  const state = controlled ?? local;
  const ready = !confirmWord || typed.trim() === confirmWord;

  return (
    <div
      className={`rounded-xl border p-3 text-sm ${
        state === "confirmed" ? "border-mullai/50 bg-mullai/5" : state === "declined" ? "border-ivory/15 opacity-70" : "border-palai/50 bg-palai/5"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-palai">Needs a human confirm</p>
      <p className="mt-1 font-semibold text-ivory">{action}</p>
      <dl className="mt-2 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-xs">
        <dt className="text-ivory-dim">Affects</dt>
        <dd className="text-ivory">{impact}</dd>
        <dt className="text-ivory-dim">Rollback</dt>
        <dd className="text-ivory">{rollback}</dd>
      </dl>
      {state === "pending" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {confirmWord && (
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Type ${confirmWord}`}
              aria-label={`Type ${confirmWord} to confirm`}
              className="w-32 rounded-md border border-ivory/15 bg-night px-2 py-1 font-mono text-xs text-ivory focus:border-gold/60 focus:outline-none"
            />
          )}
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              setLocal("confirmed");
              onConfirm?.();
            }}
            className="rounded-md bg-gold px-3 py-1 text-xs font-semibold text-night hover:bg-bronze disabled:opacity-40"
          >
            Confirm and run
          </button>
          <button
            type="button"
            onClick={() => {
              setLocal("declined");
              onDecline?.();
            }}
            className="rounded-md border border-ivory/20 px-3 py-1 text-xs text-ivory-dim hover:text-ivory"
          >
            Don&apos;t run
          </button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-ivory-dim">{state === "confirmed" ? "Confirmed by you — logged." : "Declined — nothing ran."}</p>
      )}
    </div>
  );
}
