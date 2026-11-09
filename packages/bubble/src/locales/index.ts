"use client";
/** `@yazhi/bubble`'s own copy, in every locale the site supports.

    This module is the library's second half of the multilingual story. The
    site's chrome catalogue (`packages/i18n/src/strings`) covers the pages
    that *host* bubbles; this one covers the words *inside* the library:
    components, modules, page templates, Mission Control, the yazh sound
    button, and the tinai words that change with the language.

    Two rules shape the API:

    1. **No `@/lib/*` import.** `src/lib/chat/agents.ts` imports this
       package, so a library that reached back into `src/lib` would form a
       cycle. Locale therefore arrives as a prop (`locale`, `display`) or
       through `<BubbleLocaleScope>` — never through the site's hook. The
       package also runs standalone (design book, docs, tests), where there
       is no scope at all; there it answers in Tamil with English as the
       fallback, which is what `createCatalogue`'s fallback chain gives us.
    2. **Every component keeps its existing props as overrides.** A prop the
       caller passes always wins over the catalogue, and the English
       rendering is unchanged when no scope is present.

    Shell usage, once, high in the tree:

      // in the app (src/components/…, "use client")
      const { locale } = useLocale();
      const { lang: display } = useLang();
      return <BubbleLocaleScope locale={locale} display={display}>…</BubbleLocaleScope>;

    and inside a bubble component:

      const t = useBubbleT("bubble.composer");
      <Composer placeholder={t("placeholder")} sendLabel={t("send")} /> */
import { createContext, createElement, useContext, useMemo, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  aksaraCount,
  createCatalogues,
  interpolate,
  isLocale,
  placeholders,
  t as translate,
  type Catalogue,
  type CompiledCatalogue,
  type InterpolationParams,
  type Locale,
} from "@yazhi/i18n";
import { taBubbleCatalogue } from "./ta";
import { enBubbleCatalogue } from "./en";
import { hiBubbleCatalogue } from "./hi";

export { taBubbleCatalogue, enBubbleCatalogue, hiBubbleCatalogue };

/** The namespace every key in this catalogue sits under. */
export const BUBBLE_NAMESPACE = "bubble";

/** How much text a bubble shows when it has the choice: the display
    preference the site already uses (`packages/i18n` → `Display`). Declared
    structurally so this package never has to import the site's hook. */
export type BubbleDisplay = "ta" | "en" | "both";

/** Every locale's messages, each falling back to Tamil. */
export const BUBBLE_CATALOGUES: Record<Locale, Catalogue> = {
  ta: taBubbleCatalogue,
  en: enBubbleCatalogue,
  hi: hiBubbleCatalogue,
};

/** Every locale's compiled catalogue; a missing Hindi line falls back to
    Tamil rather than to a blank. This is the object `BUBBLE_CATALOGUE` is
    named for in the task brief; the per-locale messages are
    `BUBBLE_CATALOGUES` above. */
export const BUBBLE_CATALOGUE: Record<Locale, CompiledCatalogue> = createCatalogues(BUBBLE_CATALOGUES);

/** Every key in the library's catalogue, sorted — the extractor's list and
    the reviewer's to-do list both read it. */
export function bubbleCatalogueKeys(): string[] {
  return Object.keys(taBubbleCatalogue).sort();
}

/** Translate one key in one locale, outside React (plain `.ts` data files,
    server code, tests). Same fallback order as `t()`: locale → Tamil → key.

      bubbleT("bubble.composer.send", "ta")   → "அனுப்பு"
      bubbleT("bubble.mission.close", "hi", { title: "…" }) */
export function bubbleT(
  key: string,
  locale: Locale = DEFAULT_LOCALE,
  params?: InterpolationParams
): string {
  const compiled = BUBBLE_CATALOGUE[locale] ?? BUBBLE_CATALOGUE[DEFAULT_LOCALE];
  return translate(compiled, key, params);
}

/** The lookup function a bubble component calls. `key` is prefixed with the
    namespace (a trailing dot is added) unless it already carries it. */
export type BubbleTranslate = (key: string, params?: InterpolationParams) => string;

