"use client";
import { nextLang, useLang, useLocale, type Lang } from "@/lib/i18n";
import {
  DISPLAY_NAMES,
  LOCALE_META,
  nextLocale,
  ui,
  type Display,
  type Locale,
} from "@yazhi/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ta", label: "தமிழ்" },
  { value: "en", label: "ENG" },
  { value: "both", label: "இரண்டும்" },
];

const SHORT: Record<Lang, string> = { ta: "த", en: "EN", both: "த·EN" };

/** The locale step's short visible tag. The full language name is in the
    button's `aria-label` ("Language: Tamil. Switch to English"), which comes
    from `@yazhi/i18n`'s UI catalogue — its Hindi strings are machine DRAFTS
    pending a native speaker's review. */
const LOCALE_TAG: Record<Locale, string> = { ta: "TA", en: "EN", hi: "HI" };

/** The three-way TAM / ENG / BOTH toggle — same pattern as the live site.

    `compact` is one small button. It keeps its original job (step the
    *display* mode ta → en → both) and gains a second, separate control: a
    *locale* step (ta → en → hi) that changes the language the page is in.
    The display preference and the locale are different things — see
    `packages/i18n/src/display.ts`.

    Accessible names always say the current mode, so a screen-reader user
    hears "Tamil and English" rather than a glyph. The Latin `aria-label` is
    the primary name and carries the localised text after a comma, rather
    than the other way round — a leading Tamil string is otherwise read
    phonetically by English voice settings. */
export function LangToggle({
  compact = false,
  showLocale = compact,
}: {
  compact?: boolean;
  /** Show the locale step beside the display toggle (compact variant only
      by default; the full variant stays exactly a 3-way TAM/ENG/BOTH
      radiogroup). */
  showLocale?: boolean;
}) {
  const { lang, setLang } = useLang();
  const { locale, setLocale } = useLocale();

  if (compact) {
    const next = nextLang(lang);
    const nextLoc = nextLocale(locale);
    return (
      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLang(next)}
          aria-label={`Display mode: ${DISPLAY_NAMES[lang]}. Switch to ${
            DISPLAY_NAMES[next]
          } — ${ui("display.current", locale, { mode: ui(`display.label.${lang}`, locale) })}`}
          title={`${ui("display.name", locale)} / ${DISPLAY_NAMES[lang]}`}
          className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-sm text-ivory-dim transition-colors hover:bg-ivory/10 hover:text-ivory"
        >
          <span aria-hidden>{SHORT[lang]}</span>
        </button>
        {showLocale && (
          <button
            type="button"
            onClick={() => setLocale(nextLoc)}
            aria-label={`Language: ${LOCALE_META[locale].englishName}. Switch to ${LOCALE_META[nextLoc].englishName} — ${ui(
              "language.current",
              locale,
              { language: ui(`language.label.${locale}`, locale) }
            )}`}
            title={`${ui("language.name", locale)} / ${LOCALE_META[locale].nativeName}`}
            className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-xs font-semibold tracking-wide text-ivory-dim transition-colors hover:bg-ivory/10 hover:text-ivory"
          >
            <span aria-hidden>{LOCALE_TAG[locale]}</span>
          </button>
        )}
      </span>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={`Display mode / ${ui("display.name", locale)}`}
      className="flex items-center gap-1 rounded-full border border-ivory/15 bg-night-2/70 p-1 backdrop-blur"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={lang === o.value}
          aria-label={DISPLAY_NAMES[o.value as Display]}
          onClick={() => setLang(o.value)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            lang === o.value
              ? "bg-gold text-night font-semibold"
              : "text-ivory-dim hover:text-ivory"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
