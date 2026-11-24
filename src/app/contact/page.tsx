import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LINKS } from "@/lib/content";
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
    title: t("site.contact.title"),
    description: t("site.contact.description"),
  };
}

const ctaClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.02]";

/** Contact: the two chat channels first, because they are where the
    community actually is, then the open work on GitHub. */
export default async function ContactPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);

  return (
    <main lang={locale} className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.contact.title")}</h1>
      <p className="mt-3 leading-relaxed text-ivory-dim">{t("site.contact.intro")}</p>

      <div className="mt-8 rounded-3xl border border-ivory/10 bg-ivory/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold text-ivory">
          {t("site.about.cta.heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          {t("site.about.cta.body")}
        </p>
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
        <p className="mt-4 text-xs leading-relaxed text-ivory-dim">{t("site.contact.note")}</p>
      </div>

      <div className="mt-8 rounded-3xl border border-ivory/10 bg-ivory/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold text-ivory">GitHub</h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
          >
            github.com/yazhi-lem
          </a>
        </p>
      </div>
    </main>
  );
}
