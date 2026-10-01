"use client";
import { useEffect, useSyncExternalStore } from "react";

export type YbiTheme = "ink" | "mugil";

const KEY = "ybi-theme";
const EVENT = "ybi-theme-change";
const OPTIONS: { value: YbiTheme; label: string; title: string }[] = [
  { value: "mugil", label: "முகில்", title: "Mugil — Yazh's pastel clouds" },
  { value: "ink", label: "மை", title: "Ink — the dark brand ground" },
];

function root(): HTMLElement | null {
  return document.querySelector("[data-ybi-root]");
}

function apply(t: YbiTheme) {
  const el = root();
  if (el) el.dataset.ybiTheme = t;
  window.dispatchEvent(new Event(EVENT));
}

// The theme lives in the DOM (data-ybi-theme on the shell), so read it as
// an external store rather than mirroring it into React state.
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const snapshot = () => (root()?.dataset.ybiTheme as YbiTheme | undefined) ?? null;
const serverSnapshot = () => null;

/** Switches the nearest BubbleShell between themes by rewriting its
    data-ybi-theme — themes are pure CSS token scopes, so nothing else
    re-renders. The choice is a per-viewer convenience in localStorage
    (guarded: private windows may throw). */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (saved === "ink" || saved === "mugil") apply(saved);
  }, []);

  function pick(t: YbiTheme) {
    apply(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  }

  return (
    <div role="radiogroup" aria-label="Theme" className="ybi-track flex items-center gap-1 rounded-full p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={theme === o.value}
          title={o.title}
          onClick={() => pick(o.value)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            theme === o.value ? "bg-gold font-semibold text-night" : "text-ivory-dim hover:text-ivory"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
