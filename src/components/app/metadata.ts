/** Localised metadata for `/app` — shared by the route's layout and its page,
    which both export the same `generateMetadata` so a `?b=` deep link and the
    bare route produce one canonical head.

    The locale comes from the same cookie the root layout reads
    (`src/lib/locale-cookie.ts`), so the `<title>` and `<html lang>` agree.
    Canonical and hreflang are emitted for every locale the site knows; the
    locale is a cookie today (BOUNDARIES: "no `[locale]` segment in this
    round"), so each alternate currently points at the same path and the
    cookie decides the copy. Declaring them now means prefix routing later
    only changes the URLs here, not the page.

    Request-time only (`cookies()`): this module is imported by server files,
    never by a client component. */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LOCALES, toBcp47, type Locale } from "@yazhi/i18n";
import { readLocaleFromCookies, LOCALE_COOKIE } from "@/lib/locale-cookie";
import { appText } from "./copy";

/** The public origin. Set `NEXT_PUBLIC_SITE_URL` on a mirror; yazhi.dev is
    the canonical deployment and the default. */
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://yazhi.dev";

/** The route, as a constant so the sitemap and robots agree with this head. */
export const APP_PATH = "/app";

/** The locale this request is in — server side, from the cookie. A missing or
    malformed cookie is Tamil, the site default; this never throws, because a
    bad cookie must not be able to blank a page. */
export async function requestLocale(): Promise<Locale> {
  try {
    const jar = await cookies();
    return readLocaleFromCookies(jar.get(LOCALE_COOKIE)?.value);
  } catch {
    return "ta";
  }
}

export async function appMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const url = `${SITE_ORIGIN}${APP_PATH}`;
  const title = `${appText(locale, "app.title")} — ${appText(locale, "app.brand")}`;
  const description = appText(locale, "app.intro");
  const languages: Record<string, string> = { "x-default": url };
  for (const l of LOCALES) languages[toBcp47(l)] = url;
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      locale: toBcp47(locale),
      siteName: "Yazhi",
    },
  };
}
