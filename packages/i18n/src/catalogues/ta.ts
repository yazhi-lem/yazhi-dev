/** The site catalogue, Tamil — the source language.

    One line per key, generated from `SITE_PAIRS` (`src/lib/content.ts`).
    Do not edit the copy here: Tamil lives in `content.ts` so the site, the
    JSON/a11y layers and this catalogue can never disagree. */

import { SITE_PAIRS } from "../../../../src/lib/content";
import type { Catalogue } from "../types";

export const taSiteCatalogue: Catalogue = Object.fromEntries(
  Object.entries(SITE_PAIRS).map(([key, [ta]]) => [key, ta])
);
