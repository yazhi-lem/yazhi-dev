import type { CSSProperties } from "react";

/** Drifting clouds for the Mugil theme. Each cloud is a cluster of
    bubbles — the brand mark's three circles at the same 1.00 : 0.74 :
    0.56 radius ratio, softened. A fixed hand-tuned set (not random) so
    server and client render identically. Negative delays spread the
    clouds across the sky on first paint instead of all starting
    off-screen. Hidden by CSS unless data-ybi-theme="mugil"; frozen in
    place under prefers-reduced-motion. */
const CLOUDS: { top: string; scale: number; dur: number; delay: number; tint: string; rest: string }[] = [
  { top: "9%", scale: 1.3, dur: 140, delay: -20, tint: "var(--mugil-lilac)", rest: "8vw" },
  { top: "22%", scale: 0.8, dur: 110, delay: -70, tint: "var(--mugil-peach)", rest: "62vw" },
  { top: "41%", scale: 1.1, dur: 160, delay: -110, tint: "var(--mugil-mint)", rest: "34vw" },
  { top: "63%", scale: 0.7, dur: 120, delay: -35, tint: "var(--mugil-butter)", rest: "78vw" },
  { top: "80%", scale: 1.2, dur: 180, delay: -140, tint: "var(--mugil-sky)", rest: "16vw" },
];

// the mark's three circles (r = 22, 16.3, 12.3 → 1.00 : 0.74 : 0.56), plus a base puff
const PUFFS = [
  { l: 0, t: 26, d: 88 },
  { l: 52, t: 0, d: 120 },
  { l: 126, t: 18, d: 92 },
  { l: 30, t: 52, d: 150 },
];

export function CloudSky() {
  return (
    <div aria-hidden className="ybi-sky">
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="ybi-cloud"
          style={
            {
              top: c.top,
              left: 0,
              width: 220,
              height: 120,
              scale: String(c.scale),
              "--dur": `${c.dur}s`,
              "--delay": `${c.delay}s`,
              "--cloud-tint": c.tint,
              "--rest": c.rest,
            } as CSSProperties
          }
        >
          {PUFFS.map((p, j) => (
            <span key={j} style={{ left: p.l, top: p.t, width: p.d, height: p.d * 0.62 + (j === 1 ? 30 : 0) }} />
          ))}
        </div>
      ))}
    </div>
  );
}
