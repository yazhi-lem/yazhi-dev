/** The site catalogue, Hindi — MACHINE-DRAFTED (`origin: "mt"`,
    `reviewRequired: true` on every entry), pending a native speaker's review.

    The drafts live in `src/lib/content.hi.ts`, next to the TA/EN source they
    are drafted from, so a reviewer reads both side by side. Nothing here is
    served as `reviewed` until that review happens; see
    `docs/i18n/HINDI-REVIEW.md`. */

import { HI_SITE } from "../../../../src/lib/content.hi";
import type { Catalogue, TranslationEntry } from "../types";

export const hiSiteCatalogue: Catalogue = Object.fromEntries(
  Object.entries(HI_SITE).map(([key, entry]) => [key, { ...(entry as TranslationEntry) }])
);
