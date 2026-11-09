/** The display preference — how much text the page shows side by side.

    This is NOT the locale. The site's three-way TAM / ENG / BOTH toggle
    chooses *presentation*: Tamil only, English only, or both lines
    together (today's default, and what the live site ships). The locale
    chooses *language*: which `lang` the page declares and which catalogue
    a lookup uses. A Hindi reader with `display: "both"` gets Tamil +
    English lines; the same reader with `display: "ta"` gets the Tamil line
    only, and in both cases `lang` stays whatever the locale says.

    Keeping the two separate is the contract in
    `docs/team/BOUNDARIES-20261109.md`. */

import type { Locale } from "./locale";

export const DISPLAYS = ["ta", "en", "both"] as const;

/** `"ta"` = Tamil only, `"en"` = English only, `"both"` = Tamil then English. */
export type Display = (typeof DISPLAYS)[number];

/** The site behaves as "both" today; the toggle is opt-out. */
export const DEFAULT_DISPLAY: Display = "both";

export function isDisplay(value: unknown): value is Display {
  return typeof value === "string" && (DISPLAYS as readonly string[]).indexOf(value) !== -1;
}

/** Untrusted value (localStorage) → a Display, or the default. */
export function normalizeDisplay(value: unknown): Display {
  return isDisplay(value) ? value : DEFAULT_DISPLAY;
}

/** The next display in TAM → ENG → BOTH order (the compact toggle). */
export function nextDisplay(display: Display): Display {
  const index = DISPLAYS.indexOf(display);
  return DISPLAYS[(index + 1) % DISPLAYS.length] ?? DEFAULT_DISPLAY;
}

/** Which script languages the current display shows. `"both"` shows Tamil
    and English; the one-option modes show exactly one. */
export function displayedLocales(display: Display): Locale[] {
  if (display === "both") return ["ta", "en"];
  return [display];
}

/** English accessible names for the three display modes — used by the
    toggle's `aria-label`, so screen-reader users hear the *mode*, not the
    script of the button. */
export const DISPLAY_NAMES: Record<Display, string> = {
  ta: "Tamil only",
  en: "English only",
  both: "Tamil and English",
};

/** The localStorage key the choice is persisted under (existing key — do
    not rename, saved preferences depend on it). */
export const DISPLAY_STORAGE_KEY = "yazhi-lang";
