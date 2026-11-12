"use client";
/** The site's client-side language state.

    Two preferences, deliberately separate (see
    `packages/i18n/README.md`):

      - **Display** (`lang` here, kept for every existing caller): the
        TAM / ENG / BOTH toggle — how much text is shown side by side.
        Persisted under localStorage `yazhi-lang`, default `"both"`.
      - **Locale** (`useLocale()`): the *language* the page is in — `ta`,
        `en` or `hi`. It decides which catalogue a lookup reads and which
        `lang` attribute text carries. Resolved at mount from `<html lang>`,
        then localStorage `yazhi-locale`, then `DEFAULT_LOCALE` (`ta`).

    Backwards compatibility is a hard requirement: `useLang()` keeps its
    exact `{ lang, setLang }` shape, so Navbar, Hero, Sections, VoiceMic and
    the rest compile and behave unchanged. `useLocale()` and `useT()` are
    additive.

    Never read `window` during render — the server and the first client
    render must produce identical markup. A preference the reader saved is
    therefore read through `useSyncExternalStore`, whose *server* snapshot is
    the value the HTML was rendered with: the hydrating render matches the
    server exactly, and React re-renders once when the saved value differs. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
// Importing the catalogue registers the page copy in @yazhi/i18n, so a
// `messageKey="site.…"` in any component resolves through `useT()`.
import "@yazhi/i18n/catalogues";
import {
  DEFAULT_DISPLAY,
  DEFAULT_LOCALE,
  createCatalogue,
  isDisplay,
  getRegisteredSiteCatalogue,
  isLocale,
  nextDisplay,
  t as translate,
  type CompiledCatalogue,
  type Display,
  type InterpolationParams,
  type Locale,
} from "@yazhi/i18n";
import type { Catalogue } from "@yazhi/i18n";
// The Bubble UI library owns its own copy (`@yazhi/bubble/locales`); this
// scope is the one place the site tells it which language to answer in. It
// takes plain props rather than reading this hook, so the library keeps
// working standalone (design book, tests, an embedding host).
import { BubbleLocaleScope } from "@yazhi/bubble/locales";
import { localeFromCookieString, serializeLocaleCookie } from "./locale-cookie";
import { siteCopy, type SiteCopyOptions } from "./site-copy";
import { ui as chromeCopy } from "@yazhi/i18n";

/**
 * The display preference. Unchanged public type: the live site's
 * TAM / ENG / BOTH toggle is `"ta" | "en" | "both"` and stays that way.
 */
export type Lang = "ta" | "en" | "both";

const DISPLAY_STORAGE_KEY = "yazhi-lang";
const LOCALE_STORAGE_KEY = "yazhi-locale";

/** The lookup function `useT()` returns. `key` is looked up as
    `namespace + key` unless it already starts with the namespace. */
export type TranslateFn = (key: string, params?: InterpolationParams) => string;

export type LocaleContextValue = {
  /** The active locale — drives catalogue lookups and `lang` attributes. */
  locale: Locale;
  /** Change the locale: updates state, localStorage and `<html lang>`. */
  setLocale: (locale: Locale) => void;
};

type LangContextValue = {
  /** Display preference — unchanged since before the locale split. */
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Active locale (same value as `useLocale().locale`). */
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** The site catalogue for the active locale, or `null` while none is
      loaded (Wave B supplies it — until then `useT()` returns keys). */
  catalogue: CompiledCatalogue | null;
};

/* `null` default: calling a hook outside the provider is a programming
   error we can name, not a silent "Tamil, always". */
const LangContext = createContext<LangContextValue | null>(null);

function storedLocale(): Locale | null {
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
    // The cookie the server layout read is a mirror of localStorage; either
    // can be missing (blocked storage, cleared cookies).
    return localeFromCookieString(document.cookie);
  } catch {
    // localStorage can throw in private modes / sandboxed frames.
    return null;
  }
}

function storedDisplay(): Lang | null {
  try {
    const saved = window.localStorage.getItem(DISPLAY_STORAGE_KEY);
    return isDisplay(saved) ? saved : null;
  } catch {
    return null;
  }
}

