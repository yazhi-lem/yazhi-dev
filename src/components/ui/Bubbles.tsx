import type { CSSProperties } from "react";

/** Sparkling bubbles drifting up through the deep-ocean footer. A fixed,
    hand-tuned set (not random) so the server and client render identically —
    no hydration mismatch — while still feeling scattered and alive. Each rises,
    drifts, and twinkles on its own phase. Purely decorative; motion is disabled
    under prefers-reduced-motion (see globals.css). */
const BUBBLES: {
  left: string;
  size: number;
  delay: number;
  dur: number;
  rise: number;
  drift: number;
  op: number;
}[] = [
  { left: "6%", size: 5, delay: 0.0, dur: 9.5, rise: 210, drift: 12, op: 0.5 },
  { left: "13%", size: 8, delay: 3.2, dur: 12, rise: 250, drift: -14, op: 0.45 },
  { left: "19%", size: 4, delay: 1.4, dur: 8, rise: 180, drift: 9, op: 0.6 },
  { left: "27%", size: 6, delay: 5.0, dur: 11, rise: 230, drift: 16, op: 0.5 },
  { left: "34%", size: 3, delay: 2.1, dur: 7.5, rise: 200, drift: -8, op: 0.55 },
  { left: "41%", size: 9, delay: 6.3, dur: 13, rise: 270, drift: 18, op: 0.4 },
  { left: "48%", size: 5, delay: 0.8, dur: 9, rise: 190, drift: -12, op: 0.55 },
  { left: "55%", size: 4, delay: 4.4, dur: 8.5, rise: 210, drift: 10, op: 0.6 },
  { left: "62%", size: 7, delay: 2.7, dur: 11.5, rise: 240, drift: -16, op: 0.45 },
  { left: "69%", size: 5, delay: 7.1, dur: 10, rise: 220, drift: 13, op: 0.5 },
  { left: "76%", size: 3, delay: 1.9, dur: 7, rise: 175, drift: -7, op: 0.6 },
  { left: "82%", size: 8, delay: 5.6, dur: 12.5, rise: 260, drift: 15, op: 0.42 },
  { left: "88%", size: 5, delay: 3.9, dur: 9.5, rise: 205, drift: -11, op: 0.5 },
  { left: "94%", size: 4, delay: 0.5, dur: 8, rise: 185, drift: 8, op: 0.55 },
];

export function Bubbles({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s, ${b.delay}s`,
              animationDuration: `${b.dur}s, ${(b.dur / 2.5).toFixed(1)}s`,
              "--b-h": `${b.rise}px`,
              "--b-drift": `${b.drift}px`,
              "--b-op": b.op,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
