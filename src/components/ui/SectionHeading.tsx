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
  className = "mb-5 max-w-5xl",
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
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="mb-2 flex items-center gap-2.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
        <span aria-hidden className="h-px w-6 sm:w-8 bg-[color:var(--accent)]" />
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
        taClass="font-display text-[length:var(--text-section-ta)] font-bold tracking-tight text-ivory leading-tight"
        enClass="font-display text-[length:var(--text-product)] font-medium text-ivory-dim"
      />
      {subTa && subEn && (
        <Bi
          as="p"
          ta={subTa}
          en={subEn}
          className="mt-2 flex flex-col gap-0.5 text-[length:var(--text-subhead)] text-ivory-dim"
        />
      )}
      {plainTa && plainEn && (
        <Bi
          as="p"
          ta={plainTa}
          en={plainEn}
          className="mt-2 flex flex-col gap-0.5 border-l-2 border-[color:var(--accent)]/40 pl-3 text-xs sm:text-sm leading-relaxed text-ivory-dim/90"
        />
      )}
    </header>
  );
}

