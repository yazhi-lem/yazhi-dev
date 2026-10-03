import Link from "next/link";
import type { ReactNode } from "react";
import { Demo } from "@/ui/docs/Demos";
import type { CatalogEntry } from "@/ui/docs/catalog";

/** Page header for a UI library section. */
export function LibraryHeader({ eyebrow, title, taTitle, children }: { eyebrow: string; title: string; taTitle: string; children: ReactNode }) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-gold">{eyebrow}</p>
      <h1 className="display mt-2 font-display text-4xl font-black text-ivory">
        {title} <span lang="ta" className="text-ivory-dim">· {taTitle}</span>
      </h1>
      <div className="mt-4 text-[1.05rem] leading-relaxed text-ivory-dim">{children}</div>
    </header>
  );
}

/** One catalog entry: name, apps, rule, live demo and usage. */
function EntryCard({ entry }: { entry: CatalogEntry }) {
  return (
    <article id={entry.slug} className="scroll-mt-20 rounded-2xl border border-ivory/10 bg-night-2/60 p-4 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-mono text-base font-medium text-ivory">
            <a href={`#${entry.slug}`} className="hover:text-gold">
              {entry.name}
            </a>
          </h2>
          <p className="mt-1 max-w-prose text-sm text-ivory-dim">{entry.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-1" aria-label="Used in">
          {entry.apps.map((a) => (
            <li key={a} className="rounded-full border border-ivory/15 px-2 py-0.5 text-[11px] text-ivory-dim">
              {a}
            </li>
          ))}
        </ul>
      </header>
      {entry.rule && (
        <p className="mt-2 text-xs text-gold">
          <span className="font-semibold">Enforces:</span> {entry.rule}
        </p>
      )}
      <div className="mt-4">
        <Demo slug={entry.slug} />
      </div>
      <details className="mt-3 group">
        <summary className="cursor-pointer text-xs text-ivory-dim hover:text-ivory">Usage</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/50 p-3 font-mono text-[12px] leading-relaxed text-ivory" data-lenis-prevent>
          {entry.usage}
        </pre>
      </details>
    </article>
  );
}

/** Index + cards for a list of catalog entries. */
export function CatalogGallery({ entries }: { entries: CatalogEntry[] }) {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[13rem_1fr]">
      <nav aria-label="On this page" className="hidden lg:block">
        <ul className="sticky top-20 space-y-1 text-sm">
          {entries.map((e) => (
            <li key={e.slug}>
              <a href={`#${e.slug}`} className="block truncate rounded px-2 py-1 font-mono text-[13px] text-ivory-dim hover:bg-ivory/5 hover:text-ivory">
                {e.name.split(" · ")[0]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 space-y-6">
        {entries.map((e) => (
          <EntryCard key={e.slug} entry={e} />
        ))}
      </div>
    </div>
  );
}

/** Import line shown at the top of the library pages. */
export function ImportLine({ names }: { names: string }) {
  return (
    <p className="mt-4 overflow-x-auto rounded-lg border border-ivory/10 bg-black/40 px-3 py-2 font-mono text-[12.5px] text-ivory">
      import {"{ "}
      {names}
      {" }"} from &quot;@/ui&quot;;
    </p>
  );
}

export function NextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-gold underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
