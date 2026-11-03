"use client";
import { useEffect, type RefObject } from "react";
import { useStored } from "./store";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** For a dialog or popover: focus moves in when it opens, Tab stays inside,
    Escape closes it, and focus goes back to whatever opened it. */
export function useDialogFocus(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const first = node?.querySelector<HTMLElement>("[data-autofocus]") ?? node;
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (!node) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const [a, z] = [items[0], items[items.length - 1]];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === node)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [ref, onClose]);
}

/** Reading size for every workspace: 100%, 112.5% or 125% of the root
    size. Everything in Bubble is sized in rem, so the whole screen grows
    together — no zoom, no horizontal scroll. */
export const TEXT_SIZES = [1, 1.125, 1.25] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

export function useTextSize() {
  const [size, setSize] = useStored<TextSize>("yazhi-ws-text", 1);
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = size === 1 ? "" : `${size * 100}%`;
    return () => {
      root.style.fontSize = "";
    };
  }, [size]);
  return { size, setSize };
}

/** "/" puts the cursor in the page's composer, as in chat apps — unless the
    person is already typing somewhere. */
export function useSlashToAsk(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const input = scope.current?.querySelector<HTMLInputElement>("form input[type='text'], form input:not([type]), form textarea");
      if (!input) return;
      e.preventDefault();
      input.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scope]);
}
