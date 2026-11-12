"use client";
/** The language switcher: a labelled, keyboard-operable control that changes
    the *locale* (the language the page is in), not the display preference.

    Behaviour:
      - `role="radiogroup"` with one radio per locale; arrow keys move the
        selection (the WAI-ARIA radio pattern), Home/End jump to the ends.
      - A locale whose copy still needs sign-off carries a visible "draft"
        marker and that fact in its accessible name, so a screen-reader user
        is never told an unreviewed translation is final.
      - Persists through `setLocale()` (localStorage `yazhi-locale`) and the
        provider also writes the `yazhi-locale` cookie the server layout reads.
      - Announces the change once, in the new language, through an
        `aria-live="polite"` region.

    Strings are static triples (`./locale-switcher-strings.ts`) so the control
    renders identically on the server and before the provider's locale effect
    runs — no hydration mismatch, and it works outside `<LangProvider>`'s
    catalogue. */
import { useId, useRef, useState } from "react";
import { LOCALE_META, LOCALES, type Locale } from "@yazhi/i18n";
import { useLocale } from "@/lib/i18n";
import { SWITCHER_STRINGS, switcherText, translateSwitcher } from "./locale-switcher-strings";

const NAME_KEY: Record<Locale, string> = {
  ta: "locale.tamil",
  en: "locale.english",
  hi: "locale.hindi",
};

const SHORT: Record<Locale, string> = { ta: "த", en: "EN", hi: "हि" };

/** The language's name as it reads in `inLocale` (falls back to the endonym). */
function nameIn(locale: Locale, inLocale: Locale): string {
  return switcherText(NAME_KEY[locale], inLocale);
}

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const [announcement, setAnnouncement] = useState("");
  const groupRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const choose = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    setAnnouncement(
      translateSwitcher(switcherText("locale.changed", next), { language: nameIn(next, next) })
    );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = LOCALES.indexOf(locale);
    let target = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % LOCALES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + LOCALES.length) % LOCALES.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = LOCALES.length - 1;
    if (target < 0) return;
    event.preventDefault();
    const next = LOCALES[target];
    choose(next);
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-locale="${next}"]`)?.focus();
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`.trim()}>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={switcherText("locale.regionLabel", locale)}
        aria-describedby={`${id}-hint`}
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 rounded-full border border-ivory/15 bg-night-2/70 p-1 backdrop-blur"
      >
        {LOCALES.map((option) => {
          const selected = option === locale;
          const draft = LOCALE_META[option].needsNativeReview;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              data-locale={option}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(option)}
              // The label states the language AND its review state.
              aria-label={`${nameIn(option, option)}${draft ? ` — ${switcherText("locale.draft", option)}` : ""}`}
              lang={option}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors ${
                selected ? "bg-gold font-semibold text-night" : "text-ivory-dim hover:text-ivory"
              }`}
            >
              <span aria-hidden>{SHORT[option]}</span>
              <span>{nameIn(option, locale)}</span>
              {draft && (
                <span className="rounded-full border border-current/40 px-1 text-[9px] uppercase tracking-wide" aria-hidden>
                  {switcherText("locale.draft", locale).split(" ")[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p id={`${id}-hint`} className="sr-only">
        {switcherText("locale.choose", locale)}
      </p>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

export default LocaleSwitcher;
export { SWITCHER_STRINGS };
