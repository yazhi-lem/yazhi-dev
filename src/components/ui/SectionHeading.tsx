"use client";
import { Bi } from "./Bi";

/** Section heading whose eyebrow names the governing landscape —
    structure, not decoration. Strict per-mode language. */
export function SectionHeading({
  thinaiTa,
  thinaiEn,
  landscapeTa,
  landscape,
  titleTa,
  titleEn,
  subTa,
  subEn,
  plainTa,
  plainEn,
}: {
  thinaiTa: string;
  thinaiEn: string;
  landscapeTa: string;
  landscape: string;
  titleTa: string;
  titleEn: string;
  subTa?: string;
  subEn?: string;
  /** the plain-language layer: one sentence a ten-year-old can read,
      under the poetic/technical register — never replacing it */
  plainTa?: string;
  plainEn?: string;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
        <span aria-hidden className="h-px w-8 bg-[color:var(--accent)]" />
        <Bi
          ta={`${thinaiTa} · ${landscapeTa}`}
          en={`${thinaiEn} · ${landscape}`}
          className="flex flex-col gap-0.5"
        />
      </p>
      <Bi
        as="h2"
        display
        ta={titleTa}
        en={titleEn}
        className="flex flex-col gap-1"
        taClass="font-display text-[length:var(--text-4xl)] font-semibold"
        enClass="font-display text-[length:var(--text-2xl)] font-medium text-ivory-dim"
      />
      {subTa && subEn && (
        <Bi
          as="p"
          ta={subTa}
          en={subEn}
          className="mt-4 flex flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim"
        />
      )}
      {plainTa && plainEn && (
        <Bi
          as="p"
          ta={plainTa}
          en={plainEn}
          className="mt-3 flex flex-col gap-1 border-l-2 border-[color:var(--accent)]/40 pl-3 text-sm text-ivory-dim"
        />
      )}
    </header>
  );
}
