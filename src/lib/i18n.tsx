"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* ============================================================
   Indic-general i18n.

   The old system was hard-wired to Tamil: a three-way
   TAM / ENG / BOTH toggle. This generalizes it to ANY Indic
   language while keeping Tamil first:

   - `indic`  — which Indic language the visitor reads (ta, hi, …)
   - `mode`   — how copy renders:
       "indic" — the chosen Indic language only
       "en"    — English only
       "mixed" — ONE flowing line that code-switches naturally
                 between English and the Indic language, the way
                 bilingual speakers actually talk ("scroll பண்ணுங்க")

   Copy lives in `LText` objects (see below) with per-language
   variants and per-language authored mixed lines. Resolution
   falls back to English when a language isn't translated yet,
   and mixed falls back to the stacked two-line rendering when
   no mixed line has been written for a string.
   ============================================================ */

export type IndicCode =
  | "ta" | "hi" | "bn" | "te" | "mr" | "kn" | "ml" | "gu" | "pa" | "or";

export type LangMode = "indic" | "en" | "mixed";

export interface IndicLanguage {
  code: IndicCode;
  /** Endonym — what speakers call the language. */
  nameNative: string;
  nameEn: string;
  script: string;
  /** Unicode range of the script, for segmenting mixed lines. */
  scriptRange: [number, number];
  /** Native label for the "mixed" mode pill. */
  mixedLabel: string;
  /** True once the site's copy is fully translated for this language. */
  ready: boolean;
}

export const INDIC_LANGUAGES: IndicLanguage[] = [
  { code: "ta", nameNative: "தமிழ்", nameEn: "Tamil", script: "Tamil", scriptRange: [0x0b80, 0x0bff], mixedLabel: "கலவை", ready: true },
  { code: "hi", nameNative: "हिन्दी", nameEn: "Hindi", script: "Devanagari", scriptRange: [0x0900, 0x097f], mixedLabel: "मिश्रित", ready: true },
  { code: "bn", nameNative: "বাংলা", nameEn: "Bengali", script: "Bengali", scriptRange: [0x0980, 0x09ff], mixedLabel: "মিশ্র", ready: false },
  { code: "te", nameNative: "తెలుగు", nameEn: "Telugu", script: "Telugu", scriptRange: [0x0c00, 0x0c7f], mixedLabel: "మిశ్రమం", ready: true },
  { code: "mr", nameNative: "मराठी", nameEn: "Marathi", script: "Devanagari", scriptRange: [0x0900, 0x097f], mixedLabel: "मिश्र", ready: false },
  { code: "kn", nameNative: "ಕನ್ನಡ", nameEn: "Kannada", script: "Kannada", scriptRange: [0x0c80, 0x0cff], mixedLabel: "ಮಿಶ್ರ", ready: false },
  { code: "ml", nameNative: "മലയാളം", nameEn: "Malayalam", script: "Malayalam", scriptRange: [0x0d00, 0x0d7f], mixedLabel: "മിശ്രം", ready: true },
  { code: "gu", nameNative: "ગુજરાતી", nameEn: "Gujarati", script: "Gujarati", scriptRange: [0x0a80, 0x0aff], mixedLabel: "મિશ્ર", ready: false },
  { code: "pa", nameNative: "ਪੰਜਾਬੀ", nameEn: "Punjabi", script: "Gurmukhi", scriptRange: [0x0a00, 0x0a7f], mixedLabel: "ਮਿਸ਼ਰਤ", ready: false },
  { code: "or", nameNative: "ଓଡ଼ିଆ", nameEn: "Odia", script: "Odia", scriptRange: [0x0b00, 0x0b7f], mixedLabel: "ମିଶ୍ର", ready: false },
];

export const getLanguage = (code: IndicCode): IndicLanguage =>
  INDIC_LANGUAGES.find((l) => l.code === code) ?? INDIC_LANGUAGES[0];

/* ---------------- localized copy ---------------- */

/** One piece of site copy. `indic.ta` is required — Tamil is the
    primary voice; every other language is optional and falls back
    to English until its translation lands. `mixed` holds authored
    code-switched lines per language; a string without one falls
    back to the stacked bilingual rendering. */
export interface LText {
  en: string;
  indic: Partial<Record<IndicCode, string>> & { ta: string };
  mixed?: Partial<Record<IndicCode, string>>;
}

/** Shorthand constructor so content files stay readable. */
export const L = (
  en: string,
  indic: Partial<Record<IndicCode, string>> & { ta: string },
  mixed?: Partial<Record<IndicCode, string>>
): LText => ({ en, indic, mixed });

