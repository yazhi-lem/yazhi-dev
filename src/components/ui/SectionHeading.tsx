"use client";
import { Bi } from "./Bi";
import type { LText } from "@/lib/i18n";

/** Section heading whose eyebrow names the governing landscape —
    structure, not decoration. Follows the visitor's Indic language
    and mode, including the mixed code-switching voice. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: LText;
  title: LText;
  sub?: LText;
}) {
  return (
    <header className="mb-12 max-w-3xl">
      <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
        <span aria-hidden className="h-px w-8 bg-[color:var(--accent)]" />
        <Bi text={eyebrow} className="flex flex-col gap-0.5" />
      </p>
      <Bi
        as="h2"
        display
        text={title}
        className="flex flex-col gap-1"
        taClass="font-display text-[length:var(--text-4xl)] font-semibold"
        enClass="font-display text-[length:var(--text-2xl)] font-medium text-ivory-dim"
        mixedClass="font-display text-[length:var(--text-4xl)] font-semibold"
      />
      {sub && (
        <Bi
          as="p"
          text={sub}
          className="mt-4 flex flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim"
        />
      )}
    </header>
  );
}
