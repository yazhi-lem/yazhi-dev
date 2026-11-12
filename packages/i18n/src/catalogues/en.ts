/** The site catalogue, English — complete, paired 1:1 with the Tamil.

    One line per key, generated from `SITE_PAIRS` (`src/lib/content.ts`).
    Edit the English in `content.ts`, not here. */

import { SITE_PAIRS } from "../../../../src/lib/content";
import type { Catalogue } from "../types";

export const enSiteCatalogue: Catalogue = Object.fromEntries(
  Object.entries(SITE_PAIRS).map(([key, [, en]]) => [key, en])
);