/* The two saved preferences are an external store React can read without a
   hydration mismatch. `useSyncExternalStore` takes a *server snapshot* for
   the hydrating render (no saved value — the HTML was rendered without one)
   and the client snapshot afterwards; React re-renders once if they differ.
   Nothing pushes changes from outside this provider (the switcher writes
   through `setLocale`), so the subscriber is a no-op. */

const noSubscribe = () => () => {};
/** no saved preference on the server (or during the hydrating render) */
const noSavedPreference = () => null;
const savedDisplaySnapshot = (): Lang | null => storedDisplay();
const savedLocaleSnapshot = (): Locale | null => storedLocale();

function store(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // preference simply does not persist
  }
}

/* An in-page bus for locale changes, so every provider on the page agrees on
   the language without a page reload. Deliberately module state, not
   `window`: it is client-only, touched from callbacks, and never read
   during render. */

type LocaleListener = (locale: Locale) => void;
const localeListeners = new Set<LocaleListener>();
/** The last announced locale — a provider that mounts after a change (e.g.
    a layout mounted by client-side navigation) reads it at mount. */
let announcedLocale: Locale | null = null;

function announceLocale(locale: Locale) {
  announcedLocale = locale;
  for (const listener of localeListeners) listener(locale);
}

function subscribeToLocale(listener: LocaleListener): () => void {
  localeListeners.add(listener);
  if (announcedLocale) listener(announcedLocale);
  return () => {
    localeListeners.delete(listener);
  };
}

/** The site catalogue Wave B registers with the provider. `catalogues` maps
    a locale to its messages; the provider compiles them with Tamil as the
    fallback, so a missing Hindi key falls back to the Tamil line. */
export type SiteCatalogues = Partial<Record<Locale, Catalogue>>;

export function LangProvider({
  children,
  catalogues,
  initialLocale,
  initialDisplay,
}: {
  children: ReactNode;
  /** Optional: the site's catalogues (`site.*`). Absent in Wave A, so
      `useT()` returns the key itself — nothing crashes. */
  catalogues?: SiteCatalogues;
  /** The locale the server rendered this page in — the root layout reads the
      `yazhi-locale` cookie and passes it here. The first client render must
      use the same value or React tears the tree down with a hydration
      mismatch (error #418) and rebuilds it, which is exactly what a
      server-rendered English page must not do. */
  initialLocale?: Locale;
  /** Display preference, when a host knows it server-side (it normally does
      not: TAM/ENG/BOTH lives in localStorage). */
  initialDisplay?: Lang;
}) {
  // A value this provider changed in this page's lifetime (the switcher),
  // or `null` to follow the saved preference and then the server's.
  const [displayOverride, setDisplayOverride] = useState<Lang | null>(null);
  const [localeOverride, setLocaleOverride] = useState<Locale | null>(null);

  // Saved preferences: absent during the hydrating render (so the markup is
  // the server's), present in the render React does once hydration is done.
  const savedDisplay = useSyncExternalStore<Lang | null>(noSubscribe, savedDisplaySnapshot, noSavedPreference);
  const savedLocale = useSyncExternalStore<Locale | null>(noSubscribe, savedLocaleSnapshot, noSavedPreference);

  // Precedence: what this page set → what the reader saved → what the server
  // rendered → the default. A saved value never contradicts the HTML the
  // server produced, because the locale the server used came from the same
  // preference (the cookie mirror, `initialLocale`).
  const lang = displayOverride ?? savedDisplay ?? initialDisplay ?? DEFAULT_DISPLAY;
  const locale = localeOverride ?? savedLocale ?? initialLocale ?? DEFAULT_LOCALE;

  // A locale change announced from anywhere on the page (the switcher in a
  // sibling tree, a second provider) lands here as an external event.
  useEffect(
    () =>
      subscribeToLocale((next) => {
        setLocaleOverride((current) => (current === next ? current : next));
      }),
    []
  );

  const setLang = useCallback((l: Lang) => {
    setDisplayOverride(l);
    store(DISPLAY_STORAGE_KEY, l);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleOverride(next);
    store(LOCALE_STORAGE_KEY, next);
    // Keep the document language honest for screen readers and CSS
    // `:lang()` selectors, and for the server layout on the next request
    // (locale-cookie.ts writes the matching cookie).
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      // Persist the mirror the server layout reads (locale-cookie.ts).
      document.cookie = serializeLocaleCookie(next);
      announceLocale(next);
    }
  }, []);

  // The catalogue only changes when the locale (or an explicitly passed
  // catalogue) changes. With no prop, the registered site catalogue is used.
  const catalogue = useMemo<CompiledCatalogue | null>(() => {
    const source = catalogues ?? getRegisteredSiteCatalogue() ?? undefined;
    if (!source) return null;
    const messages = source[locale] ?? source[DEFAULT_LOCALE];
    if (!messages) return null;
    return createCatalogue(messages, locale, source[DEFAULT_LOCALE]);
  }, [catalogues, locale]);

  // One context value, memoised: a display change does not remount children,
  // and consumers below only re-render when something they read changed.
  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, locale, setLocale, catalogue }),
    [lang, setLang, locale, setLocale, catalogue]
  );

  // Every bubble (the `/app` canvas, `/chat`, the design book previews) reads
  // the library catalogue through this scope. Both values start at the SSR
  // defaults — Tamil and `"both"` — which are exactly the library's own
  // standalone defaults, so the served HTML does not shift after hydration.
  return (
    <LangContext.Provider value={value}>
      <BubbleLocaleScope locale={locale} display={lang}>
        {children}
      </BubbleLocaleScope>
    </LangContext.Provider>
  );
}

