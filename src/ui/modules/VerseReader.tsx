"use client";
import { useState } from "react";
import { Panel } from "../components/Panel";
import { Pill } from "../components/Pill";
import type { Couplet } from "../samples";
import { truncateGraphemes } from "../text";

/** Open Sangam's reader: a corpus of numbered verses on the left, the
    selected verse with its gloss and review state on the right. The
    reviewed flag is the scholar sign-off gate — unreviewed text says so. */
export function VerseReader({
  title,
  verses,
  reviewed = false,
}: {
  title: string;
  verses: Couplet[];
  reviewed?: boolean;
}) {
  const [current, setCurrent] = useState(verses[0]?.number);
  const verse = verses.find((v) => v.number === current) ?? verses[0];
  if (!verse) return null;
  return (
    <Panel
      eyebrow={<span lang="ta">திறந்த சங்கம் · Open Sangam</span>}
      title={title}
      actions={reviewed ? <Pill tone="ok">scholar-verified</Pill> : <Pill tone="warn">awaiting scholar review</Pill>}
    >
      <div className="grid gap-4 md:grid-cols-[10rem_1fr]">
        <ol className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Verses" data-lenis-prevent>
          {verses.map((v) => (
            <li key={v.number}>
              <button
                type="button"
                onClick={() => setCurrent(v.number)}
                aria-current={v.number === verse.number ? "true" : undefined}
                className={`w-full whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm ${
                  v.number === verse.number ? "bg-[color:var(--accent)]/15 text-ivory" : "text-ivory-dim hover:bg-ivory/5"
                }`}
              >
                <span className="font-mono text-xs">{v.number}</span>
                <span lang="ta" className="ml-2 hidden md:inline">
                  {truncateGraphemes(v.lines[0], 6)}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <article>
          <ol lang="ta" className="space-y-1 text-lg text-ivory">
            {verse.lines.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 shrink-0 pt-1.5 text-right font-mono text-[11px] text-ivory-dim/70" aria-label={`line ${i + 1}`}>
                  {i + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-lg border border-ivory/10 bg-night/60 p-3">
            <p className="text-[11px] text-ivory-dim">Gloss · draft, pending scholar review</p>
            <p className="mt-1 text-sm text-ivory">{verse.gloss}</p>
          </div>
        </article>
      </div>
    </Panel>
  );
}
