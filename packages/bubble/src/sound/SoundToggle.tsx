"use client";
import { useSyncExternalStore } from "react";
import { pluck, strum, wake } from "./yazhVoice";

/** Whether the yazh may sound. Off until a person turns it on; the choice
    is remembered in this browser only. */
const KEY = "yazhi-sound";
const EVENT = "yazhi-sound";

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useYazhSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, read, () => false);
  const set = (v: boolean) => {
    try {
      if (v) window.localStorage.setItem(KEY, "on");
      else window.localStorage.removeItem(KEY);
    } catch {
      // private mode: the choice lasts for this visit
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [on, set];
}

/** Gives a stage's "yazh:pluck" events a voice, while sound is on. Only a
    person's own plucks sound — never the figure's tour. Returns the
    unsubscribe. */
export function voiceStage(stage: HTMLElement, enabled: () => boolean) {
  const onPluck = (e: Event) => {
    const d = (e as CustomEvent<{ string: number; gain: number; delay: number; human: boolean }>).detail;
    if (!d?.human || !enabled()) return;
    // a remembered "on" needs the page to have been clicked once before the
    // browser lets it sound; wake() is a no-op once the audio is running
    void wake().then((ok) => ok && pluck(d.string, d.gain, d.delay));
  };
  stage.addEventListener("yazh:pluck", onPluck);
  return () => stage.removeEventListener("yazh:pluck", onPluck);
}

/** The speaker button beside a yazh. Turning it on wakes the audio (it must
    come from this press) and answers with a soft run up the strings. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useYazhSound();
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Yazh sound on. Turn off" : "Yazh sound off. Turn on to hear the strings"}
      title={on ? "Sound on" : "Turn on the yazh's sound"}
      onClick={async () => {
        if (on) return setOn(false);
        setOn(true);
        if (await wake()) strum();
      }}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-xs transition-colors ${
        on
          ? "border-[color:var(--env-hi)] text-[color:var(--env-text)]"
          : "border-[color:color-mix(in_oklab,var(--env-edge)_45%,transparent)] text-[color:var(--env-text-dim)] hover:text-[color:var(--env-text)]"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      {on ? "Sound on" : "Sound"}
    </button>
  );
}
