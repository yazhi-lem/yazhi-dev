import { Bubble } from "../core/Bubble";
import { Pill } from "../core/Pill";
import type { Tone } from "../tone";

/** One-line banner for page-level state — e.g. "sample data, yazhi-api
    not connected". Pages must say where their numbers came from. */
export function Notice({
  tone = "info",
  badge,
  title,
  body,
}: {
  tone?: Tone;
  badge?: string;
  title: string;
  body?: string;
}) {
  return (
    <Bubble tone={tone} shape="card" size="sm" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      {badge && (
        <div className="shrink-0">
          <Pill label={badge} tone={tone} pulse={tone === "ok"} />
        </div>
      )}
      <p className="text-sm text-ivory">
        <span className="font-semibold">{title}</span>
        {body && <span className="text-ivory-dim"> {body}</span>}
      </p>
    </Bubble>
  );
}
