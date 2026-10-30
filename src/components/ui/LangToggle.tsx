"use client";
import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ta", label: "தமிழ்" },
  { value: "en", label: "ENG" },
  { value: "both", label: "இரண்டும்" },
];

const SHORT: Record<Lang, string> = { ta: "த", en: "EN", both: "த·EN" };
const NAMES: Record<Lang, string> = { ta: "Tamil", en: "English", both: "Tamil and English" };

/** The three-way TAM / ENG / BOTH toggle — same pattern as the live site.
    `compact` is one small button that steps through the three. */
export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  if (compact) {
    const next = OPTIONS[(OPTIONS.findIndex((o) => o.value === lang) + 1) % OPTIONS.length].value;
    return (
      <button
        type="button"
        onClick={() => setLang(next)}
        aria-label={`Language / மொழி: ${NAMES[lang]}. Switch to ${NAMES[next]}`}
        title="மொழி / Language"
        className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-sm text-ivory-dim transition-colors hover:bg-ivory/10 hover:text-ivory"
      >
        <span aria-hidden>{SHORT[lang]}</span>
      </button>
    );
  }
  return (
    <div
      role="radiogroup"
      aria-label="Language / மொழி"
      className="flex items-center gap-1 rounded-full border border-ivory/15 bg-night-2/70 p-1 backdrop-blur"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={lang === o.value}
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
