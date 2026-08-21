"use client";
import { useRef, useState } from "react";

export function Composer({
  onSend,
  onStop,
  streaming,
  placeholder,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  streaming: boolean;
  placeholder: string;
}) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const submit = () => {
    const value = text.trim();
    if (!value || streaming) return;
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
    onSend(value);
  };

  return (
    <div className="border-t border-ivory/10 bg-night/60 backdrop-blur" data-lenis-prevent>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-4 sm:px-6">
        <div className="flex items-end gap-2 rounded-2xl border border-ivory/15 bg-night-2/80 px-3 py-2 transition-colors focus-within:border-gold/60">
          <textarea
            ref={taRef}
            rows={1}
            value={text}
            placeholder={placeholder}
            onChange={(e) => {
              setText(e.target.value);
              resize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            className="max-h-[180px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-ivory placeholder:text-ivory-dim/50 focus:outline-none"
            aria-label="Message"
          />
          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory/10 text-ivory transition hover:bg-gold hover:text-night"
              aria-label="Stop generating"
            >
              <span className="block h-2.5 w-2.5 rounded-[3px] bg-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim()}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-night transition enabled:hover:bg-bronze enabled:hover:text-ivory disabled:opacity-30"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
        <p className="px-1 text-[11px] text-ivory-dim/60">
          Enter to send · Shift+Enter for a new line · replies stream from the yazhi-api backend
        </p>
      </div>
    </div>
  );
}