/* ------------------------------------------------------------ provider */

export type BubbleLocaleValue = {
  /** the language bubble copy is read in */
  locale: Locale;
  /** display preference — `"both"` shows Tamil beside English where a
      component renders a label pair */
  display: BubbleDisplay;
};

export type BubbleLocaleScopeProps = {
  /** the active locale; anything unrecognised resolves to Tamil rather
      than throwing, because the scope is also fed from untrusted cookies */
  locale?: Locale | string;
  /** defaults to `"both"`, the site's default display preference */
  display?: BubbleDisplay;
  children: ReactNode;
};

const DEFAULT_SCOPE: BubbleLocaleValue = { locale: DEFAULT_LOCALE, display: "both" };

/* `null` — not the default — so `useBubbleLocale()` can tell "inside a
   scope" from "standalone". Both answer the same, but only the hook path
   subscribes to context, which keeps components that need no scope
   (server components, the design book) free of a client boundary they
   would otherwise inherit. */
const BubbleLocaleContext = createContext<BubbleLocaleValue | null>(null);

/**
 * Puts every Bubble UI component below it in one locale.
 *
 * `locale` is a plain prop, not an import from `@/lib/i18n`: the package
 * must not depend on the app (see the module comment). The app passes
 * `useLocale().locale`; a host that is not the site passes anything it
 * likes, and a missing or unknown value answers in Tamil with English as
 * the fallback.
 */
export function BubbleLocaleScope({ locale, display = "both", children }: BubbleLocaleScopeProps) {
  const value = useMemo<BubbleLocaleValue>(
    () => ({ locale: isLocale(locale) ? locale : DEFAULT_LOCALE, display: normalizeBubbleDisplay(display) }),
    [locale, display]
  );
  return createElement(BubbleLocaleContext.Provider, { value }, children);
}

/** The scope's value, or the standalone default (Tamil, `both`) outside one. */
export function useBubbleLocale(): BubbleLocaleValue {
  return useContext(BubbleLocaleContext) ?? DEFAULT_SCOPE;
}

/**
 * The translator every bubble component uses.
 *
 * @param namespace optional key prefix, e.g. `"bubble.composer"` — with it,
 *   `t("send")` reads `bubble.composer.send`; without it, pass full keys.
 *
 * Lookup order is the catalogue's own: locale → Tamil → the key itself, so
 * an untranslated label degrades to a readable key, never to a blank.
 */
export function useBubbleT(namespace?: string): BubbleTranslate {
  const { locale } = useBubbleLocale();
  return useMemo<BubbleTranslate>(() => {
    const prefix = namespace ? (namespace.endsWith(".") ? namespace : `${namespace}.`) : "";
    return (key, params) => {
      const full = prefix && !key.startsWith(prefix) ? `${prefix}${key}` : key;
      return bubbleT(full, locale, params);
    };
  }, [locale, namespace]);
}

/* ------------------------------------------------------------- helpers */

function normalizeBubbleDisplay(value: unknown): BubbleDisplay {
  return value === "ta" || value === "en" || value === "both" ? value : "both";
}

/**
 * A locale-aware "Tamil · English" label pair for the places the library
 * shows both at once (the machine-draft and sample-data tags, which are
 * deliberately Tamil-first). English shows English, Tamil shows Tamil, and
 * the standalone default (`both`) is exactly today's rendering.
 */
export function bubbleLabelPair(
  ta: string,
  en: string,
  display: BubbleDisplay = "both"
): { ta: string; en: string; text: string; separator: string } {
  const separator = display === "both" ? " · " : "";
  if (display === "ta") return { ta, en: "", text: ta, separator };
  if (display === "en") return { ta: "", en, text: en, separator };
  return { ta, en, text: `${ta} · ${en}`, separator };
}

/** Fill `{holes}` in a message the caller already holds — for data files
    that carry their own copy (an agent greeting with a `{name}` hole) and
    never go through a catalogue. */
export function fillBubbleMessage(message: string, params?: InterpolationParams): string {
  return interpolate(message, params);
}

export { placeholders, aksaraCount };
