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
    <header className="mb-12 max-w-3xl">
      <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
        <span aria-hidden className="h-px w-8 bg-[color:var(--accent)]" />
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
        className="flex flex-col gap-1"
        taClass="font-display text-[length:var(--text-4xl)] font-semibold"
        enClass="font-display text-[length:var(--text-2xl)] font-medium text-ivory-dim"
      />
      {subKey && (
        <Bi
          as="p"
          ta={t(subKey)}
          en={t(subKey, undefined, { language: "en" })}
          className="mt-4 flex flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim"
        />
      )}
      {plainKey && (
        <Bi
          as="p"
          ta={t(plainKey)}
          en={t(plainKey, undefined, { language: "en" })}
          className="mt-3 flex flex-col gap-1 border-l-2 border-[color:var(--accent)]/40 pl-3 text-sm text-ivory-dim"
        />
      )}
    </header>
  );
}
