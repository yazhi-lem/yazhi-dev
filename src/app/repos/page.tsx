import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LINKS, REPOS, repoLinks } from "@/lib/content";
import { LOCALE_COOKIE, readLocaleFromCookies } from "@/lib/locale-cookie";
import { siteCopy, siteText } from "@/lib/site-copy";

/** The locale this request is in — from the cookie the root layout also
    reads (there is no `[locale]` route segment in this round). */
async function requestLocale() {
  const jar = await cookies();
  return readLocaleFromCookies(jar.get(LOCALE_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = siteCopy(locale);
  return {
    title: `${t("site.repos.title")} • Repositories — Yazhi`,
    description: t("site.repos.intro"),
  };
}

/** Repo index for contributors (Circle). Static: the list lives in
    lib/content.ts so it renders without calling GitHub at build or run
    time. Every line is read through the site catalogue, so Tamil, English
    and the machine-drafted Hindi come from one place; Tamil text never gets
    letter-spacing. */
export default async function ReposPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);
  const start = REPOS.map((r, index) => ({ r, index })).filter(({ r }) => !r.reference);
  const reference = REPOS.map((r, index) => ({ r, index })).filter(({ r }) => r.reference);

  return (
    <main lang={locale} className="mx-auto max-w-3xl px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.repos.title")}</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-ivory-dim">{t("site.repos.intro")}</p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label={t("site.repos.title")}>
        {start.map(({ r, index }) => {
          const links = repoLinks(r.name);
          return (
            <li key={r.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="font-display text-lg font-semibold">
                <a href={links.repo} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.name}
                </a>
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ivory-dim">
                {t(`site.repos.what.${index}`, undefined, { listingTerms: true })}
              </p>
              <p className="mt-2 text-xs text-ivory-dim/80">{r.lang}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href={links.goodFirstIssues} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] hover:underline">
                  {t("site.repos.goodFirst")}
                </a>
                <a href={links.issues} target="_blank" rel="noopener noreferrer" className="text-ivory-dim hover:text-ivory hover:underline">
                  {t("site.repos.allIssues")}
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-sm text-ivory-dim">
        {t("site.repos.note")}{" "}
        <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="underline hover:text-ivory">
          Discord
        </a>
      </p>

      {reference.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-base font-semibold text-ivory-dim">{t("site.repos.reference")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-ivory-dim">
            {reference.map(({ r, index }) => (
              <li key={r.name}>
                <a href={repoLinks(r.name).repo} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.name}
                </a>{" "}
                — {siteText(`site.repos.what.${index}`, locale, { listingTerms: true })}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
