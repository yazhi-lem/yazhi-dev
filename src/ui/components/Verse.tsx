/** A Thirukkural couplet (or any two-line verse): number, Tamil lines,
    and an optional English gloss. Tamil is never letter-spaced. */
export function KuralQuote({
  number,
  lines,
  gloss,
  glossDraft = true,
}: {
  number: number;
  lines: [string, string];
  gloss?: string;
  /** gloss not yet reviewed by a scholar */
  glossDraft?: boolean;
}) {
  return (
    <figure className="rounded-xl border border-ivory/10 bg-night/60 p-4">
      <blockquote lang="ta" className="text-base text-ivory">
        <p>{lines[0]}</p>
        <p>{lines[1]}</p>
      </blockquote>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-xs text-ivory-dim">
        <span>
          <span lang="ta">திருக்குறள்</span> {number}
        </span>
        {gloss && (
          <span className="max-w-prose italic">
            “{gloss}”{glossDraft && <span className="ml-1 not-italic text-gold">(draft gloss)</span>}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/** Numbered steps with a current position — onboarding, wizards, runbooks. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "now" : "next";
        return (
          <li key={s} className="flex items-center gap-2" aria-current={state === "now" ? "step" : undefined}>
            <span
              className={`grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] ${
                state === "done"
                  ? "bg-mullai text-night"
                  : state === "now"
                    ? "bg-[color:var(--accent)] text-night"
                    : "border border-ivory/20 text-ivory-dim"
              }`}
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className={state === "next" ? "text-ivory-dim" : "text-ivory"}>{s}</span>
            {i < steps.length - 1 && <span aria-hidden className="h-px w-4 bg-ivory/20" />}
          </li>
        );
      })}
    </ol>
  );
}
