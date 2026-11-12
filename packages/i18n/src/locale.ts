/** Locales — the typed vocabulary the whole multilingual site keys on.

    A *locale* is the language a page is in: it drives `lang`, translation
    lookups and BCP-47 metadata. A *display preference* (Tamil / English /
    both side by side) is a different thing and lives in `./display.ts`.
    Keeping them apart is the contract agreed in
    `docs/team/BOUNDARIES-20261109.md`; do not fold them together again.

    Tamil is the default. It is the spine of the site — every locale falls
    back to Tamil through `catalogue.ts` — and English is the second,
    complete translation. Hindi (`hi`) is present because adding a language
    should be data, not architecture; its copy is machine-drafted until a
    native speaker signs off (`needsNativeReview: true` below). */

export const LOCALES = ["ta", "en", "hi"] as const;

/** The type of a supported locale: `"ta" | "en" | "hi"`. */
export type Locale = (typeof LOCALES)[number];

/** Tamil is the default locale: `lang="ta"`, translations keyed on `ta`. */
export const DEFAULT_LOCALE: Locale = "ta";

/** Languages every catalogue must contain in full (the default plus the
    one language the site ships complete today). */
export const COMPLETE_LOCALES: readonly Locale[] = ["ta", "en"];

export type LocaleMeta = {
  /** The language's own name, as a speaker writes it. */
  nativeName: string;
  /** The English name, for filenames, logs and English UI. */
  englishName: string;
  /** BCP-47 tag written into `<html lang>` and `<html dir>` decisions. */
  bcp47: string;
  /** Script of the writing system (helps font and a11y tooling). */
  script: string;
  dir: "ltr" | "rtl";
  /**
   * `true` when the copy for this locale is a draft that a native speaker
   * still has to review before it ships. `false` means reviewed — or no
   * review needed (English). The dashboard/doc tables read this flag.
   */
  needsNativeReview: boolean;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ta: {
    nativeName: "தமிழ்",
    englishName: "Tamil",
    bcp47: "ta-IN",
    script: "Tamil",
    dir: "ltr",
    // Tamil is the source language: the copy is written by us, not a draft.
    needsNativeReview: false,
  },
  en: {
    nativeName: "English",
    englishName: "English",
    bcp47: "en-IN",
    script: "Latin",
    dir: "ltr",
    needsNativeReview: false,
  },
  hi: {
    nativeName: "हिन्दी",
    englishName: "Hindi",
    bcp47: "hi-IN",
    script: "Devanagari",
    dir: "ltr",
    // DRAFT: Hindi strings are machine-drafted until a native speaker's review.
    needsNativeReview: true,
  },
};

/** Type guard for an arbitrary string (URL params, headers, storage). */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).indexOf(value) !== -1;
}

/** Locale → BCP-47 tag for `lang`/`hreflang` (`ta` → `ta-IN`). Unknown
    input is returned unchanged so callers never crash on bad data. */
export function toBcp47(locale: string): string {
  return isLocale(locale) ? LOCALE_META[locale].bcp47 : locale;
}

/** Narrow an untrusted string to the closest supported locale, or the
    default. `"en-GB"` → `"en"`, `"ta_IN"` → `"ta"`, `"fr"` → `"ta"`. */
export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== "string") return DEFAULT_LOCALE;
  const primary = value.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(primary) ? primary : DEFAULT_LOCALE;
}

/** The direction of a locale's script — for `<html dir>`. */
export function localeDir(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}

/** Locales whose catalogue still needs a native speaker's sign-off. */
export function localesNeedingReview(): Locale[] {
  return LOCALES.filter((l) => LOCALE_META[l].needsNativeReview);
}

/** The next locale in `LOCALES` order (wrapping) — used by the compact
    language toggle, which steps ta → en → hi → ta. */
export function nextLocale(locale: Locale): Locale {
  const index = LOCALES.indexOf(locale);
  return LOCALES[(index + 1) % LOCALES.length] ?? DEFAULT_LOCALE;
}
