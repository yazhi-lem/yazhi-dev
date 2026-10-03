"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { T } from "@/bubble";
import type { BiString } from "@/lib/chat/types";
import { S, useBi } from "./strings";

/** Modal sheet on the native <dialog>: showModal() gives a real focus
    trap, an inert background, Esc to close, and focus back to the opener
    on close — browser behaviour rather than hand-rolled. `side` slides it
    in from the left (conversation drawer) or centres it (about). */
export function Sheet({
  open,
  onClose,
  title,
  side = "center",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: BiString;
  side?: "left" | "center";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const t = useBi();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      const a = document.activeElement;
      // a sheet opened from the menu opens in the same render that closes
      // the menu, so focus is already on <body>: fall back to the Yazhi button
      opener.current = a && a !== document.body ? a : document.querySelector("[data-ybi-fab]");
      d.showModal();
    }
    if (!open && d.open) d.close();
    if (!open && opener.current) {
      // Restore focus after the browser's own restore step. The opener is
      // often gone (a menu item in a menu that has closed), so fall back to
      // the floating Yazhi button rather than leaving focus on <body>.
      const back = opener.current;
      opener.current = null;
      window.setTimeout(() => {
        const a = document.activeElement;
        if (a && a !== document.body && !d.contains(a)) return; // someone already moved it on purpose
        const target = back.isConnected ? (back as HTMLElement) : document.querySelector<HTMLElement>("[data-ybi-fab]");
        target?.focus();
      }, 60);
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={t(title)}
      onClose={onClose}
      onClick={(e) => {
        // a click on the backdrop lands on the <dialog> element itself
        if (e.target === e.currentTarget) onClose();
      }}
      className={`ybi-sheet ${side === "left" ? "ybi-sheet-left" : "ybi-sheet-center"}`}
    >
      <div className="flex h-full max-h-[inherit] flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-ivory">
            <T text={title} />
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(S.close)}
            className="grid h-11 w-11 place-items-center rounded-full text-ivory-dim hover:bg-ivory/10 hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </dialog>
  );
}
