import "server-only";

/** The kernel's view of POST /api/translate — IMPLEMENTED by i18n-core.
 *
 *  The route is `src/app/api/translate/route.ts`, over `src/lib/translate.ts`
 *  and `src/lib/translate-core.ts` (all i18n-core's, not this lane's). It
 *  accepts `{ locale, strings: [{ key, text, context? }], source?: "en" }`
 *  and, for compatibility with the kernel's typed client, the same data
 *  spelled `entries: [{ key, source }]`.
 *
 *  The behaviour the kernel's docs and OpenAPI describe:
 *   - GET  ?locale&q       → 200 { source, locale, text: string|null, origin }
 *   - POST (Circle-gated)  → 200 { locale, translations[], warnings[] }
 *   - **no provider configured is 200**, not an error: every entry comes back
 *     `origin:"mt", reviewRequired:true` with the warning below
 *   - 400 malformed · 401 no session · 403 cross-site · 405 other methods ·
 *     413 too large · 422 wrong field types · 503 Circle outage
 *   - OPTIONS answers 204 with `Allow: GET, POST, OPTIONS`
 *
 *  Nothing here duplicates that logic; this module only lets other kernel code
 *  *name* the same warning without importing i18n-core's module graph. */

/** The exact warning string the route returns when no provider is set.
    Mirrors TRANSLATION_UNAVAILABLE_WARNING in src/lib/translate-core.ts —
    change them together. */
export const TRANSLATION_UNAVAILABLE_WARNING = "translation memory unavailable: no provider configured";

/** Does a translation provider exist right now? A convenience for reporting;
    the route itself remains the authority on how one is used. */
export function translationReady(): boolean {
  const url = process.env.YAZHI_TRANSLATE_URL;
  const key = process.env.YAZHI_TRANSLATE_KEY;
  return Boolean((url && key) || process.env.YAZHI_API_URL);
}
