"use client";
import { useLang, getLanguage, INDIC_LANGUAGES, type LangMode, type IndicCode } from "@/lib/i18n";

/** Language controls: a picker for WHICH Indic language, and a
 *  three-way mode toggle for HOW copy renders — the Indic language,
 *  English, or the mixed code-switching voice. The pills relabel
 *  themselves in the chosen language (தமிழ்/கலவை, हिन्दी/मिश्रित, …).
 */
export function LangToggle() {
  const { mode, indic, setMode, setIndic } = useLang();
  const active = getLanguage(indic);

  const OPTIONS: { value: LangMode; label: string }[] = [
    { value: "indic", label: active.nameNative },
    { value: "en", label: "ENG" },
    { value: "mixed", label: active.mixedLabel },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label="Language / மொழி / भाषा"
        value={indic}
        onChange={(e) => setIndic(e.target.value as IndicCode)}
        className="max-w-[7.5rem] rounded-full border border-ivory/15 bg-night-2/70 px-2.5 py-1.5 text-xs text-ivory backdrop-blur focus:outline-none focus:ring-1 focus:ring-gold/60"
      >
        {INDIC_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} disabled={!l.ready} className="bg-night text-ivory">
            {l.nameNative}
            {l.ready ? "" : " · soon"}
          </option>
        ))}
      </select>

      <div
        role="radiogroup"
        aria-label="Display mode"
        className="flex items-center gap-1 rounded-full border border-ivory/15 bg-night-2/70 p-1 backdrop-blur"
      >
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            role="radio"
            aria-checked={mode === o.value}
            onClick={() => setMode(o.value)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              mode === o.value
                ? "bg-gold text-night font-semibold"
                : "text-ivory-dim hover:text-ivory"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
