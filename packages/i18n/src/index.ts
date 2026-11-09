/** `@yazhi/i18n` — the multilingual foundation for yazhi.dev.

    Two ideas, deliberately separate: a **locale** (`ta` | `en` | `hi`) is the
    language a page is in — it drives `lang`, lookups and metadata — and a
    **display preference** (`ta` | `en` | `both`) is how much text is shown
    side by side. Tamil is the default locale and every lookup falls back to
    it. See `README.md` for adding a language in four steps. */

export {
  LOCALES,
  COMPLETE_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  isLocale,
  toBcp47,
  normalizeLocale,
  localeDir,
  localesNeedingReview,
  nextLocale,
  type Locale,
  type LocaleMeta,
} from "./locale";

export type {
  MessageKey,
  InterpolationParams,
  TranslationEntry,
  TranslationOrigin,
  TranslationLookup,
  CatalogueValue,
  Catalogue,
  Catalogues,
  Messages,
  CompiledCatalogue,
  Namespace,
} from "./types";

export {
  PLACEHOLDER,
  PLACEHOLDER_SOURCE,
  createCatalogue,
  createCatalogues,
  isCompiled,
  messagesOf,
  entryText,
  entryOrigin,
  interpolate,
  placeholders,
  t,
  hasKey,
  missingKeys,
  extraKeys,
  keysNeedingReview,
} from "./catalogue";

export {
  DISPLAYS,
  DEFAULT_DISPLAY,
  DISPLAY_NAMES,
  DISPLAY_STORAGE_KEY,
  isDisplay,
  normalizeDisplay,
  nextDisplay,
  displayedLocales,
  type Display,
} from "./display";

export {
  graphemes,
  aksaraCount,
  truncateAkshara,
  sliceAkshara,
  isTamilText,
  isMostlyTamil,
  isDevanagariText,
  scriptLocale,
  joinAkshara,
} from "./tamil";

export {
  TRANSLATE_ENDPOINT,
  MAX_ENTRIES,
  MAX_SOURCE_CHARS,
  lookupTranslation,
  requestTranslations,
  toTranslationEntries,
  type TranslateLookupParams,
  type TranslateEntryInput,
  type TranslateResult,
  type TranslateBatchParams,
  type TranslateBatchOutcome,
} from "./translate";

export { UI, UI_MESSAGES, UI_NAMESPACE, ui, languageName, languageLabel } from "./locales";

export {
  registerSiteCatalogue,
  getSiteCatalogue,
  getRegisteredSiteCatalogue,
} from "./site-catalogue";

export {
  SITE_CATALOGUE,
  taSiteCatalogue,
  enSiteCatalogue,
  hiSiteCatalogue,
  siteCatalogueKeys,
  type SiteKey,
} from "./catalogues";

export {
  UI_STRINGS,
  UI_CATALOGUES,
  UI_SITE,
  ui as appText,
  uiHasKey,
  uiKeys,
  uiCatalogue,
  CHAT_STRINGS,
  APP_STRINGS,
  type UiTriple,
} from "./strings";
