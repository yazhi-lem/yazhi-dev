"use client";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { MarkBubble } from "./MarkBubble";

/** Mission Control: the three-mark bubble that leads every composer and
    header. It wakes when a Circle account is signed in; until then it
    stays asleep and pressing it asks you to sign in or join.

    This is the button only. The host decides where the panel opens — a
    side sheet in a chat, a drop-down under a header — and fills it with
    MissionSection blocks, so Mission Control can hold whatever the screen
    needs: the account, the theme, the landscape, where replies run. */
export const MissionControl = forwardRef<
  HTMLButtonElement,
  {
    /** a Circle account is signed in */
    active: boolean;
    /** the session is still being checked */
    busy?: boolean;
    /** the panel is showing */
    open?: boolean;
    /** id of the panel this button shows, for aria-controls */
    controls?: string;
    /** who is signed in, for the accessible name */
    who?: string;
    size?: number;
    onPress: () => void;
    className?: string;
  }
>(function MissionControl({ active, busy = false, open = false, controls, who, size = 40, onPress, className = "" }, ref) {
  // the mark breathes once when it wakes, not on every render
  const [woke, setWoke] = useState(false);
  const was = useRef(active);
  useEffect(() => {
    if (active && !was.current) {
      queueMicrotask(() => setWoke(true));
      const t = window.setTimeout(() => setWoke(false), 950);
      was.current = active;
      return () => window.clearTimeout(t);
    }
    was.current = active;
  }, [active]);

  const label = active ? `Mission Control${who ? ` — signed in as ${who}` : ""}` : busy ? "Mission Control — checking your Circle account" : "Mission Control — sign in with Circle to start";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onPress}
      aria-label={label}
      title={active ? "Mission Control" : "Sign in with Circle to open Mission Control"}
      aria-haspopup="dialog"
      aria-expanded={active ? open : undefined}
      aria-controls={active && open ? controls : undefined}
      className={`relative grid shrink-0 place-items-center rounded-full transition-[transform,opacity] duration-300 hover:scale-[1.04] active:scale-95 ${
        active ? "" : "opacity-80 hover:opacity-100"
      } ${className}`}
      style={{ width: Math.max(size, 44), height: Math.max(size, 44) }}
    >
      <MarkBubble size={size} awake={active} className={woke ? "mission-wake" : ""} />
      {busy && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold/30 motion-reduce:animate-none" />}
    </button>
  );
});

/** One block of a Mission Control panel. */
export function MissionSection({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-t border-ivory/10 px-4 py-4 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-ivory-dim">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** The panel's head: the awake mark, a title and a close button that takes focus. */
export function MissionHeader({ title = "Mission Control", onClose }: { title?: string; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => close.current?.focus(), []);
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <MarkBubble size={28} />
        <h2 className="font-display text-base font-semibold text-ivory">{title}</h2>
      </div>
      <button
        ref={close}
        type="button"
        onClick={onClose}
        aria-label={`Close ${title}`}
        className="grid h-11 w-11 place-items-center rounded-full text-ivory-dim transition-colors hover:bg-ivory/10 hover:text-ivory"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
