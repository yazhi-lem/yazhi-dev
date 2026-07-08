"use client";
import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ta", label: "தமிழ்" },
  { value: "en", label: "ENG" },
  { value: "both", label: "இரண்டும்" },
];

/** The three-way TAM / ENG / BOTH toggle — same pattern as the live site. */
export function LangToggle() {
  const { lang, setLang } = useLang();
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
