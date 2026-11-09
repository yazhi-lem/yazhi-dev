/** The locale cookie — a pure, framework-free helper pair.

    The root layout (owned by the Lead) reads this cookie on the server so
    `<html lang>` is right in the server-rendered HTML, and again on the
    client (`LocaleSwitcher`, `LangProvider`) so the first paint after a
    switch is right without a reload.

    Deliberately free of `next/headers` and `server-only`: a server
    component can `cookies().get(LOCALE_COOKIE)?.value` and hand the string
    here, and a client component can do the same with `document.cookie`.
    Nothing here touches React.

    Parity rule: the same cookie is mirrored into `localStorage`
    (`yazhi-locale`) by the client provider, so an ad-blocked or
    cookie-less browser still remembers the choice, and the server layout
    keeps working when storage is unavailable. */

import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "@yazhi/i18n";

/** The cookie name. Also the client's localStorage key (`yazhi-locale`). */
export const LOCALE_COOKIE = "yazhi-locale";

/** One year, in seconds — the preference is not a session value. */
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

/** A cookie value from `document.cookie` / `cookies().get()` → a Locale.
    Anything unknown (absent, `"fr"`, a truncated tag) falls back to Tamil,
    the site's default, so a bad cookie can never blank the page. */
export function readLocaleFromCookies(cookieValue: string | undefined): Locale {
  if (!cookieValue) return DEFAULT_LOCALE;
  let decoded = cookieValue;
  try {
    decoded = decodeURIComponent(cookieValue);
  } catch {
    // a malformed percent-escape is just an unknown locale
  }
  return normalizeLocale(decoded);
}

/** The `Set-Cookie` value for a locale: `Path=/`, `SameSite=Lax`,
    `Max-Age` one year, and `Secure` in production. Pure string building — no
    `document` access — so it works identically on the server and in the
    browser. Shared code must not statically import `server-only`, so the
    deployment mode is detected defensively (inlined by Next at build time
    for the bundles it compiles). */
export function serializeLocaleCookie(locale: Locale): string {
  const secure = typeof process !== "undefined" && process.env?.NODE_ENV === "production" ? "; Secure" : "";
  return `${LOCALE_COOKIE}=${encodeURIComponent(normalizeLocale(locale))}; Path=/; SameSite=Lax; Max-Age=${LOCALE_MAX_AGE}${secure}`;
}

/** Parse a locale out of a raw `document.cookie` string (client helper). */
export function localeFromCookieString(cookieString: string | null | undefined): Locale {
  if (!cookieString) return DEFAULT_LOCALE;
  for (const part of cookieString.split(";")) {
    const [name, ...rest] = part.split("=");
    if (name?.trim() === LOCALE_COOKIE) return readLocaleFromCookies(rest.join("=").trim());
  }
  return DEFAULT_LOCALE;
}
