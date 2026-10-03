import type { BubbleSize } from "@/lib/bubble/types";

export const RADIUS: Record<BubbleSize, number> = { l: 38, m: 28, s: 21 };

export interface Placed {
  x: number;
  y: number;
  r: number;
}

/** Deterministic greedy packing for the bubble tray: each circle drops into
    the highest (then left-most) spot where it fits inside `width` without
    touching any placed circle — the brand rule is "never touching", so
    every pair keeps at least `gap` between edges. Same input, same layout,
    on server and client alike. */
export function packColumn(sizes: BubbleSize[], width: number, gap = 6, step = 3): { placed: Placed[]; height: number } {
  const placed: Placed[] = [];
  let height = 0;
  for (const size of sizes) {
    const r = RADIUS[size];
    let best: Placed | null = null;
    // a tray narrower than the bubble still gets one centred column
    const xMax = Math.max(r + gap / 2, width - r - gap / 2);
    for (let y = r + gap; best === null; y += step) {
      for (let x = r + gap / 2; x <= xMax; x += step) {
        const fits = placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + gap);
        if (fits) {
          best = { x, y, r };
          break;
        }
      }
    }
    const spot = best as Placed;
    placed.push(spot);
    height = Math.max(height, spot.y + r + gap);
  }
  return { placed, height };
}
