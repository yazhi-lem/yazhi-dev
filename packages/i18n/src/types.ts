/** Core types shared by every catalogue.

    Keys are flat, dotted strings (`"site.hero.tagline"`, `"bubble.mission.theme"`)
    — flat keys make "is this key present?" a map lookup, keep diffs readable,
    and let a missing key be reported by name instead of as `[object Object]`. */

import type { Locale } from "./locale";

/** A dotted message key, e.g. `"site.nav.guardian"`. */
export type MessageKey = string;

/** Placeholder names inside a message, e.g. `{name}` → `"name"`. */
export type InterpolationParams = Record<string, string | number>;

/** One catalogued string, with its provenance. */
export type TranslationEntry = {
  /** The translated text, with `{placeholder}` holes. */
  text: string;
  /**
   * Where the text came from:
   *  - `native`   — written by us in that language (Tamil, English today)
   *  - `reviewed` — a draft a native speaker has signed off (safe to ship)
   *  - `ai`       — an AI draft, saved to the translation memory
   *  - `mt`       — machine translation (e.g. an MT provider)
   * `ai` and `mt` are drafts: they must never be served as `reviewed`.
   */
  origin: TranslationOrigin;
  /** `true` while a native speaker still has to check this string. */
  reviewRequired?: boolean;
  /** Note for the reviewer (e.g. "keep the Kural citation verbatim"). */
  note?: string;
};

export type TranslationOrigin = "native" | "reviewed" | "ai" | "mt";

/** What a TM (`/api/translate`) says about a source string. */
export type TranslationLookup = {
  source: string;
  locale: Locale;
  text: string | null;
  origin: "tm" | "reviewed" | null;
};

/** Either a bare string (the common case) or a `TranslationEntry`. */
export type CatalogueValue = string | TranslationEntry;

/** One locale's strings: every used key → its text (or entry). */
export type Catalogue = Record<MessageKey, CatalogueValue>;

/** A locale-segmented catalogue: `{ ta: {...}, en: {...}, hi: {...} }`.
    Missing locales are allowed — lookups fall back to Tamil. */
export type Catalogues = Partial<Record<Locale, Catalogue>>;

/** The shape `createCatalogue` returns: the catalogue plus the locale it
    belongs to, so `t()` can fall back to Tamil without extra arguments.
    `createCatalogue` accepts the loose `Catalogue` (usual) or this compact
    `Messages` object. */
export type Messages = Catalogue;

export type CompiledCatalogue = {
  readonly locale: Locale;
  readonly messages: Catalogue;
  /** Tamil messages used as the second fallback layer. */
  readonly fallback?: Catalogue;
};

/** A namespace prefix used by `useT(namespace)` — `"site."` scopes every
    lookup under `site.`, so callers can pass bare field names. */
export type Namespace = string;
