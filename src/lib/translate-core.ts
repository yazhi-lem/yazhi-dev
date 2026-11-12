/** Translation memory — the server half.

    `/api/translate` is a thin, honest route over this module. It keeps the
    translation memory small on purpose: there is no database here yet, so
    the memory is a process-local map (on `globalThis`, so a dev-server
    reload does not drop it), plus one upstream provider call when — and
    only when — a provider is configured.

    Honesty rules the module enforces (ROUTE-CONTRACTS §A, and the Lead's
    ruling for the unconfigured case):

      - With no provider configured, nothing is invented: every entry comes
        back as `origin: "mt", reviewRequired: true` with
        `warnings: ["translation memory unavailable: no provider configured"]`,
        and the route answers **200**, never a 404 or a crash.
      - A provider is called only when `YAZHI_TRANSLATE_URL` +
        `YAZHI_TRANSLATE_KEY` are set (or `YAZHI_API_URL` as the fallback
        endpoint). An unconfigured server never reaches out.
      - Provider output is saved as `origin: "ai"`/`"mt"`, `reviewRequired:
        true`, and is never served as `reviewed`.
      - Inputs are bounded before any work happens: ≤ `MAX_TRANSLATE_ENTRIES`
        entries, ≤ `MAX_TRANSLATE_CHARS` characters per entry.

    The pure parts (`parseTranslatePost`, `validateGet`, `fallbackResults`,
    `boundedBody`) carry no Node/Next imports so `node --test` can exercise
    them directly — that is the file this module's test imports. */

import type { Locale } from "@yazhi/i18n";

/** The same caps the browser client (`packages/i18n/src/translate.ts`)
    enforces, so the two ends of the contract agree. */
export const MAX_TRANSLATE_ENTRIES = 200;
export const MAX_TRANSLATE_CHARS = 2000;

/** Transport cap for the whole POST body. 200 entries × 2000 characters is
    400 KB of *text*; Tamil is 3 bytes per code point, so the JSON body can
    exceed that by roughly 3× — the semantic per-entry cap does the real
    bounding, and this transport cap only stops a pathological upload. */
export const MAX_TRANSLATE_BODY_BYTES = 1024 * 1024;

export const TRANSLATION_UNAVAILABLE_WARNING =
  "translation memory unavailable: no provider configured";

/** One entry in a POST body. */
export type TranslateInput = {
  /** Catalogue key, e.g. `"site.nav.guardian"`. */
  key: string;
  /** The text to translate — English by default. */
  text: string;
  /** Optional note for the translator (screen, tone). */
  context?: string;
};

export type TranslatePostBody = {
  locale: Locale;
  strings: TranslateInput[];
  /** The language `text` is written in. Only `"en"` is supported today. */
  source: "en";
};

/** What a provider (or the memory) produced for one entry. `origin` mirrors
    the catalogue's provenance: "tm" is a reviewed memory hit, "ai"/"mt" are
    drafts and always carry `reviewRequired: true`. */
export type TranslateResult = {
  key: string;
  text: string;
  origin: "tm" | "reviewed" | "ai" | "mt";
  reviewRequired: boolean;
};

export type TranslatePostResponse = {
  locale: Locale;
  translations: TranslateResult[];
  warnings: string[];
};

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string; status: 400 | 413 | 422 };

const SUPPORTED_LOCALES = new Set(["ta", "en", "hi"]);

