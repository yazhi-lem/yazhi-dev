"use client";
import { forwardRef, useImperativeHandle, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";

export interface ComposerHandle {
  focus: () => void;
  /** put text in the box (a starter question) and focus it */
  fill: (text: string) => void;
}

/** The message box of Yazhi Chat, after the Bubble UI sketch: the Circle
    button leading, a text area that grows with what you write, and send —
    or stop while a reply is coming.

    Enter sends and Shift+Enter starts a new line, but never while an input
    method is composing: Tamil keyboards (Tamil99, phonetic) confirm letters
    with Enter, and sending half a word would be a bug, not a feature. */
export const ChatComposer = forwardRef<ComposerHandle, {
  onSend: (text: string) => void;
  onStop: () => void;
  streaming: boolean;
  placeholder: string;
  leading?: ReactNode;
  hint?: ReactNode;
}>(function ChatComposer({ onSend, onStop, streaming, placeholder, leading, hint }, ref) {
  const [text, setText] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);

  const grow = () => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  useImperativeHandle(ref, () => ({
    focus: () => area.current?.focus(),
    fill: (t: string) => {
      setText(t);
      requestAnimationFrame(() => {
        grow();
        const el = area.current;
        if (el) {
          el.focus();
          el.setSelectionRange(t.length, t.length);
        }
      });
    },
  }));

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || streaming) return;
    setText("");
    requestAnimationFrame(grow);
    onSend(value);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} aria-label="Send a message" className="w-full">
      <div className="flex items-end gap-2 rounded-[1.6rem] border bg-[color:var(--env-surface)] p-1.5 pl-2 transition-colors duration-300 hair focus-within:[border-color:var(--env-hi)]">
        {leading && <div className="shrink-0 self-end p-0.5">{leading}</div>}
        <label htmlFor="yazhi-composer" className="sr-only">
          {placeholder}
        </label>
        <textarea
          id="yazhi-composer"
          ref={area}
          rows={1}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            grow();
          }}
          onKeyDown={onKey}
          placeholder={placeholder}
          aria-describedby="yazhi-composer-hint"
          className="max-h-[200px] min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-2 py-[11px] text-[0.97rem] leading-relaxed text-[color:var(--env-text)] placeholder:text-[color:var(--env-text-dim)] placeholder:opacity-70 focus:outline-none"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors hair hover:bg-[color:var(--env-ground)]"
            aria-label="Stop the reply"
          >
            <span aria-hidden className="block h-3 w-3 rounded-[3px] bg-[color:var(--env-text)]" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[color:var(--env-ground)] transition-[opacity,transform] duration-300 enabled:hover:scale-[1.04] disabled:opacity-35"
            style={{ background: "var(--env-hi)" }}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
            </svg>
          </button>
        )}
      </div>
      <p id="yazhi-composer-hint" className="mt-2 px-3 text-center text-[11px] text-[color:var(--env-text-dim)]">
        {hint}
      </p>
    </form>
  );
});
