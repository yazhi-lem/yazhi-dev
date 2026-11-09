"use client";
import { useLang, useLocale, useT } from "@/lib/i18n";
import { DEFAULT_LOCALE, type Locale, type MessageKey } from "@yazhi/i18n";
import type { ElementType, ReactNode } from "react";
import React from "react";

type WithCatalogue = {
  /** Catalogue key for this line (e.g. `"site.hero.title"`). */
  messageKey?: MessageKey;
  /** Key prefix for `messageKey` (e.g. `"site.hero"`). */
  namespace?: string;
};

/** The text to show for one locale: a catalogue hit when the key covers the
    active locale, else the value supplied by the caller. */
function resolveLine(
  target: Locale,
  { translated, activeLocale, values }: { translated: string | null; activeLocale: Locale; values: Partial<Record<Locale, ReactNode>> }
): ReactNode {
  if (translated !== null && target === activeLocale) return translated;
  return values[target];
}

function isRenderable(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== "";
}

/** Bilingual text primitive. Renders Tamil and/or English according to
    the global TAM / ENG / BOTH *display* mode, with correct lang attributes
    so Tamil line-height rules apply.

    The public props are unchanged from before the locale split, so every
    existing call site compiles and renders identically. What is new is
    additive:

      - `hi`, and `values: Partial<Record<Locale, ReactNode>>` for any
        locale beyond Tamil and English.
      - `messageKey` + `namespace`: the line for the *active locale* is read
        from the catalogue first; on a miss it falls back to the caller's
        `values`/`hi`, then to Tamil.

    Tamil vs English is still chosen by the display preference (that is what
    the toggle has always meant). A locale other than ta/en switches the
    whole line to that language, falling back to Tamil — the source
    language — when no translation exists. */
export function Bi({
  ta,
  en,
  hi,
  values,
  messageKey,
  namespace,
  as: Tag = "span",
  className = "",
  taClass = "",
  enClass = "",
  localeClass = "",
  display = false,
  separator = null,
}: {
  ta: ReactNode;
  en: ReactNode;
  /** Hindi copy. DRAFT until a native speaker reviews it. */
  hi?: ReactNode;
  /** Copy for any locale; takes precedence over `ta`/`en`/`hi`. */
  values?: Partial<Record<Locale, ReactNode>>;
  as?: ElementType;
  className?: string;
  taClass?: string;
  enClass?: string;
  localeClass?: string;
  display?: boolean;
  separator?: ReactNode;
} & WithCatalogue) {
  const { lang } = useLang();
  const { locale } = useLocale();
  const t = useT(namespace);

  const resolved = messageKey ? t(messageKey) : messageKey ?? null;
  const translated = resolved !== null && resolved !== messageKey ? resolved : null;
  const allValues: Partial<Record<Locale, ReactNode>> = { ta, en, ...(hi !== undefined ? { hi } : {}), ...values };

  const d = display ? "display" : "";
  const classFor = (target: Locale): string => {
    if (target === "ta") return `${d} ${taClass}`.trim();
    if (target === "en") return `${d} ${enClass}`.trim();
    return `${d} ${localeClass}`.trim();
  };

  const renderLine = (target: Locale, text: ReactNode) =>
    isRenderable(text) ? (
      <span key={target} lang={target} className={classFor(target)}>
        {text}
      </span>
    ) : null;

  // One language at a time for locales beyond Tamil and English.
  if (locale !== DEFAULT_LOCALE && locale !== "en") {
    const text = resolveLine(locale, { translated, activeLocale: locale, values: allValues });
    const shown = isRenderable(text) ? text : allValues[DEFAULT_LOCALE];
    return React.createElement(
      Tag,
      { className },
      <span lang={isRenderable(text) ? locale : DEFAULT_LOCALE} className={classFor(locale)}>
        {shown}
      </span>
    );
  }

  // Tamil and English under the display preference: ta / en / both.
  const targets: Locale[] = lang === "both" ? ["ta", "en"] : [lang as "ta" | "en"];
  const lines = targets
    .map((target) => ({ target, text: resolveLine(target, { translated, activeLocale: locale, values: allValues }) }))
    .filter((line) => isRenderable(line.text));

  return React.createElement(
    Tag,
    { className },
    <>
      {lines.map((line, index) => (
        <React.Fragment key={line.target}>
          {renderLine(line.target, line.text)}
          {lang === "both" && separator && index < lines.length - 1 ? separator : null}
        </React.Fragment>
      ))}
    </>
  );
}

/** `Tri` — the same primitive, named for call sites that pass a third
    language. Identical behaviour to `Bi`. */
export const Tri = Bi;

/** `I18nText` — the `Record<Locale, ReactNode>` form, for copy that is not
    shaped like a Tamil/English pair (e.g. a language name). `values` must
    contain the Tamil line; that is the fallback. */
export function I18nText({
  values,
  messageKey,
  namespace,
  as: Tag = "span",
  className = "",
  localeClass = "",
}: {
  values: Partial<Record<Locale, ReactNode>> & { ta: ReactNode };
  as?: ElementType;
  className?: string;
  localeClass?: string;
  display?: boolean;
  separator?: ReactNode;
} & WithCatalogue) {
  const { lang } = useLang();
  const { locale } = useLocale();
  const t = useT(namespace);

  const resolved = messageKey ? t(messageKey) : messageKey ?? null;
  const translated = resolved !== null && resolved !== messageKey ? resolved : null;

  const renderLine = (target: Locale, text: ReactNode) =>
    isRenderable(text) ? (
      <span key={target} lang={target} className={localeClass.trim()}>
        {text}
      </span>
    ) : null;

  if (locale !== DEFAULT_LOCALE && locale !== "en") {
    const text = resolveLine(locale, { translated, activeLocale: locale, values });
    return React.createElement(
      Tag,
      { className },
      renderLine(isRenderable(text) ? locale : DEFAULT_LOCALE, isRenderable(text) ? text : values.ta)
    );
  }

  const targets: Locale[] = lang === "both" ? ["ta", "en"] : [lang as "ta" | "en"];
  return React.createElement(
    Tag,
    { className },
    targets.map((target) => renderLine(target, resolveLine(target, { translated, activeLocale: locale, values })))
  );
}
