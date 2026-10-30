"use client";
import { useId } from "react";
import { useColorMode, type ColorMode } from "../mode";

const ICONS: Record<ColorMode, React.ReactNode> = {
  system: (
    <>
      <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
      <path d="M9 19.5h6M12 16v3.5" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  dark: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
};

const NAMES: Record<ColorMode, string> = { system: "System", light: "Light", dark: "Dark" };
const ORDER: ColorMode[] = ["system", "light", "dark"];

function Icon({ mode }: { mode: ColorMode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[mode]}
    </svg>
  );
}

/** Light, dark or the system's choice. Always available, signed in or not.
    `compact` is one button that steps through the three; otherwise a
    three-way choice with names. */
export function ModeSwitch({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { mode, setMode } = useColorMode();
  const name = useId();
  if (compact) {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    return (
      <button
        type="button"
        onClick={() => setMode(next)}
        aria-label={`Theme: ${NAMES[mode]}. Switch to ${NAMES[next]}`}
        title={`Theme: ${NAMES[mode]}`}
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-ivory-dim transition-colors hover:bg-ivory/10 hover:text-ivory ${className}`}
      >
        <Icon mode={mode} />
      </button>
    );
  }
  return (
    <fieldset className={`grid grid-cols-3 gap-1 rounded-full border border-ivory/15 p-1 ${className}`}>
      <legend className="sr-only">Theme</legend>
      {ORDER.map((m) => (
        <label
          key={m}
          className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
            mode === m ? "bg-ivory text-night" : "text-ivory-dim hover:text-ivory"
          }`}
        >
          <input type="radio" name={name} className="sr-only" checked={mode === m} onChange={() => setMode(m)} />
          <Icon mode={m} />
          {NAMES[m]}
        </label>
      ))}
    </fieldset>
  );
}
