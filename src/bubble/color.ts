/** WCAG 2.1 colour maths — the same formulas docs/YBI-DEV-GUIDE.md §6
    uses, so a page can print the ratio it is actually rendering with.
    Pure functions on #rrggbb strings; no DOM. */

function channels(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/** Relative luminance: 0.2126 R + 0.7152 G + 0.0722 B over linear sRGB. */
export function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** (L_hi + 0.05) / (L_lo + 0.05), 1 – 21. */
export function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** sRGB mix, `t` = share of `a` (matches CSS color-mix(in srgb, a t, b)). */
export function mix(a: string, b: string, t: number): string {
  const [x, y] = [channels(a), channels(b)];
  return toHex([0, 1, 2].map((i) => x[i] * t + y[i] * (1 - t)) as [number, number, number]);
}

export type WcagGrade = "AAA" | "AA" | "AA large" | "fail";

export function grade(ratio: number): WcagGrade {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "fail";
}
