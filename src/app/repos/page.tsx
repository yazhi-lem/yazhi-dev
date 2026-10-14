import type { Metadata } from "next";
import Link from "next/link";
import { LINKS, REPOS, REPO_INDEX, repoLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "களஞ்சியங்கள் • Repositories — Yazhi",
  description: "Yazhi's open-source repositories on GitHub, what each one is for, and where to start contributing.",
};

/** Repo index for contributors (Circle). Static: the list lives in
    lib/content.ts so it renders without calling GitHub at build or run
    time. Tamil strings are drafts pending native review; Tamil text never
    gets letter-spacing. */
export default function ReposPage() {
  const start = REPOS.filter((r) => !r.reference);
  const reference = REPOS.filter((r) => r.reference);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        ← யாழி · Yazhi
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">
        <span lang="ta">{REPO_INDEX.titleTa}</span> <span className="text-ivory-dim">·</span>{" "}
        <span lang="en">{REPO_INDEX.titleEn}</span>
      </h1>
      <p lang="en" className="mt-4 max-w-prose leading-relaxed text-ivory-dim">
        {REPO_INDEX.introEn}
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Repositories">
        {start.map((r) => {
          const links = repoLinks(r.name);
          return (
            <li key={r.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="font-display text-lg font-semibold">
                <a href={links.repo} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.name}
                </a>
              </h2>
              <p lang="en" className="mt-1 text-sm leading-relaxed text-ivory-dim">{r.what}</p>
              <p className="mt-2 text-xs text-ivory-dim/80">{r.lang}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={links.goodFirstIssues} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] hover:underline">
                  Good first issues →
                </a>
                <a href={links.issues} target="_blank" rel="noopener noreferrer" className="text-ivory-dim hover:text-ivory hover:underline">
                  All open issues
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p lang="en" className="mt-6 text-sm text-ivory-dim">
        {REPO_INDEX.noteEn}{" "}
        <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="underline hover:text-ivory">
          Discord
        </a>
      </p>

      {reference.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-base font-semibold text-ivory-dim">Reference</h2>
          <ul className="mt-2 space-y-1 text-sm text-ivory-dim">
            {reference.map((r) => (
              <li key={r.name}>
                <a href={repoLinks(r.name).repo} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.name}
                </a>{" "}
                — {r.what}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
