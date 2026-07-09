"use client";
import { useMemo } from "react";
import { SCRIPTS } from "@/lib/content";

/** Deterministic PRNG (mulberry32) — fixed seed keeps the scatter identical
    on server and client, so there's no hydration mismatch. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A site-wide ambient layer of multi-script letters, scattered across the
    whole viewport and drifting slowly in space. Fixed to the viewport so it
    stays behind every section as you scroll — floating letters "across the
    site", not just the hero. Sits above the WebGL world (-z-10) but behind
    the page content, and is kept low-opacity so text stays legible. */
export function FloatingGlyphs({ count = 42 }: { count?: number }) {
  const glyphs = useMemo(() => {
    const all = SCRIPTS.flatMap((s) => s.glyphs);
    const rand = mulberry32(73);
    return Array.from({ length: count }, () => ({
      g: all[Math.floor(rand() * all.length)],
      x: rand() * 100,
      y: rand() * 100,
      size: 0.9 + rand() * 2.4, // rem
      opacity: 0.05 + rand() * 0.11,
      dur: 16 + rand() * 22,
      delay: -(rand() * 32),
      fx: Math.round((rand() * 2 - 1) * 44), // px drift
      fy: Math.round((rand() * 2 - 1) * 44),
    }));
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      {glyphs.map((p, i) => (
        <span
          key={i}
          className="floaty absolute font-display text-ivory"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--fx" as string]: `${p.fx}px`,
            ["--fy" as string]: `${p.fy}px`,
            textShadow: "0 0 20px color-mix(in oklab, var(--accent) 45%, transparent)",
          } as React.CSSProperties}
        >
          {p.g}
        </span>
      ))}
    </div>
  );
}
