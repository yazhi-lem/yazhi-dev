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
}: {
  thinaiTa: string;
  thinaiEn: string;
  landscapeTa: string;
  landscape: string;
  titleTa: string;
  titleEn: string;
  subTa?: string;
  subEn?: string;
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
    </header>
  );
}
