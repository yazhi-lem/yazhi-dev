/** The in-app UI catalogue: chat, Circle, builder chrome, onboarding and
    profile — every chrome string that is not site marketing copy.

    Built on the same `@yazhi/i18n` machinery as the site catalogue:
    `createCatalogues()` compiles each locale with Tamil as its fallback, so
    a missing Hindi line falls back to Tamil rather than to a blank.

    ⚠️ Tamil is a DRAFT pending native review (the site's Tamil cannot simply
    be reused for chrome that never had it); ⚠️ Hindi is a MACHINE DRAFT.
    `docs/i18n/HINDI-REVIEW.md` lists both for a reviewer. */

import { createCatalogues, messagesOf, t as translate } from "../catalogue";
import { LOCALES, type Locale } from "../locale";
import type { Catalogue, CompiledCatalogue, InterpolationParams, TranslationEntry } from "../types";
import { CHAT_STRINGS, type UiTriple } from "./chat";
import { APP_STRINGS } from "./app";

/** Every triple in one table. */
export const UI_STRINGS: Record<string, [string, string, string]> = { ...CHAT_STRINGS, ...APP_STRINGS };

const tripleFor = (key: string): UiTriple | undefined => UI_STRINGS[key];

function triplesToCatalogue(locale: Locale): Catalogue {
  const index = locale === "ta" ? 0 : locale === "en" ? 1 : 2;
  const out: Catalogue = {};
  for (const [key, triple] of Object.entries(UI_STRINGS)) {
    const text = triple[index] ?? triple[1];
    if (!text) continue;
    if (locale === "hi") {
      out[key] = { text, origin: "mt", reviewRequired: true } satisfies TranslationEntry;
    } else {
      out[key] = text;
    }
  }
  return out;
}

/** Locale-segmented chrome catalogue, with Tamil as every locale's fallback. */
export const UI_CATALOGUES: Record<Locale, Catalogue> = Object.fromEntries(
  LOCALES.map((locale) => [locale, triplesToCatalogue(locale)])
) as Record<Locale, Catalogue>;

/** Every locale's compiled chrome catalogue. */
export const UI_SITE: Record<Locale, CompiledCatalogue> = createCatalogues(UI_CATALOGUES);

/** Is a chrome key known (in any locale)? */
export function uiHasKey(key: string): boolean {
  return tripleFor(key) !== undefined;
}

/** Every chrome key, sorted — the extractor compares this with the keys the
    code actually uses. */
export function uiKeys(): string[] {
  return Object.keys(UI_STRINGS).sort();
}

/**
 * Translate a chrome key.
 *
 *   ui("chat.send")                 → the active locale's line
 *   ui("chat.placeholder", "ta")    → Tamil
 *   ui("chat.placeholder", "hi", { agent: "<agent name>" })
 *
 * Unknown keys return the key itself; `{placeholder}` holes are filled and
 * a missing param leaves the hole intact.
 */
export function ui(key: string, locale: Locale = "ta", params?: InterpolationParams): string {
  const compiled = UI_SITE[locale] ?? UI_SITE.ta;
  return translate(compiled, key, params);
}

/** All the chrome for one locale (for tests and the review doc). */
export function uiCatalogue(locale: Locale): Catalogue {
  return messagesOf(UI_SITE[locale] ?? UI_SITE.ta);
}

export type { UiTriple };
export { CHAT_STRINGS, APP_STRINGS };
