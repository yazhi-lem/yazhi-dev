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
    title: t("site.services.title"),
    description: t("site.services.description"),
  };
}

const PRODUCTS = [
  { titleKey: "site.services.yazh.title", bodyKey: "site.about.building.yazh" },
  { titleKey: "site.services.adhan.title", bodyKey: "site.about.building.adhan" },
  { titleKey: "site.services.sangam.title", bodyKey: "site.about.building.sangam" },
] as const;

/** The three products, one sovereign foundation. A short public page for
    the Services link in the bar. */
export default async function ServicesPage() {
  const locale = await requestLocale();
  const t = siteCopy(locale);

  return (
    <main lang={locale} className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        {t("site.about.backLink")}
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">{t("site.services.title")}</h1>
      <p className="mt-3 leading-relaxed text-ivory-dim">{t("site.services.intro")}</p>

      <div className="mt-10 space-y-8">
        {PRODUCTS.map((product) => (
          <section key={product.titleKey} className="rounded-3xl border border-ivory/10 bg-ivory/[0.03] p-6">
            <h2 className="font-display text-xl font-semibold text-ivory">{t(product.titleKey)}</h2>
            <p className="mt-2 leading-relaxed text-ivory-dim">{t(product.bodyKey)}</p>
          </section>
        ))}
      </div>

      <Link
        href="/contact"
        className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 font-semibold text-night transition-colors hover:bg-ivory"
      >
        {t("site.services.cta")} →
      </Link>
    </main>
  );
}
