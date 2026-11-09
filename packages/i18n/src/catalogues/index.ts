/** The `site.*` catalogue — every TA/EN pair the site renders, keyed.

    Derived from `src/lib/content.ts` `SITE_PAIRS` at module load. Nothing is
    re-typed here: `SITE_PAIRS` itself is built from the existing exports, so
    the Tamil in this catalogue *is* the Tamil in `content.ts`, pulli and
    combining marks intact, and cannot drift. Edit the copy in
    `src/lib/content.ts` (or its `SITE_PAIRS` block for new keys) — never in
    this file.

    Locale files next door:
      - `ta.ts` / `en.ts`: the pair split by language, for tooling and tests.
      - `hi.ts`: the machine-drafted Hindi, re-exported from
        `src/lib/content.hi.ts` (`origin: "mt"`, `reviewRequired: true`).
*/

import { SITE_PAIRS } from "../../../../src/lib/content";
import { registerSiteCatalogue } from "../site-catalogue";
import type { Catalogue } from "../types";
import { taSiteCatalogue } from "./ta";
import { enSiteCatalogue } from "./en";
import { hiSiteCatalogue } from "./hi";

export { taSiteCatalogue } from "./ta";
export { enSiteCatalogue } from "./en";
export { hiSiteCatalogue } from "./hi";

/** Every `site.*` key in the TA/EN catalogue, sorted. */
export function siteCatalogueKeys(): string[] {
  return Object.keys(SITE_PAIRS).sort();
}

export type SiteKey = string;

/** `{ ta, en, hi }` — the site catalogue every locale-compiled lookup reads. */
export const SITE_CATALOGUE: Record<"ta" | "en" | "hi", Catalogue> = {
  ta: taSiteCatalogue,
  en: enSiteCatalogue,
  hi: hiSiteCatalogue,
};

/* Hand the page catalogue to `useT()` (src/lib/i18n.tsx → <LangProvider>),
   so a `messageKey="site.…"` in any component resolves to the translated
   line for the active locale. Importing this module is what registers it. */
registerSiteCatalogue(SITE_CATALOGUE);
