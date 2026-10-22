"use client";
import { useState, type FormEvent, type ReactNode } from "react";

/** The message bar from the Bubble UI sketch: a leading slot (the Circle
    button), the input, and the ▷ send — or ■ stop while streaming. */
export function Composer({
  onSend,
  onStop,
  streaming = false,
  placeholder = "Message…",
  leading,
  disabled = false,
}: {
  onSend: (text: string) => void;
  onStop?: () => void;
  streaming?: boolean;
  placeholder?: string;
  leading?: ReactNode;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ivory placeholder:text-ivory-dim/50 focus:outline-none disabled:opacity-50"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="grid h-8 w-8 place-items-center rounded-full bg-ivory/10 text-ivory hover:bg-gold hover:text-night"
            aria-label="Stop"
          >
            <span className="block h-2.5 w-2.5 rounded-[3px] bg-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="grid h-8 w-8 place-items-center rounded-full bg-gold text-night transition enabled:hover:bg-bronze disabled:opacity-30"
            aria-label="Send"
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
