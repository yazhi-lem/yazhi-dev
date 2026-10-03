import type { ReactNode } from "react";

/** Shared section container: centred column, comfortable responsive
    side padding, one vertical rhythm for every home section. */
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
      className={`mx-auto max-w-[var(--max-w)] px-6 py-[var(--space-section)] sm:px-8 lg:px-10 ${className}`.trim()}
    >
      {children}
    </section>
  );
}
