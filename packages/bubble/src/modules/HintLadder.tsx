"use client";
import { useState } from "react";
import { Panel } from "../components/Panel";
import { useBubbleT } from "../locales";

/** Guru's tutoring pattern: hints revealed one rung at a time, never the
    answer. The last rung hands the work back to the student. */
export function HintLadder({
  prompt,
  hints,
  handBack,
}: {
  prompt: string;
  hints: string[];
  /** what the student does after the last hint */
  handBack: string;
}) {
  const t = useBubbleT("bubble.hintLadder");
  const [shown, setShown] = useState(0);
  const done = shown >= hints.length;
  return (
    <Panel eyebrow={t("eyebrow")} title={prompt} accentEdge>
      <ol className="space-y-2">
        {hints.slice(0, shown).map((h, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-night/60 p-3 text-sm text-ivory">
            <span className="font-mono text-[11px] text-[color:var(--accent)]">{t("hintN", { n: i + 1 })}</span>
            <span>{h}</span>
          </li>
        ))}
      </ol>
      {done ? (
        <p className="mt-3 rounded-lg border border-mullai/40 bg-mullai/5 p-3 text-sm text-ivory">{handBack}</p>
      ) : (
        <button
          type="button"
          onClick={() => setShown((n) => n + 1)}
          className="mt-3 rounded-lg border border-[color:var(--accent)]/50 px-3 py-1.5 text-sm text-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
        >
          {shown === 0 ? t("stuck") : t("next", { next: shown + 1, total: hints.length })}
        </button>
      )}
      <p className="mt-3 text-[11px] text-ivory-dim">{t("footnote")}</p>
    </Panel>
  );
}
