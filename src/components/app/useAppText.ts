"use client";
/** The active locale and copy lookup for every client component under `/app`.

    One hook, so the whole host reads the locale the same way: the site's
    `<LangProvider>` (src/lib/i18n.tsx) owns it — a cookie resolved by the
    root layout, restored after hydration. `useLocale()` is i18n-core's
    additive hook and deliberately THROWS outside a provider; `/app` is
    always under the root layout, but the canvas is also embedded in other
    pages, so the read is guarded and degrades to Tamil rather than taking a
    whole screen down.

    `useAppText()` returns the lookup: `t("app.title")`. See `./copy.ts` for
    where the strings live and the TODO to move them into `@yazhi/i18n`
    (`app.*` namespace, absorbed by i18n-core in a follow-up). */

import { useLocale } from "@/lib/i18n";
import { DEFAULT_LOCALE, type Locale } from "@yazhi/i18n";
import { appText, type AppKey } from "./copy";

export function useAppLocale(): Locale {
  try {
    const { locale } = useLocale();
    return locale ?? DEFAULT_LOCALE;
  } catch {
    // outside <LangProvider> (an embedded render, a test): Tamil, the default
    return DEFAULT_LOCALE;
  }
}

export function useAppText(): (key: AppKey, params?: Record<string, string | number>) => string {
  const locale = useAppLocale();
  return (key, params) => appText(locale, key, params);
}
