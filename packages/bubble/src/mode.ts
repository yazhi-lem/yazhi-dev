"use client";
import { useCallback, useSyncExternalStore } from "react";
import { MODE_KEY } from "./mode-script";

/** Light, dark, or whatever the system prefers. Bubble's colours are CSS
    light-dark() pairs inside .bubble-root (styles/bubble.css), so a mode is
    one attribute on <html>: data-mode="light" | "dark", absent for system. */
export type ColorMode = "system" | "light" | "dark";

const EVENT = "yazhi-mode";

function read(): ColorMode {
  try {
    const m = window.localStorage.getItem(MODE_KEY);
    return m === "light" || m === "dark" ? m : "system";
  } catch {
    return "system";
  }
}

export function setColorMode(mode: ColorMode) {
  try {
    if (mode === "system") window.localStorage.removeItem(MODE_KEY);
    else window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // private mode: the choice lasts for this visit
  }
  if (mode === "system") delete document.documentElement.dataset.mode;
  else document.documentElement.dataset.mode = mode;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
    mq.removeEventListener("change", cb);
  };
}

const systemLight = () => window.matchMedia("(prefers-color-scheme: light)").matches;

/** Calls `cb` whenever the resolved mode may have changed: a choice here,
    in another tab, or the system switching. For canvases that read colours. */
export const onColorModeChange = subscribe;

/** The chosen mode, the one actually showing, and a setter. */
export function useColorMode(): { mode: ColorMode; resolved: "light" | "dark"; setMode: (m: ColorMode) => void } {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as ColorMode);
  const light = useSyncExternalStore(subscribe, systemLight, () => false);
  const setMode = useCallback((m: ColorMode) => setColorMode(m), []);
  return { mode, resolved: mode === "system" ? (light ? "light" : "dark") : mode, setMode };
}
