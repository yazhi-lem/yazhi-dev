"use client";
import { forwardRef, useId, useImperativeHandle, useRef, useState } from "react";
import { T, toneStyle, type Tone } from "@/bubble";
import { MAX_MESSAGE_CHARS } from "@/lib/chat/types";
import { S, useBi } from "./strings";

export interface ComposerHandle {
  focus: () => void;
  /** put text in the box (e.g. a prompt chip while sending is paused) */
  fill: (text: string) => void;
}

/** Message box. Enter sends, Shift+Enter adds a line — but never while an
    IME composition is open: Tamil keyboards (Illakiya, phonetic layouts)
    compose syllables with Enter, and sending mid-syllable would cut the
    word. A counter appears from 80% of the limit; `disabledReason` points
    the send button at the banner that explains why it is off. */
export const Composer = forwardRef<
  ComposerHandle,
  {
    agentName: string;
    tone: Tone;
    pending: boolean;
    disabled: boolean;
    disabledReasonId?: string;
    onSend: (text: string) => void;
    onStop: () => void;
  }
>(function Composer({ agentName, tone, pending, disabled, disabledReasonId, onSend, onStop }, ref) {
  const t = useBi();
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hintId = useId();
  const countId = useId();
  useImperativeHandle(ref, () => ({
    focus: () => taRef.current?.focus(),
    fill: (value: string) => {
      setText(value);
      requestAnimationFrame(() => {
        resize();
        taRef.current?.focus();
      });
    },
  }));

  const resize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const len = text.length;
  const over = len > MAX_MESSAGE_CHARS;
  const canSend = !disabled && !pending && text.trim().length > 0 && !over;

  const submit = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative z-10 border-t border-ivory/10 bg-night/70 backdrop-blur"
      data-lenis-prevent
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-1.5 px-4 py-3 sm:px-6">
        <div
          style={toneStyle(tone)}
          className="ybi-field flex items-end gap-2 rounded-3xl py-1.5 pl-4 pr-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--tone)]"
        >
          <label htmlFor="composer-input" className="sr-only">
            {`${t(S.message)} · ${agentName}`}
          </label>
          <textarea
            id="composer-input"
            ref={taRef}
            rows={1}
            value={text}
            placeholder={`${t(S.message)} · ${agentName}`}
            aria-describedby={`${hintId}${len > MAX_MESSAGE_CHARS * 0.8 ? ` ${countId}` : ""}`}
            aria-invalid={over || undefined}
            onChange={(e) => {
              setText(e.target.value);
              resize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            className="ybi-bare max-h-[200px] min-h-11 flex-1 resize-none bg-transparent py-2.5 text-base leading-relaxed text-ivory placeholder:text-ivory-dim focus:outline-none"
          />
          {pending ? (
            <button
              type="button"
              onClick={onStop}
              aria-label={t(S.stop)}
              className="ybi-soft grid h-11 w-11 shrink-0 place-items-center rounded-full"
            >
              <span aria-hidden className="block h-3 w-3 rounded-[3px] bg-current" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={t(S.send)}
              aria-disabled={!canSend || undefined}
              aria-describedby={disabled ? disabledReasonId : undefined}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-opacity ${canSend ? "ybi-solid" : "ybi-track cursor-not-allowed text-ivory-dim"}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 px-2 text-xs text-ivory-dim">
          <p id={hintId}>
            <T text={S.hint} />
          </p>
          {len > MAX_MESSAGE_CHARS * 0.8 && (
            <p id={countId} className={over ? "font-semibold text-ivory" : ""}>
              {len.toLocaleString("en-IN")} / {MAX_MESSAGE_CHARS.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </form>
  );
});
