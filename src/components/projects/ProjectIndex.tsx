"use client";
import Link from "next/link";
import { Bi } from "@/components/ui/Bi";
import { useLang } from "@/lib/i18n";
import { PROJECTS_BY_DATE, formatDate } from "@/lib/projects";
import { toneStyle } from "@/bubble/tone";

/** /projects — the whole 2026 launch line as cards, in date order. */
export function ProjectIndex() {
  const { lang } = useLang();
  const h1 = "font-display text-[length:min(var(--text-5xl),calc((100vw_-_3rem)/7))] font-semibold text-ivory";
  return (
    <main id="main" className="mx-auto max-w-[var(--max-w)] px-6 pb-[var(--space-section)] pt-28 sm:px-8 lg:px-10">
      <h1>
        <Bi
          ta="திட்டங்கள்" en="Projects" display
          className="flex flex-wrap items-baseline gap-x-3"
          taClass={h1}
          enClass={lang === "en" ? h1 : "font-display text-[length:var(--text-xl)] text-ivory-dim"}
        />
      </h1>
      <Bi
        as="p"
        ta="2026-இன் வெளியீடுகள் அனைத்தும், தேதி வரிசையில். ஒவ்வொன்றின் பக்கத்திலும் முழு விவரமும் விசாரணைப் படிவமும் உண்டு."
        en="Every 2026 launch, in date order. Each page has the full detail and an enquiry form."
        className="mt-4 flex max-w-2xl flex-col gap-1 text-[length:var(--text-lg)] text-ivory-dim"
        enClass="text-base"
      />
      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS_BY_DATE.map((p) => {
          const d = formatDate(p.milestones[0].date);
          return (
            <li key={p.slug} style={toneStyle(p.tone)}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--tone)]/30 bg-night-2/70 p-6 backdrop-blur transition-colors hover:border-[color:var(--tone)]"
              >
                <Bi ta={`${d.ta} · ${p.milestones[0].tier.ta}`} en={`${d.en} · ${p.milestones[0].tier.en}`} className="ybi-tone-text flex flex-col text-sm" />
                <Bi
                  ta={p.name.ta} en={p.name.en}
                  className="flex flex-wrap items-baseline gap-x-2"
                  taClass="font-display text-[length:var(--text-2xl)] font-semibold text-ivory"
                  enClass={lang === "en" ? "font-display text-[length:var(--text-2xl)] font-semibold text-ivory" : "font-display text-base text-ivory-dim"}
                />
                <Bi ta={p.what.ta} en={p.what.en} className="flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
                <span aria-hidden className="mt-auto pt-2 text-[color:var(--tone)] transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
