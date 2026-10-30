/** Grapheme-safe text helpers. A Tamil letter like கு is two code points
    (க + ு); splitting by code point (Array.from, slice, charAt) tears it
    apart. These cut at user-perceived character boundaries instead. */

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

export function graphemes(s: string): string[] {
  if (!segmenter) return Array.from(s);
  return Array.from(segmenter.segment(s), (g) => g.segment);
}

/** The first user-perceived character: "குறள்" → "கு", not "க". */
export function firstGrapheme(s: string, fallback = "•"): string {
  return graphemes(s.trim())[0] ?? fallback;
}

/** At most `n` characters, never splitting a letter; adds "…" when cut. */
export function truncateGraphemes(s: string, n: number): string {
  const g = graphemes(s);
  return g.length > n ? `${g.slice(0, n).join("")}…` : s;
}
