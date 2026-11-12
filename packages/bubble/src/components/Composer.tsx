"use client";
import { useImperativeHandle, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { useBubbleT } from "../locales";

/** What a host can do to the composer without reaching into its DOM — the
    `/app` keyboard map needs exactly these two (`/` focuses, Esc leaves). */
export interface ComposerHandle {
  focus: () => void;
  blur: () => void;
}

/** The message bar from the Bubble UI sketch: a leading slot (Mission
    Control), the input, and the ▷ send — or ■ stop while streaming. */
export function Composer({
  ref,
  onSend,
  onStop,
  streaming = false,
  placeholder,
  leading,
  disabled = false,
  sendLabel,
  stopLabel,
  inputLabel,
}: {
  /** focus/blur without touching the DOM — the host's "/" and Esc shortcuts */
  ref?: Ref<ComposerHandle>;
  onSend: (text: string) => void;
  onStop?: () => void;
  streaming?: boolean;
  /** defaults to the localised `bubble.composer.placeholder` */
  placeholder?: string;
  leading?: ReactNode;
  disabled?: boolean;
  /** accessible names of the buttons — default to the localised
      `bubble.composer.send` / `.stop`; the host may still pass its own */
  sendLabel?: string;
  stopLabel?: string;
  /** accessible name of the field; defaults to the placeholder */
  inputLabel?: string;
}) {
  const t = useBubbleT("bubble.composer");
  const [text, setText] = useState("");
  const field = useRef<HTMLInputElement>(null);
  // Props stay overrides: only an absent one falls back to the catalogue.
  const ph = placeholder ?? t("placeholder");
  const send = sendLabel ?? t("send");
  const stop = stopLabel ?? t("stop");

  useImperativeHandle(
    ref,
    () => ({
      focus: () => field.current?.focus(),
      blur: () => field.current?.blur(),
    }),
    []
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || streaming || disabled) return;
    setText("");
    onSend(value);
  };
  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      {leading}
      <div className="flex min-w-0 flex-1 items-center rounded-full border border-ivory/15 bg-night/70 pl-4 pr-1 focus-within:border-gold/60">
        <input
          ref={field}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ph}
          aria-label={inputLabel ?? ph}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ivory placeholder:text-ivory-dim/50 focus:outline-none disabled:opacity-50"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="grid h-8 w-8 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-gold hover:text-night"
            aria-label={stop}
          >
            <span className="block h-2.5 w-2.5 rounded-[3px] bg-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="grid h-8 w-8 place-items-center rounded-full bg-gold text-night transition enabled:hover:bg-bronze disabled:opacity-30"
            aria-label={send}
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M6 4l14 8-14 8z" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
