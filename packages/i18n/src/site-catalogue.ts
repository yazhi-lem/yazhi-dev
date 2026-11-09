/** The registered page catalogue — the seam that lets `useT()` resolve
    `site.*` keys without every call site importing the copy.

    `src/lib/content.ts` holds the pairs; `src/catalogues/index.ts` derives
    the per-locale catalogue and registers it here when it loads. The site's
    language provider (`src/lib/i18n.tsx`) imports the catalogue module, so
    registration happens exactly once, before the first render, and works the
    same on the server and in the browser. */

import { DEFAULT_LOCALE, isLocale, type Locale } from "./locale";
import type { Catalogue } from "./types";

let registered: Partial<Record<Locale, Catalogue>> | null = null;

/** Register the site catalogue for every locale it has. Safe to call more
    than once (the latest registration wins — useful in tests). */
export function registerSiteCatalogue(catalogues: Partial<Record<Locale, Catalogue>>): void {
  registered = catalogues;
}

/** The registered catalogue for `locale`, or `null` when nothing has been
    registered (e.g. a component rendered in isolation in a test). */
export function getSiteCatalogue(locale: Locale): Catalogue | null {
  if (!registered) return null;
  return registered[isLocale(locale) ? locale : DEFAULT_LOCALE] ?? registered[DEFAULT_LOCALE] ?? null;
}

/** Every registered locale's catalogue, or `null`. */
export function getRegisteredSiteCatalogue(): Partial<Record<Locale, Catalogue>> | null {
  return registered;
}
