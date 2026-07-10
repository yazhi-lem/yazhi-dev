"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

/** The Yazhi Awakening — the date the initiative wakes. The timer counts
    DOWN to this moment, reaching 0d 00:00:00 at the stroke of the new year. */
const AWAKENING = Date.UTC(2027, 0, 1, 0, 0, 0); // 2027-01-01 (month is 0-indexed)

const pad = (n: number) => String(n).padStart(2, "0");

/** Always-on countdown to the Yazhi Awakening. Fixed to the viewport so it
    stays on screen through the whole scroll. `now` starts null and is only
    set in an effect, so the server and first client render agree — no
    hydration mismatch — then it ticks live every second. */
export function LaunchTimer() {
  const { lang } = useLang();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now == null ? 0 : Math.max(0, AWAKENING - now);
  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hrs = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const label =
    lang === "en"
      ? "Yazhi Awakening"
      : lang === "ta"
        ? "யாழி எழுச்சி"
        : "யாழி எழுச்சி · Awakening";

  return (
    <div
      role="timer"
      aria-label={`Yazhi Awakening — ${days} days ${hrs} hours ${mins} minutes ${secs} seconds remaining`}
      className="fixed right-3 top-16 z-40 flex items-center gap-2 rounded-full border border-ivory/15 bg-night-2/80 px-3 py-1.5 text-xs shadow-lg backdrop-blur lg:bottom-4 lg:right-4 lg:top-auto"
    >
      <span aria-hidden className="text-sm leading-none">🌅</span>
      <span className="hidden text-[color:var(--accent)] sm:inline">{label}</span>
      <span className="font-mono tabular-nums text-ivory">
        {days}
        <span className="text-ivory-dim">d</span> {pad(hrs)}:{pad(mins)}:{pad(secs)}
      </span>
    </div>
  );
}
