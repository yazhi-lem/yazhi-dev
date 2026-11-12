/** Grapheme-safe Tamil text helpers.

    Tamil is written in akshara (அக்ஷர): an *uyir* vowel, or a *mei* consonant
    carrying a pulli (்), or an *uyirmei* consonant + vowel sign, plus the
    *aytham* (ஃ). A single character such as `கொ` is **two UTF-16 code units**
    and a ligature like `க்ஷ` is more still, so `str.length` and `str.slice`
    count and cut in the wrong place. Everything here goes through
    `Intl.Segmenter` with `granularity: "grapheme"`, so one step is one
    visible Tamil unit — the ecosystem rule in the root `CLAUDE.md` §6.

    `Intl.Segmenter` is ECMA-402 and present in Node 16+ and every browser
    the site supports. There is a deliberately simple `Array.from` fallback
    for exotic runtimes — it is code-point safe but not grapheme safe, so it
    is only used when no segmenter exists at all. */

type SegmenterLike = {
  segment(input: string): Iterable<{ segment: string }>;
};

type SegmenterCtor = new (locales?: string | string[], options?: { granularity?: "grapheme" | "word" | "sentence" }) => SegmenterLike;

let cached: SegmenterLike | null | undefined;

function segmenter(): SegmenterLike | null {
  if (cached !== undefined) return cached;
  const ctor = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;
  cached = typeof ctor === "function" ? new ctor("ta", { granularity: "grapheme" }) : null;
  return cached;
}

/** Split text into grapheme clusters — one akshara per element for Tamil.
    Never use `str.split("")` on Indic text; use this. */
export function graphemes(text: string): string[] {
  if (!text) return [];
  const seg = segmenter();
  if (!seg) return Array.from(text);
  const out: string[] = [];
  for (const part of seg.segment(text)) out.push(part.segment);
  return out;
}

/** Count grapheme clusters (akshara for Tamil). `string length` is the
    wrong unit: "யாழி".length is 4, but it is 3 akshara. */
export function aksaraCount(text: string): number {
  return graphemes(text).length;
}

/** The first `count` akshara of `text`, with an optional ellipsis. Cuts
    between akshara, never between a base and its vowel sign. */
export function truncateAkshara(text: string, count: number, ellipsis = "…"): string {
  if (count <= 0) return "";
  const parts = graphemes(text);
  if (parts.length <= count) return text;
  return parts.slice(0, count).join("") + ellipsis;
}

/** Grapheme-safe `slice(start, end)` for Indic text. Negative indexes
    count from the end, like `String.prototype.slice`. */
export function sliceAkshara(text: string, start: number, end?: number): string {
  const parts = graphemes(text);
  return parts.slice(start, end).join("");
}

/** Tamil letters (uyir, mei pulli, uyirmei, aytham) and the marks that
    attach to them: U+0B80–U+0BFF plus the ZWJ/ZWNJ ligature joiners. */
const TAMIL_RE = /[\u0B80-\u0BFF\u200C\u200D]/u;
const TAMIL_LETTER_RE = /[\u0B80-\u0BFF]/u;
const LATIN_LETTER_RE = /[A-Za-z]/;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;

/** Does this text contain Tamil at all? */
export function isTamilText(text: string): boolean {
  return TAMIL_RE.test(text);
}

/** Is this text *mostly* Tamil (Tamil letters outnumber Latin letters)?
    Blank text is not Tamil. */
export function isMostlyTamil(text: string): boolean {
  if (!text) return false;
  let tamil = 0;
  let latin = 0;
  for (const part of graphemes(text)) {
    if (TAMIL_LETTER_RE.test(part)) tamil += 1;
    else if (LATIN_LETTER_RE.test(part)) latin += 1;
  }
  return tamil > 0 && tamil >= latin;
}

/** The BCP-47 primary language of a piece of text, as far as we can tell
    from its script: `"ta"`, `"hi"` (Devanagari), or `null` (e.g. English).
    Used to put the right `lang` attribute on a line of mixed copy. */
export function scriptLocale(text: string): "ta" | "hi" | null {
  if (TAMIL_LETTER_RE.test(text)) return "ta";
  if (DEVANAGARI_RE.test(text)) return "hi";
  return null;
}

/** Does this text contain Devanagari (the script Hindi is written in)? */
export function isDevanagariText(text: string): boolean {
  return DEVANAGARI_RE.test(text);
}

/** Join two pieces of prose with a grapheme-safe separator, e.g. Tamil and
    English lines in the "both" display mode. */
export function joinAkshara(parts: string[], separator = " · "): string {
  return parts.filter(Boolean).join(separator);
}
