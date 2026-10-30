import type { ReactNode } from "react";

/** The raised surface every module sits on: ink ground, hairline border,
    optional eyebrow, title and actions row. */
export function Panel({
  title,
  eyebrow,
  actions,
  children,
  className = "",
  accentEdge = false,
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** a left edge in the app's accent — for the primary panel on a page */
  accentEdge?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-ivory/10 bg-night-2/80 ${accentEdge ? "border-l-2 border-l-[color:var(--accent)]" : ""} ${className}`}
    >
      {(title || eyebrow || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-ivory/10 px-4 py-3">
          <div className="min-w-0">
            {eyebrow && <div className="mb-0.5 text-[11px] text-[color:var(--accent)]">{eyebrow}</div>}
            {title && <h3 className="truncate text-sm font-semibold text-ivory">{title}</h3>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

/** Shown when a list or view has nothing in it yet. */
export function EmptyState({ title, hint, action }: { title: string; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-ivory/15 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-ivory">{title}</p>
      {hint && <p className="max-w-sm text-xs text-ivory-dim">{hint}</p>}
      {action}
    </div>
  );
}
