import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, readLocaleFromCookies } from "@/lib/locale-cookie";
import { siteCopy } from "@/lib/site-copy";

async function requestLocale() {
  const jar = await cookies();
  return readLocaleFromCookies(jar.get(LOCALE_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = siteCopy(locale);
  return {
    title: t("site.privacy.metadataTitle"),
    description: t("site.privacy.description"),
  };
}

/** Plain-language privacy note. Deliberately readable by a parent in two
    minutes — and kept honest: it describes what the site actually does
    today, not a boilerplate maximal license. When accounts move
    server-side, this page must be updated BEFORE anything is collected.

    Copy comes from the site catalogue for the request's locale. The Tamil
    and Hindi bodies are DRAFTS pending native review (see
    `docs/i18n/HINDI-REVIEW.md`). */
export default async function PrivacyPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);

  return (
    <main lang={locale} className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.privacy.title")}</h1>
      <p className="mt-2 text-sm text-ivory-dim">{t("site.privacy.updated")}</p>

      <section className="mt-10 space-y-8 leading-relaxed text-ivory-dim">
        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.collect.q")}</h2>
          <p>{t("site.privacy.collect.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.location.q")}</h2>
          <p>{t("site.privacy.location.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.links.q")}</h2>
          <p>{t("site.privacy.links.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.children.q")}</h2>
          <p>{t("site.privacy.children.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.changes.q")}</h2>
          <p>{t("site.privacy.changes.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.privacy.contact.q")}</h2>
          <p>
            {t("site.privacy.contact.p")}{" "}
            <a
              href="https://github.com/yazhi-lem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
            >
              github.com/yazhi-lem
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
