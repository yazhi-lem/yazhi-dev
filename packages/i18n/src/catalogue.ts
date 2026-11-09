/** Catalogues and lookups.

    Fallback order for every lookup is **locale → Tamil → the key itself**.
    Returning the key (not `""`, not a throw) keeps a missing translation
    visible in development and harmless in production — an untranslated
    label degrades to a readable key, never to a blank button.

    Tamil is the second layer because it is the source language: a Hindi
    draft may be absent, but the Tamil line always exists. */

import { DEFAULT_LOCALE, isLocale, normalizeLocale, type Locale } from "./locale";
import type {
  Catalogue,
  CatalogueValue,
  CompiledCatalogue,
  InterpolationParams,
  MessageKey,
  TranslationEntry,
  TranslationOrigin,
} from "./types";

/** The `{name}` placeholder syntax, once — imported elsewhere too.
    A fresh instance per use: a `/g` regex is stateful under `test()`/`exec()`,
    so `replace` and `matchAll` each get their own copy. */
export const PLACEHOLDER_SOURCE = "\\{([a-zA-Z_][a-zA-Z0-9_]*)\\}";
export const PLACEHOLDER = new RegExp(PLACEHOLDER_SOURCE, "g");

/** Wrap a locale's messages into a compiled catalogue. A string entry is
    treated as origin `""`/unknown-provenance native copy; pass
    `{ origin: "mt", reviewRequired: true }` for machine drafts.

    `fallback` defaults to the `tamil` messages given here (see
    `createCatalogues` for the usual multi-locale wiring). */
export function createCatalogue(
  messages: Catalogue,
  locale: Locale = DEFAULT_LOCALE,
  fallback?: Catalogue
): CompiledCatalogue {
  return { locale, messages, fallback };
}

/** Build every locale's compiled catalogue from one segmented object, so
    each locale falls back to the Tamil catalogue automatically. */
export function createCatalogues(
  catalogues: Partial<Record<Locale, Catalogue>>
): Record<Locale, CompiledCatalogue> {
  const tamil = catalogues[DEFAULT_LOCALE] ?? {};
  const out = {} as Record<Locale, CompiledCatalogue>;
  for (const [key, messages] of Object.entries(catalogues)) {
    if (!isLocale(key)) continue;
    out[key] = createCatalogue(messages ?? {}, key, tamil);
  }
  return out;
}

/** The raw text of a catalogue value (no interpolation). */
export function entryText(value: CatalogueValue | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value.text === "string") return value.text;
  return undefined;
}

/** The provenance of a catalogue value; bare strings are `"native"`. */
export function entryOrigin(value: CatalogueValue | undefined): TranslationOrigin | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return "native";
  return value.origin;
}

/** Is this the object `createCatalogue` returns (as opposed to a bare map)? */
export function isCompiled(cat: CompiledCatalogue | Catalogue | undefined): cat is CompiledCatalogue {
  return !!cat && typeof cat === "object" && "messages" in cat && "locale" in cat;
}

/** The plain messages of a compiled catalogue or a bare catalogue. */
export function messagesOf(cat: CompiledCatalogue | Catalogue | undefined): Catalogue {
  if (!cat) return {};
  return isCompiled(cat) ? cat.messages : cat;
}

/** Fill `{name}` holes. A param that was not supplied leaves its
    placeholder intact — never `undefined`, never a throw — so a caller that
    forgets `{count}` sees the hole in the UI rather than a crash. */
export function interpolate(template: string, params?: InterpolationParams): string {
  if (!params) return template;
  return template.replace(new RegExp(PLACEHOLDER_SOURCE, "g"), (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole
  );
}

/** The placeholder names used by a message, sorted — used by the
    "same placeholders across locales" test and by the review table. */
export function placeholders(message: string): string[] {
  const out = new Set<string>();
  for (const match of message.matchAll(new RegExp(PLACEHOLDER_SOURCE, "g"))) out.add(match[1]);
  return [...out].sort();
}

/**
 * `t` — look up one key and interpolate it.
 *
 * Lookup order: the catalogue's locale → its Tamil fallback catalogue →
 * `key` (returned verbatim). `cat` is what `createCatalogue` returns, so
 * the locale travels with the messages.
 */
export function t(
  cat: CompiledCatalogue | Catalogue | undefined,
  key: MessageKey,
  params?: InterpolationParams
): string {
  if (!cat) return key;
  const compiled: CompiledCatalogue = isCompiled(cat)
    ? cat
    : { locale: DEFAULT_LOCALE, messages: cat };

  const own = entryText(compiled.messages[key]);
  if (own !== undefined && own !== "") return interpolate(own, params);

  const fallback = entryText(compiled.fallback?.[key]);
  if (fallback !== undefined && fallback !== "") return interpolate(fallback, params);

  return key;
}

/** Is the key present with non-empty text in this catalogue (own locale
    only — a Tamil fallback does not count as "has it")? */
export function hasKey(cat: CompiledCatalogue | Catalogue | undefined, key: MessageKey): boolean {
  if (!cat) return false;
  const messages = messagesOf(cat);
  const text = entryText(messages[key]);
  return text !== undefined && text !== "";
}

/** Keys present in `cat` but missing (or empty) in `other`. This is the
    migration tool: `missingKeys(tamil, hindi)` is the reviewer's to-do list. */
export function missingKeys(
  cat: CompiledCatalogue | Catalogue | undefined,
  other: CompiledCatalogue | Catalogue | undefined
): MessageKey[] {
  if (!cat) return [];
  const a = messagesOf(cat);
  const b = messagesOf(other);
  return Object.keys(a)
    .filter((key) => {
      const target = entryText(b[key]);
      return target === undefined || target === "";
    })
    .sort();
}

/** Keys `other` has that `cat` does not — the reverse report (stale keys). */
export function extraKeys(
  cat: CompiledCatalogue | Catalogue | undefined,
  other: CompiledCatalogue | Catalogue | undefined
): MessageKey[] {
  return missingKeys(other, cat);
}

/** Every automation-drafted (unreviewed) key in a catalogue: the list a
    native reviewer works through. */
export function keysNeedingReview(cat: CompiledCatalogue | Catalogue | undefined): MessageKey[] {
  if (!cat) return [];
  const messages = messagesOf(cat);
  return Object.keys(messages)
    .filter((key) => {
      const value = messages[key];
      if (!value || typeof value === "string") return false;
      const entry = value as TranslationEntry;
      if (entry.origin === "native" || entry.origin === "reviewed") return false;
      return entry.reviewRequired !== false;
    })
    .sort();
}

/** Re-key an arbitrary locale string onto the supported set. */
export { normalizeLocale };
