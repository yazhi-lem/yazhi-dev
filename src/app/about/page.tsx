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
    title: t("site.about.metadataTitle"),
    description: t("site.about.description"),
  };
}

const linkClass =
  "text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory";

/** The trust page: who we are, what we're building, what the countdown
    means, how to reach us. Answers the questions a parent (or anyone
    cautious) asks before sharing anything with an unfamiliar site.

    Copy is read from the site catalogue for the request's locale: Tamil,
    English, or the machine-drafted Hindi (marked for native review). */
export default async function AboutPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);

  return (
    <main lang={locale} className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.about.title")}</h1>

      <section className="mt-10 space-y-8 leading-relaxed text-ivory-dim">
        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.about.what.q")}</h2>
          <p>{t("site.about.what.p1")}</p>
          <p className="mt-2">{t("site.about.what.p2")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.about.building.q")}</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>{t("site.about.building.adhan")}</li>
            <li>
              <strong className="text-ivory">Adhan (அதன்)</strong> — our open Indic foundation model, built for
              22+ Indian languages, starting with Tamil and then the rest of the Dravidian family. It is still in
              training; our roadmap, not a release, is where the language count lives today.
            </li>
            <li>
              <strong className="text-ivory">Sangam (சங்கம்)</strong> — analysis of classical Tamil literature
              through the five landscapes (ஐந்திணை) of Sangam poetry. Live at{" "}
              <a
                href="https://sangam.yazhi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
              >
                sangam.yazhi.dev
              </a>
              .
            </li>
            <li>{t("site.about.building.yazh")}</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.about.countdown.q")}</h2>
          <p>
            {t("site.about.countdown.pre")}{" "}
            <strong className="text-ivory">
              {t("site.about.countdown.bold", { date: t("site.about.countdown.date") })}
            </strong>
            {t("site.about.countdown.post")}
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.about.landscapes.q")}</h2>
          <p>{t("site.about.landscapes.p")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">{t("site.about.who.q")}</h2>
          <p>
            {t("site.about.who.p1")}{" "}
            <a href="https://github.com/yazhi-lem" target="_blank" rel="noopener noreferrer" className={linkClass}>
              github.com/yazhi-lem
            </a>{" "}
            {t("site.about.who.p2")}{" "}
            <Link href="/privacy" className={linkClass}>
              {t("site.about.who.p3")}
            </Link>
            {t("site.about.who.p4")}
          </p>
        </div>
      </section>
    </main>
  );
}
