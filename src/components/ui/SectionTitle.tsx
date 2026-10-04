"use client";
import { Bi } from "@/components/ui/Bi";
import { useLang } from "@/lib/i18n";

/** Eyebrow, heading and optional lead for a home section. The heading
    caps its size at (viewport − 3rem) / 10 so the longest Tamil word
    in any heading (≈ 9.7em) never runs past a phone's edge. */
export function SectionTitle({
  eyebrow,
  title,
  lead,
  center = false,
  id,
}: {
  eyebrow?: { ta: string; en: string };
  title: { ta: string; en: string };
  lead?: { ta: string; en: string };
  center?: boolean;
  id?: string;
}) {
  const { lang } = useLang();
  const align = center ? "items-center text-center" : "";
  // English is a quiet gloss under Tamil, but the heading itself when alone
  const enClass =
    lang === "en"
      ? "font-display text-[length:var(--text-4xl)] font-semibold"
      : "font-display text-[length:var(--text-xl)] text-ivory-dim";
  return (
    <div className={`flex flex-col ${align}`}>
      {eyebrow && (
        <Bi
          as="p" ta={eyebrow.ta} en={eyebrow.en}
          className="mb-2 flex gap-2 text-sm text-[color:var(--accent)]"
          separator={<span aria-hidden>·</span>}
        />
      )}
      <h2 id={id} className="flex flex-col gap-1">
        <Bi
          ta={title.ta} en={title.en} display
          className="flex flex-col gap-1"
          taClass="font-display text-[length:min(var(--text-4xl),calc((100vw_-_3rem)/10))] font-semibold"
          enClass={enClass}
        />
      </h2>
      {lead && (
        <Bi
          as="p" ta={lead.ta} en={lead.en}
          className={`mt-4 flex max-w-2xl flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim ${center ? "mx-auto" : ""}`}
          enClass="text-base"
        />
      )}
    </div>
  );
}