function useLangContext(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang/useLocale/useT must be used inside <LangProvider> (src/app/layout.tsx).");
  }
  return ctx;
}

/** Display preference — **unchanged public shape** `{ lang, setLang }`.
    Existing callers keep working untouched. */
export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const { lang, setLang } = useLangContext();
  return { lang, setLang };
}

/** The locale — the language the page is in. Additive. Like `useLang()`,
    it must run inside `<LangProvider>`; outside one it throws a named error
    rather than silently falling back to a locale the page is not in. */
export function useLocale(): LocaleContextValue {
  const { locale, setLocale } = useLangContext();
  return { locale, setLocale };
}

/**
 * Translation hook.
 *
 * @param namespace optional key prefix, e.g. `"site.hero"` (a trailing dot
 *   is added). With a namespace, `t("title")` looks up `site.hero.title`;
 *   without one, `t("site.hero.title")` looks up the full key.
 *
 * Lookup order: active locale → Tamil → the key itself. Stable across
 * renders for a given locale, so it is safe in dependency arrays.
 */
export function useT(namespace?: string): TranslateFn {
  const { catalogue } = useLangContext();
  return useCallback<TranslateFn>(
    (key, params) => {
      const prefix = namespace ? (namespace.endsWith(".") ? namespace : `${namespace}.`) : "";
      const full = prefix && !key.startsWith(prefix) ? `${prefix}${key}` : key;
      return translate(catalogue ?? undefined, full, params);
    },
    [catalogue, namespace]
  );
}

/**
 * Site copy by key, in the active locale. Same lookup rules as
 * `siteCopy()` from `src/lib/site-copy.ts`; pass `{ listingTerms: true }`
 * for list items that keep their own language under the display preference.
 *
 *   const t = useSiteT();
 *   <h2>{t("site.adhan.name")}</h2>
 */
export function useSiteT(): (key: string, params?: InterpolationParams, options?: SiteCopyOptions) => string {
  const { locale } = useLangContext();
  return useMemo(() => siteCopy(locale), [locale]);
}

/**
 * In-app chrome by key (chat, Circle, onboarding, profile — the
 * `packages/i18n/src/strings` catalogue), in the active locale.
 *
 *   const t = useUiT();
 *   <button>{t("chat.send")}</button>
 */
export function useUiT(): (key: string, params?: InterpolationParams, options?: { language?: Locale }) => string {
  const { locale } = useLangContext();
  return useCallback(
    (key: string, params?: InterpolationParams, options?: { language?: Locale }) =>
      chromeCopy(key, options?.language ?? locale, params),
    [locale]
  );
}

/** The display preference after one step of the TAM → ENG → BOTH cycle —
    what the compact `LangToggle` shows as its next action. */
export function nextLang(lang: Lang): Lang {
  return nextDisplay(lang) as Lang;
}

export { DEFAULT_DISPLAY, DEFAULT_LOCALE };
export type { Display, Locale };
