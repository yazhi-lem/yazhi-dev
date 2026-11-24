import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LINKS } from "@/lib/content";
import { MANIFESTO } from "@/lib/manifesto";
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

const ctaClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.02]";

/** The trust page: who we are, what we're building, what the countdown
    means, how to reach us — and the full Yazhi Manifesto. Answers the
    questions a parent (or anyone cautious) asks before sharing anything
    with an unfamiliar site.

    Copy is read from the site catalogue for the request's locale: Tamil,
    English, or the machine-drafted Hindi (marked for native review). The
    manifesto body is the English original, marked `lang="en"`. */
export default async function AboutPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);

  const joinCtas = (
    <div className="mt-5 flex flex-wrap gap-3">
      <a
        href={LINKS.discord}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ctaClass} bg-[#5865F2] text-white`}
      >
        {t("site.about.cta.discord")}
      </a>
      <a
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ctaClass} bg-[#25D366] text-night`}
      >
        {t("site.about.cta.whatsapp")}
      </a>
    </div>
  );

  return (
    <main lang={locale} className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.about.title")}</h1>

      <section className="mt-8 rounded-3xl border border-ivory/10 bg-ivory/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold text-ivory">
          {t("site.about.cta.heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          {t("site.about.cta.body")}
        </p>
        {joinCtas}
      </section>

      <section className="mt-12 space-y-8 leading-relaxed text-ivory-dim">
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

      <section className="mt-16 border-t border-ivory/10 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
          {t("site.about.manifesto.tagline")}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold">
          {t("site.about.manifesto.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          {t("site.about.manifesto.subtitle")}
        </p>

        <blockquote className="mt-6 border-l-2 border-[color:var(--accent)] pl-4">
          <p lang="ta" className="font-display text-lg text-ivory">
            {t("site.about.manifesto.quote", undefined, { language: "ta" })}
          </p>
          <p lang="en" className="mt-1 text-sm text-ivory-dim">
            {t("site.about.manifesto.quoteTranslation", undefined, { language: "en" })}
          </p>
        </blockquote>

        <p className="mt-4 text-xs text-ivory-dim">
          {t("site.about.manifesto.note")}
        </p>

        <div lang="en" className="mt-8 space-y-8 leading-relaxed text-ivory-dim">
          {MANIFESTO.sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-lg font-semibold text-ivory">{section.title}</h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-2">
                  {paragraph}
                </p>
              ))}
              {section.pillars?.map((pillar) => (
                <div key={pillar.title} className="mt-4">
                  <h4 className="font-semibold text-ivory">{pillar.title}</h4>
                  <p className="mt-1">{pillar.paragraph}</p>
                  <ul className="mt-2 list-inside list-disc space-y-2">
                    {pillar.bullets.map((bullet) => (
                      <li key={bullet.label}>
                        <strong className="text-ivory">{bullet.label}:</strong> {bullet.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {section.bullets && (
                <ul className="mt-2 list-inside list-disc space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.label}>
                      <strong className="text-ivory">{bullet.label}:</strong> {bullet.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-ivory/10 bg-ivory/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold text-ivory">
          {t("site.about.cta.heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          {t("site.about.cta.body")}
        </p>
        {joinCtas}
      </section>
    </main>
  );
}
