/** Reading site copy by key, for the locale the reader is in.

    `src/lib/content.ts` holds the TA/EN pairs (`SITE_PAIRS`); this module
    turns a key into a string for a locale: `ta` → the Tamil line, `en` →
    the English line, any other locale → the Hindi draft from
    `content.hi.ts`, falling back to the English line when the draft is
    missing. `listingTerms: true` gives the bilingual signal for list items
    (see below).

    This module is deliberately **client-safe**: no `server-only`, no
    `next/headers`, no secrets. Server components can call `siteCopy()`
    directly; client components get the locale from the provider and re-read
    on a locale change.
*/

import { DEFAULT_LOCALE, interpolate, isLocale, type InterpolationParams, type Locale } from "@yazhi/i18n";
import { SITE_PAIRS } from "./content";
import { HI_SITE } from "./content.hi";

export type SiteCopyOptions = {
  /**
   * `true` when the key names a *listed item* — a repository, a language, a
   * question / starting prompt, a cited language row. Such items keep the
   * signal that they are each written in their own language (`things`,
   * `தமிழ்`, `How many letters does Tamil have?`) instead of being flattened
   * into one language, and the active display preference then applies.
   */
  listingTerms?: boolean;
  /**
   * Force one language for this lookup — `{ language: "en" }` for the line
   * that must stay English in every locale (e.g. the Latin second line of
   * the hero headline, which is the site's own bilingual signature).
   */
  language?: Locale;
};

function pair(key: string): [string, string] | undefined {
  return SITE_PAIRS[key];
}

/** Does a `site.` key exist in the TA/EN catalogue? */
export function siteHasKey(key: string): boolean {
  return pair(key) !== undefined;
}

/** Every key in the site catalogue, sorted. */
export function siteKeys(): string[] {
  return Object.keys(SITE_PAIRS).sort();
}

/** The site copy for `key` in `locale`, interpolated with `params`.
    Unknown keys return the key itself (visible in development, harmless in
    production) — never `""`, never a throw. */
export function siteCopy(locale: Locale): (key: string, params?: InterpolationParams, options?: SiteCopyOptions) => string {
  return (key, params, options) => {
    const text = siteText(key, locale, options);
    return params ? interpolate(text, params) : text;
  };
}

/** One-off lookup — same rules as `siteCopy(locale)(key)`. */
export function siteText(key: string, locale: Locale, options?: SiteCopyOptions): string {
  const requested = options?.language ?? locale;
  const active: Locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  if (options?.listingTerms) return listingText(key, active);

  const source = pair(key);
  if (!source) return key;

  if (active === "ta") return source[0];
  if (active === "en") return source[1];

  // Any other locale: the draft line when there is one, else English.
  const draft = HI_SITE[key];
  if (draft && draft.text) return draft.text;
  return source[1];
}

/** List items: a bilingual signal in `ta`/`en`, the locale's own line
    otherwise. The display preference (`lang`) decides ta/en/both — exactly
    the rule the site's TAM/ENG/BOTH toggle has always applied to lists. */
function listingText(key: string, locale: Locale): string {
  const source = pair(key);
  if (!source) return key;
  // Tamil is the source language of every list on the site: each item is
  // shown in Tamil (with its English gloss beside it under "both").
  if (locale === "ta") return source[0];
  if (locale === "en") return source[1];
  const draft = HI_SITE[key];
  return draft?.text || source[1];
}
