import type { ReactNode } from "react";

export interface Source {
  id: string;
  /** e.g. "Thirukkural", "India Code" */
  title: string;
  /** where inside the source: verse, section, page */
  locator: string;
  href?: string;
  /** a short quote from the source that supports the claim */
  excerpt?: string;
  /** checked by a scholar, lawyer or other reviewer */
  verified?: boolean;
}

/** Inline citation marker: [n] linking to the source. Aram rule 1 — every
    claim carries one, or the answer says it doesn't know. */
export function CitationMark({ n, source }: { n: number; source: Source }) {
  const label = `Source ${n}: ${source.title}, ${source.locator}`;
  const cls =
    "ml-0.5 inline-grid h-4 min-w-4 place-items-center rounded bg-[color:var(--accent)]/20 px-1 align-super font-mono text-[10px] text-[color:var(--accent)] no-underline hover:bg-[color:var(--accent)]/35";
  return source.href ? (
    <a href={source.href} className={cls} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
      {n}
    </a>
  ) : (
    <a href={`#src-${source.id}`} className={cls} aria-label={label} title={label}>
      {n}
    </a>
  );
}

/** A source in a list: title, locator, excerpt, verification state. */
export function SourceCard({ n, source, footer }: { n: number; source: Source; footer?: ReactNode }) {
  return (
    <article id={`src-${source.id}`} className="scroll-mt-20 rounded-xl border border-ivory/10 bg-night/60 p-3">
      <header className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-[color:var(--accent)]">[{n}]</span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ivory">{source.title}</p>
        {source.verified ? (
          <span className="text-[10px] text-mullai" title="Checked by a reviewer">✓ verified</span>
        ) : (
          <span className="text-[10px] text-gold" title="Not yet checked by a reviewer">unverified</span>
        )}
      </header>
      <p className="mt-0.5 text-xs text-ivory-dim">{source.locator}</p>
      {source.excerpt && (
        <blockquote className="mt-2 border-l-2 border-[color:var(--accent)]/50 pl-2 text-sm text-ivory">{source.excerpt}</blockquote>
      )}
      {(source.href || footer) && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          {source.href ? (
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] hover:underline">
              Open source ↗
            </a>
          ) : (
            <span />
          )}
          {footer}
        </div>
      )}
    </article>
  );
}
