import type { ReactNode } from "react";

/** Shared section container. All main content sections used the same
    `mx-auto max-w-[var(--max-w)] px-5` pattern independently, which had
    two problems:

    1. `px-5` (20px) is barely any breathing room once the viewport
       narrows toward `--max-w` (72rem) — headings ended up reading as
       flush against the left edge instead of comfortably inset.
    2. On large screens the fixed left ThinaiRail (`left-6`, ~lg:24px +
       its own width) sits close enough to that same edge that section
       headings could visually collide/overlap with it.

    Centralising the container here fixes both: a wider, responsive
    horizontal padding, plus extra left clearance on `lg+` so content
    never sits under the rail. */
export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[var(--max-w)] px-6 py-[var(--space-section)] sm:px-8 lg:pl-28 lg:pr-10 ${className}`.trim()}
    >
      {children}
    </section>
  );
}