/** Human-readable, structured error text — never a stack trace. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validate a parsed POST body into `TranslatePostBody` (pure). */
export function parseTranslatePost(input: unknown): ParseResult<TranslatePostBody> {
  if (!isRecord(input)) return { ok: false, status: 422, error: "Body must be a JSON object." };

  const locale = input.locale;
  if (typeof locale !== "string" || !SUPPORTED_LOCALES.has(locale)) {
    return { ok: false, status: 400, error: `locale must be one of ta, en, hi (got ${JSON.stringify(locale)}).` };
  }

  const source = input.source ?? "en";
  if (source !== "en") {
    return { ok: false, status: 400, error: `source must be "en"; other source languages are not supported yet.` };
  }

  // The kernel's typed client sends `entries`; the Lead's brief names
  // `strings`. Both are accepted — same shape, first non-empty one wins.
  const raw = Array.isArray(input.strings) ? input.strings : Array.isArray(input.entries) ? input.entries : undefined;
  if (!raw) return { ok: false, status: 400, error: "strings must be an array of {key, text}." };
  if (raw.length === 0) return { ok: false, status: 400, error: "strings must not be empty." };
  if (raw.length > MAX_TRANSLATE_ENTRIES) {
    return { ok: false, status: 413, error: `At most ${MAX_TRANSLATE_ENTRIES} strings per request.` };
  }

  const strings: TranslateInput[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i];
    if (!isRecord(item)) return { ok: false, status: 422, error: `strings[${i}] must be an object.` };
    const key = item.key;
    // the kernel calls the field `source`; the Lead's brief calls it `text`
    const text = typeof item.text === "string" ? item.text : typeof item.source === "string" ? item.source : undefined;
    if (typeof key !== "string" || !key.trim()) {
      return { ok: false, status: 422, error: `strings[${i}].key must be a non-empty string.` };
    }
    if (typeof text !== "string" || !text.trim()) {
      return { ok: false, status: 422, error: `strings[${i}].text must be a non-empty string.` };
    }
    if (text.length > MAX_TRANSLATE_CHARS) {
      return { ok: false, status: 413, error: `strings[${i}].text exceeds ${MAX_TRANSLATE_CHARS} characters.` };
    }
    const context = typeof item.context === "string" ? item.context : undefined;
    strings.push({ key, text, ...(context ? { context } : {}) });
  }

  return { ok: true, value: { locale: locale as Locale, strings, source } };
}

/** Validate the GET query (pure). `q` is bounded by the same per-entry cap so
    a lookup can never be used to push a huge string into the provider. */
export function validateGet(params: { get(name: string): string | null }): ParseResult<{ locale: Locale; q: string }> {
  const locale = params.get("locale");
  if (!locale || !SUPPORTED_LOCALES.has(locale)) {
    return { ok: false, status: 400, error: `locale must be one of ta, en, hi (got ${JSON.stringify(locale)}).` };
  }
  const q = params.get("q");
  if (q === null || !q.trim()) return { ok: false, status: 400, error: "q must be a non-empty string." };
  if (q.length > MAX_TRANSLATE_CHARS) {
    return { ok: false, status: 413, error: `q exceeds ${MAX_TRANSLATE_CHARS} characters.` };
  }
  return { ok: true, value: { locale: locale as Locale, q } };
}

/** The honest answer when no provider is configured: nothing is invented,
    and every entry says so. `text` is the source text unchanged. */
export function fallbackResults(strings: TranslateInput[], origin: "mt" | "ai" = "mt"): TranslateResult[] {
  return strings.map((s) => ({ key: s.key, text: s.text, origin, reviewRequired: true }));
}

/** Read a request body, refusing to buffer more than `limit` bytes.

    Mirrors `readBoundedBody` in `src/lib/api/handlers/http.ts` (two gates,
    cheapest first) without importing `server-only`, so this module stays
    testable and the kernel keeps ownership of its own helper:

      1. an honest `Content-Length` over the cap is refused before reading;
      2. a chunked body is read chunk by chunk and abandoned the moment it
         passes the cap. */
export async function boundedBody(
  req: { headers: { get(name: string): string | null }; body: ReadableStream<Uint8Array> | null },
  limit: number = MAX_TRANSLATE_BODY_BYTES
): Promise<{ ok: true; body: string } | { ok: false; limit: number }> {
  const declared = req.headers.get("content-length");
  if (declared !== null) {
    const length = Number(declared);
    if (Number.isFinite(length) && length > limit) return { ok: false, limit };
  }
  if (!req.body) return { ok: true, body: "" };

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel().catch(() => {});
        return { ok: false, limit };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, body: text };
  } finally {
    reader.releaseLock?.();
  }
}
