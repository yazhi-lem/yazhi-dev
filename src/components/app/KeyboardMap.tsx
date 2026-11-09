"use client";
/** The `/app` keyboard map — a small modal dialog reached with `?` or the
    tray's help button. Same focus rules as every dialog in the app
    (useDialogFocus from @yazhi/workspace): focus moves in, Tab stays
    inside, Escape closes, focus returns to whatever opened it. */

import { useRef } from "react";
import { useDialogFocus } from "@yazhi/workspace";
import { useAppText } from "./useAppText";

export function KeyboardMap({
  items,
  onClose,
}: {
  items: { keys: string; text: string }[];
  onClose: () => void;
}) {
  const t = useAppText();
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-night/70 p-4 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-keys-title"
        tabIndex={-1}
        data-autofocus
        className="w-[min(28rem,100%)] rounded-2xl border border-ivory/15 bg-night-2 p-5 text-ivory shadow-2xl shadow-black/40"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="app-keys-title" className="font-display text-lg font-semibold">
            {t("app.keysTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("app.close")}
            className="grid h-10 w-10 place-items-center rounded-full border border-ivory/15 text-ivory-dim hover:border-ivory/40 hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 text-sm">
          {items.map((item) => (
            <div key={item.keys} className="contents">
              <dt>
                <kbd className="rounded border border-ivory/25 bg-ivory/5 px-2 py-0.5 font-mono text-xs">{item.keys}</kbd>
              </dt>
              <dd className="text-ivory-dim">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
