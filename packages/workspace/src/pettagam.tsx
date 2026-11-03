"use client";
import { useCallback } from "react";
import { Panel, Pill } from "@yazhi/bubble";
import { readStored, useStored, writeStored } from "./store";
import type { ModuleContext } from "./types";

/** Pettagam (பெட்டகம்) — the audit log: who did what, when (IST), with which
    sources. Per workspace (tenant), hash-chained so an edit to an old entry
    breaks every entry after it (PRD review finding M1).

    In this front end it is the demo log, kept in the viewer's browser. In
    production the same entries are written by yazhi-api, per tenant, in
    India; this module only reads them. */

export interface AuditEntry {
  id: string;
  /** ISO time */
  at: string;
  who: string;
  what: string;
  sources?: string[];
  /** hash of the previous entry + this one */
  hash: string;
}

const KEY = (ws: string) => `yazhi-ws:${ws}:pettagam`;
const MAX = 200;

/** FNV-1a, 32-bit — enough to show tampering in a demo log. Production
    chains with SHA-256 on the server. */
function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
const body = (e: Omit<AuditEntry, "hash">) => JSON.stringify([e.id, e.at, e.who, e.what, e.sources ?? []]);

export function appendAudit(ws: string, what: string, sources?: string[], who = "You · demo") {
  const log = readStored<AuditEntry[]>(KEY(ws), []);
  const prev = log[log.length - 1]?.hash ?? "genesis";
  const base = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), who, what, sources };
  const entry: AuditEntry = { ...base, hash: fnv(prev + body(base)) };
  writeStored(KEY(ws), [...log, entry].slice(-MAX));
}

/** True when every entry's hash matches its body and the one before it. */
export function verifyChain(log: AuditEntry[]): boolean {
  let prev = log.length && log.length === MAX ? null : "genesis";
  for (const e of log) {
    // a trimmed log starts mid-chain: trust its first link
    if (prev === null) {
      prev = e.hash;
      continue;
    }
    if (fnv(prev + body(e)) !== e.hash) return false;
    prev = e.hash;
  }
  return true;
}

export function useAudit(ws: string) {
  const [log, , clear] = useStored<AuditEntry[]>(KEY(ws), []);
  const append = useCallback((what: string, sources?: string[]) => appendAudit(ws, what, sources), [ws]);
  return { log, append, clear };
}

export const IST = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** The Pettagam panel — any workspace can place it on any view. */
export function AuditPanel({ ctx }: { ctx: ModuleContext }) {
  const { t, meta } = ctx;
  const { log, clear } = useAudit(meta.id);
  const intact = verifyChain(log);
  const recent = [...log].reverse().slice(0, 8);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pettagam-${meta.id}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <Panel
      eyebrow={t({ ta: "பெட்டகம்", en: "Pettagam", te: "పెట్టగం" })}
      title={t({ ta: "தணிக்கைப் பதிவு", en: "Audit log", te: "ఆడిట్ లాగ్" })}
      actions={<Pill tone={intact ? "ok" : "risk"} title="Each entry is chained to the one before it">{intact ? "✓ chain intact" : "✕ chain broken"}</Pill>}
    >
      {recent.length === 0 ? (
        <p className="text-sm text-ivory-dim">
          {t({ ta: "இன்னும் பதிவு இல்லை. ஒப்புதல்கள், திருத்தங்கள், பதிவேற்றங்கள் இங்கே வரும்.", en: "Nothing logged yet. Approvals, edits and uploads land here.", te: "ఇంకా ఏమీ నమోదు కాలేదు." })}
        </p>
      ) : (
        <ol className="space-y-2">
          {recent.map((e) => (
            <li key={e.id} className="rounded-lg border border-ivory/10 bg-night/60 px-3 py-2 text-xs">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-ivory">{e.what}</span>
                <span className="shrink-0 font-mono text-[10px] text-ivory-dim">{e.hash}</span>
              </div>
              <p className="mt-0.5 text-ivory-dim">
                {e.who} · {IST(e.at)} IST
                {e.sources?.length ? ` · ${e.sources.join(", ")}` : ""}
              </p>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={exportJson} disabled={!log.length} className="min-h-9 rounded-full border border-ivory/20 px-3 text-ivory-dim hover:text-ivory disabled:opacity-40">
          {t({ ta: "ஏற்றுமதி (JSON)", en: "Export (JSON)", te: "ఎగుమతి (JSON)" })}
        </button>
        <button type="button" onClick={clear} disabled={!log.length} className="min-h-9 rounded-full border border-ivory/20 px-3 text-ivory-dim hover:border-palai/60 hover:text-ivory disabled:opacity-40">
          {t({ ta: "டெமோ பதிவை அழி", en: "Clear demo log", te: "డెమో లాగ్ తొలగించు" })}
        </button>
      </div>
    </Panel>
  );
}
