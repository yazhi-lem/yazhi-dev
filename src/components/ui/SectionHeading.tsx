"use client";
import { Bi } from "./Bi";
import { useSiteT } from "@/lib/i18n";

/** Section heading whose eyebrow names the governing landscape —
    structure, not decoration. Strict per-mode language.

    Every line is a catalogue key now; the locale resolves it (Tamil
    default, English, Hindi draft), and `<Bi>` still applies the display
    preference inside the header. */
export function SectionHeading({
  thinaiKey,
  landscapeKey,
  titleKey,
  subKey,
  plainKey,
}: {
  /** `site.section.<id>.thinai` — the governing thinai's name */
  thinaiKey: string;
  /** `site.section.<id>.landscape` — the landscape · mood eyebrow */
  landscapeKey: string;
  titleKey: string;
  subKey?: string;
  /** the plain-language layer: one sentence a ten-year-old can read,
      under the poetic/technical register — never replacing it */
  plainKey?: string;
}) {
  const t = useSiteT();
  return (
    <header className="mb-4 sm:mb-6 max-w-2xl">
      <p className="mb-2 flex items-center gap-2.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] font-mono">
        <span aria-hidden className="h-px w-6 sm:w-8 bg-[color:var(--accent)]" />
        <Bi
          ta={t(thinaiKey)}
          en={t(landscapeKey)}
          className="flex flex-col gap-0.5"
        />
      </p>
      <Bi
        as="h2"
        display
        ta={t(titleKey)}
        en={t(titleKey, undefined, { language: "en" })}
        className="flex flex-col gap-0.5"
        taClass="font-display text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-tight tracking-tight text-ivory"
        enClass="font-display text-base sm:text-lg lg:text-xl font-medium text-ivory-dim leading-snug"
      />
      {subKey && (
        <Bi
          as="p"
          ta={t(subKey)}
          en={t(subKey, undefined, { language: "en" })}
          className="mt-2 flex flex-col gap-0.5 text-xs sm:text-sm text-ivory-dim leading-relaxed"
        />
      )}
      {plainKey && (
        <Bi
          as="p"
          ta={t(plainKey)}
          en={t(plainKey, undefined, { language: "en" })}
          className="mt-2 flex flex-col gap-0.5 border-l-2 border-[color:var(--accent)]/50 pl-2.5 text-xs text-ivory-dim/90 leading-relaxed"
        />
      )}
    </header>
  );
}
