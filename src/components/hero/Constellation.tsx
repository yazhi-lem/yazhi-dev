"use client";
import { useMemo } from "react";
import { SCRIPTS, STATS } from "@/lib/content";
import { Bi } from "@/components/ui/Bi";

/** Small deterministic PRNG (mulberry32). A fixed seed means the scatter is
    identical on the server and the client, so there is no hydration
    mismatch even though the layout looks random. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The script constellation, built as typographic DOM — deliberately not
    WebGL (see README §Design decisions): real glyphs from many Indic
    scripts scattered freely around the model's stat core, per
    BRAND_AND_CONTENT §4 ("not just generic background noise"). The scatter
    (not rings) says "many scripts converging on one model".
    Reduced motion: the drift freezes into a still constellation. */
export function Constellation() {
  const glyphs = useMemo(() => {
    const all = SCRIPTS.flatMap((s) => s.glyphs.map((g) => ({ g, script: s.name })));
    const rand = mulberry32(20260708);
    return all.map((item) => {
      // Scatter across the square but keep a clear elliptical hole in the
      // middle where the stat block sits — reject samples inside the core.
      let x = 50;
      let y = 50;
      for (let tries = 0; tries < 40; tries++) {
        x = rand() * 100;
        y = rand() * 100;
        const dx = (x - 50) / 33;
        const dy = (y - 50) / 28;
        if (dx * dx + dy * dy > 1) break;
      }
      return {
        g: item.g,
        x,
        y,
        size: 0.85 + rand() * 1.35, // rem
        opacity: 0.32 + rand() * 0.5,
        delay: -(rand() * 9), // negative so they start mid-cycle, not in sync
        dur: 7 + rand() * 9,
      };
    });
  }, []);

  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[620px] place-items-center">
      {/* scattered multi-script glyphs */}
      <div aria-hidden className="absolute inset-0">
        {glyphs.map((p, i) => (
          <span
            key={i}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <span
              className="scatter-glyph block font-display text-ivory/80"
              style={{
                fontSize: `${p.size}rem`,
                opacity: p.opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
                textShadow: "0 0 18px color-mix(in oklab, var(--accent) 55%, transparent)",
              }}
            >
              {p.g}
            </span>
          </span>
        ))}
      </div>

      {/* the core the scatter unifies around: the model stat block */}
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