/** Resolve the Indic variant, with English fallback for languages
    whose translation hasn't landed. Returns the BCP-47 lang of what
    was actually resolved so `lang=` attributes stay truthful. */
export function resolveIndic(text: LText, indic: IndicCode): { value: string; lang: string } {
  const v = text.indic[indic];
  return v ? { value: v, lang: indic } : { value: text.en, lang: "en" };
}

/** The authored code-switched line for this language, if one exists. */
export function resolveMixed(text: LText, indic: IndicCode): string | null {
  return text.mixed?.[indic] ?? null;
}

/** Plain-string resolution for aria-labels, tooltips, <title>s. */
export function resolveText(text: LText, mode: LangMode, indic: IndicCode): string {
  if (mode === "en") return text.en;
  if (mode === "indic") return resolveIndic(text, indic).value;
  return resolveMixed(text, indic) ?? `${resolveIndic(text, indic).value} · ${text.en}`;
}

/* ---------------- mixed-line segmentation ----------------
   A mixed line interleaves two scripts. For honest `lang=`
   attributes (screen readers, hyphenation, font rules) we split
   it into runs of the Indic script vs everything else. Neutral
   characters — spaces, punctuation, digits — stick to the run
   they follow. */

export interface MixedSegment {
  text: string;
  lang: string; // IndicCode or "en"
}

export function segmentMixed(line: string, indic: IndicCode): MixedSegment[] {
  const [lo, hi] = getLanguage(indic).scriptRange;
  const isIndic = (ch: string) => {
    const c = ch.codePointAt(0)!;
    return (c >= lo && c <= hi) || c === 0x200c || c === 0x200d; // + ZWNJ/ZWJ
  };
  const isNeutral = (ch: string) => !/\p{Letter}/u.test(ch);

  const segments: MixedSegment[] = [];
  let current = "";
  let currentLang: string | null = null;

  for (const ch of line) {
    const chLang: string | null = isNeutral(ch) ? currentLang : isIndic(ch) ? indic : "en";
    if (currentLang === null || chLang === currentLang || chLang === null) {
      current += ch;
      if (currentLang === null && chLang !== null) currentLang = chLang;
    } else {
      segments.push({ text: current, lang: currentLang });
      current = ch;
      currentLang = chLang;
    }
  }
  if (current) segments.push({ text: current, lang: currentLang ?? "en" });
  return segments;
}

/* ---------------- context ---------------- */

const LangContext = createContext<{
  mode: LangMode;
  indic: IndicCode;
  setMode: (m: LangMode) => void;
  setIndic: (c: IndicCode) => void;
}>({
  mode: "indic",
  indic: "ta",
  setMode: () => {},
  setIndic: () => {},
});

const MODE_KEY = "yazhi-lang-mode";
const INDIC_KEY = "yazhi-lang-indic";
const LEGACY_KEY = "yazhi-lang"; // old three-way toggle: "ta" | "en" | "both"

export function LangProvider({ children }: { children: ReactNode }) {
  // Tamil-first: the site always starts in Tamil; other languages,
  // English, and mixed are opt-in. A returning visitor's saved
  // choice — including one saved by the old toggle — is restored below.
  const [mode, setMode] = useState<LangMode>("indic");
  const [indic, setIndic] = useState<IndicCode>("ta");

  useEffect(() => {
    const savedMode = window.localStorage.getItem(MODE_KEY) as LangMode | null;
    const savedIndic = window.localStorage.getItem(INDIC_KEY) as IndicCode | null;
    if (savedMode === "indic" || savedMode === "en" || savedMode === "mixed") {
      setMode(savedMode);
      if (savedIndic && INDIC_LANGUAGES.some((l) => l.code === savedIndic)) setIndic(savedIndic);
      return;
    }
    // migrate the legacy TAM/ENG/BOTH preference
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy === "ta") setMode("indic");
    else if (legacy === "en") setMode("en");
    else if (legacy === "both") setMode("mixed");
  }, []);

  const persistMode = (m: LangMode) => {
    setMode(m);
    window.localStorage.setItem(MODE_KEY, m);
  };
  const persistIndic = (c: IndicCode) => {
    setIndic(c);
    window.localStorage.setItem(INDIC_KEY, c);
  };

  return (
    <LangContext.Provider value={{ mode, indic, setMode: persistMode, setIndic: persistIndic }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** `const t = useText()` — resolve any LText to a plain string in the
    visitor's current mode + language. For aria-labels and tooltips. */
export function useText() {
  const { mode, indic } = useLang();
  return (text: LText) => resolveText(text, mode, indic);
}
