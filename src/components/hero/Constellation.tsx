"use client";
import { useMemo } from "react";
import { SCRIPTS, STATS } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";

/** The script constellation, built as typographic DOM — deliberately not
    WebGL (see README §Design decisions): real glyphs on counter-rotating
    orbital rings, unifying around the model's stat core, per
    BRAND_AND_CONTENT §4 ("not just generic background noise").
    Reduced motion: rings freeze into a static constellation. */
export function Constellation() {
  // Deterministic distribution: interleave scripts across three rings so no
  // ring is single-script — the visual argument is "many scripts, one model".
  const rings = useMemo(() => {
    const all = SCRIPTS.flatMap((s) => s.glyphs.map((g) => ({ g, script: s.name })));
    const r: { g: string; script: string }[][] = [[], [], []];
    all.forEach((item, i) => r[i % 3].push(item));
    // cap each ring so it breathes on mobile
    return r.map((ring, i) => ring.filter((_, j) => j % (i === 0 ? 3 : i === 1 ? 2 : 2) === 0));
  }, []);

  const ringConf = [
    { size: "min(88vw, 620px)", duration: "90s", opacity: 0.9 },
    { size: "min(66vw, 460px)", duration: "70s", opacity: 0.65 },
    { size: "min(46vw, 320px)", duration: "55s", opacity: 0.45 },
  ];

  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[620px] place-items-center" aria-hidden={false}>
      {/* orbital rings */}
      {rings.map((ring, ri) => (
        <div
          key={ri}
          aria-hidden
          className="ring absolute rounded-full border border-ivory/5"
          style={{
            width: ringConf[ri].size,
            height: ringConf[ri].size,
            animationDuration: ringConf[ri].duration,
            opacity: ringConf[ri].opacity,
          }}
        >
          {ring.map((item, gi) => {
            const angle = (360 / ring.length) * gi;
            return (
              <span
                key={`${item.g}-${gi}`}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${angle}deg) translateY(calc(${ringConf[ri].size} / -2))` }}
              >
                <span
                  className="ring-glyph block font-display text-lg text-ivory/80 sm:text-xl"
                  style={{ animationDuration: ringConf[ri].duration, textShadow: "0 0 18px color-mix(in oklab, var(--accent) 55%, transparent)" }}
                >
                  {item.g}
                </span>
              </span>
            );
          })}
        </div>
      ))}

      {/* the core the constellation unifies around: the model stat block */}
      <div className="relative z-10 rounded-2xl border border-[color:var(--accent)]/40 bg-night-2/85 px-6 py-5 text-center shadow-[0_0_60px_-15px_var(--accent)] backdrop-blur">
        <Bi
          as="p"
          ta="ஒரே மாதிரி"
          en="one model"
          className="mb-3 flex flex-col gap-0.5 text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]"
        />
        <dl className="flex items-start justify-center gap-6">
          {STATS.map((s) => (
            <div key={s.en}>
              <dt className="sr-only">{s.en}</dt>
              <dd className="font-display text-2xl font-semibold text-gold sm:text-3xl">{s.value}</dd>
              <dd className="mt-1 max-w-[6rem]">
                <Bi ta={s.ta} en={s.en} className="flex flex-col text-[11px] leading-tight text-ivory-dim" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
