/** The site's own UI strings — the locale architecture speaking for itself.

    Only strings that *cannot* come from a page catalogue live here: the
    language switcher's own labels, the names of the languages, and the
    announcement a screen reader makes when the locale changes. Everything
    else (headings, body copy, buttons) belongs to a content catalogue
    (`site.*` in Wave B).

    ⚠️ DRAFTS — the Hindi (`hi`) values in this file are machine-drafted and
    marked `reviewRequired: true`; a native Hindi speaker must review them
    before launch. The Tamil values are ours. */

import { LOCALE_META, type Locale } from "../locale";
import { createCatalogue, createCatalogues, t } from "../catalogue";
import type { Catalogue, CompiledCatalogue } from "../types";

/** Namespace every UI key sits under. */
export const UI_NAMESPACE = "ui";

export const UI_MESSAGES: Partial<Record<Locale, Catalogue>> = {
  ta: {
    "ui.language.name": "மொழி",
    "ui.language.select": "படிக்கும் மொழியைத் தேர்ந்தெடுக்கவும்",
    "ui.language.current": "தற்போதைய மொழி: {language}",
    "ui.language.switchTo": "{language} மொழிக்கு மாற்று",
    "ui.language.label.ta": "தமிழ்",
    "ui.language.label.en": "ஆங்கிலம்",
    "ui.language.label.hi": "இந்தி",
    "ui.display.name": "காட்சி முறை",
    "ui.display.current": "தற்போதைய காட்சி முறை: {mode}",
    "ui.display.switchTo": "{mode} நிலைக்கு மாற்று",
    "ui.display.label.ta": "தமிழ் மட்டும்",
    "ui.display.label.en": "ஆங்கிலம் மட்டும்",
    "ui.display.label.both": "தமிழும் ஆங்கிலமும்",
    "ui.announce.locale": "மொழி {language} ஆக மாறியது",
    "ui.announce.display": "காட்சி முறை {mode} ஆக மாறியது",
  },
  en: {
    "ui.language.name": "Language",
    "ui.language.select": "Choose the language to read in",
    "ui.language.current": "Current language: {language}",
    "ui.language.switchTo": "Switch to {language}",
    "ui.language.label.ta": "Tamil",
    "ui.language.label.en": "English",
    "ui.language.label.hi": "Hindi",
    "ui.display.name": "Display mode",
    "ui.display.current": "Current display mode: {mode}",
    "ui.display.switchTo": "Switch to {mode}",
    "ui.display.label.ta": "Tamil only",
    "ui.display.label.en": "English only",
    "ui.display.label.both": "Tamil and English",
    "ui.announce.locale": "Language changed to {language}",
    "ui.announce.display": "Display mode changed to {mode}",
  },
  // DRAFT — Hindi below is machine-drafted, pending native review.
  hi: {
    "ui.language.name": { text: "भाषा", origin: "ai", reviewRequired: true },
    "ui.language.select": { text: "पढ़ने की भाषा चुनें", origin: "ai", reviewRequired: true },
    "ui.language.current": { text: "वर्तमान भाषा: {language}", origin: "ai", reviewRequired: true },
    "ui.language.switchTo": { text: "{language} पर स्विच करें", origin: "ai", reviewRequired: true },
    "ui.language.label.ta": { text: "तमिल", origin: "ai", reviewRequired: true },
    "ui.language.label.en": { text: "अंग्रेज़ी", origin: "ai", reviewRequired: true },
    "ui.language.label.hi": { text: "हिन्दी", origin: "ai", reviewRequired: true },
    "ui.display.name": { text: "प्रदर्शन मोड", origin: "ai", reviewRequired: true },
    "ui.display.current": { text: "वर्तमान प्रदर्शन मोड: {mode}", origin: "ai", reviewRequired: true },
    "ui.display.switchTo": { text: "{mode} पर स्विच करें", origin: "ai", reviewRequired: true },
    "ui.display.label.ta": { text: "केवल तमिल", origin: "ai", reviewRequired: true },
    "ui.display.label.en": { text: "केवल अंग्रेज़ी", origin: "ai", reviewRequired: true },
    "ui.display.label.both": { text: "तमिल और अंग्रेज़ी", origin: "ai", reviewRequired: true },
    "ui.announce.locale": { text: "भाषा {language} में बदल गई", origin: "ai", reviewRequired: true },
    "ui.announce.display": { text: "प्रदर्शन मोड {mode} में बदल गया", origin: "ai", reviewRequired: true },
  },
};

/** Every locale's compiled UI catalogue; each falls back to Tamil. */
export const UI: Record<Locale, CompiledCatalogue> = createCatalogues(UI_MESSAGES);

/** `ui("language.name")` / `ui("language.select", "hi")` — a bare field is
    prefixed with `ui.`; the lookup falls back to Tamil, then to the key. */
export function ui(
  key: string,
  locale: Locale = "ta",
  params?: Record<string, string | number>
): string {
  const full = key.startsWith(`${UI_NAMESPACE}.`) ? key : `${UI_NAMESPACE}.${key}`;
  const compiled = UI[locale] ?? createCatalogue(UI_MESSAGES.ta ?? {}, locale);
  return t(compiled, full, params);
}

/** The endonym (`தமிழ்`, `English`, `हिन्दी`) — shown in the language menu
    whatever the current locale is. */
export function languageName(locale: Locale): string {
  return LOCALE_META[locale].nativeName;
}

/** The language's name *in a given locale*: English readers see Hindi as
    Hindi (via `ui.language.label.hi`), Tamil readers see Tamil as தமிழ்.
    Falls back to the endonym when the catalogue has no entry. */
export function languageLabel(locale: Locale, inLocale: Locale = locale): string {
  const key = `ui.language.label.${locale}`;
  const compiled = UI[inLocale];
  if (compiled && key in compiled.messages) return t(compiled, key);
  return LOCALE_META[locale].nativeName;
}
