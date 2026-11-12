// Manual + scripted translation.

/** The translation memory (TM) and the AI-draft path — the browser half only.

    SECRETS LIVE ON THE SERVER. This module never reads an environment
    variable and never calls a provider: it calls `/api/translate`, which
    holds the keys (`YAZHI_TRANSLATE_URL`/`YAZHI_TRANSLATE_KEY`, else
    `YAZHI_API_URL`) and enforces the Circle session. Contract:
    `docs/team/ROUTE-CONTRACTS-20261109.md` §A.

    Contract shapes (fixed — implement to them, do not change them):
      GET  /api/translate?locale=hi&q=<source>
           → { source, locale, text: string | null, origin: "tm" | "reviewed" | null }
      POST /api/translate  (Circle-gated, same-origin)
           body { locale, entries: [{ key, source, context? }] }   (≤200, ≤2000 chars)
           → { translation: string }                         (en + TM hit)
           | { results: [{ key, text, origin: "tm" | "ai" | "mt" }] }
           AI drafts are saved as origin "ai", reviewRequired: true, and are
           NEVER served as "reviewed". */

import type { Locale } from "./locale";
import type { TranslationEntry, TranslationLookup } from "./types";

/** The route the TM is served from. */
export const TRANSLATE_ENDPOINT = "/api/translate";

/** Limits the route enforces; checked client-side first so a bad batch
    fails fast with a clear message instead of a 400. */
export const MAX_ENTRIES = 200;
export const MAX_SOURCE_CHARS = 2000;

export type TranslateLookupParams = {
  locale: Locale;
  q: string;
  /** Injectable for tests and server-side callers. */
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
};

/** One TM lookup. Returns `{ text: null, origin: null }` when there is no
    hit — and also when the network fails, because an absent translation is
    not an error: the caller falls back to Tamil. */
export async function lookupTranslation({
  locale,
  q,
  fetchImpl = fetch,
  signal,
}: TranslateLookupParams): Promise<TranslationLookup> {
  const query = new URLSearchParams({ locale, q });
  try {
    const res = await fetchImpl(`${TRANSLATE_ENDPOINT}?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-cache",
      signal,
    });
    if (!res.ok) return { source: q, locale, text: null, origin: null };
    const body = (await res.json()) as Partial<TranslationLookup>;
    return {
      source: typeof body.source === "string" ? body.source : q,
      locale,
      text: typeof body.text === "string" && body.text ? body.text : null,
      origin: body.origin === "tm" || body.origin === "reviewed" ? body.origin : null,
    };
  } catch {
    return { source: q, locale, text: null, origin: null };
  }
}

export type TranslateEntryInput = {
  key: string;
  source: string;
  context?: string;
};

export type TranslateResult = {
  key: string;
  text: string;
  origin: "tm" | "ai" | "mt";
};

export type TranslateBatchParams = {
  locale: Locale;
  entries: TranslateEntryInput[];
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
};

export type TranslateBatchOutcome =
  | { results: TranslateResult[]; error?: undefined }
  | { results: []; error: string };

/** Ask the server for drafts. Throws nothing: returns `{ results: [] }` plus
    an `error` on a 401 (not signed in), 429 (over budget) or an unconfigured
    provider — translation degrades, it never takes the page down. */
export async function requestTranslations({
  locale,
  entries,
  fetchImpl = fetch,
  signal,
}: TranslateBatchParams): Promise<TranslateBatchOutcome> {
  if (entries.length === 0) return { results: [] };
  if (entries.length > MAX_ENTRIES) {
    return { results: [], error: `At most ${MAX_ENTRIES} entries per request.` };
  }
  const tooLong = entries.find((e) => e.source.length > MAX_SOURCE_CHARS);
  if (tooLong) {
    return { results: [], error: `Entry ${tooLong.key} exceeds ${MAX_SOURCE_CHARS} characters.` };
  }

  try {
    const res = await fetchImpl(TRANSLATE_ENDPOINT, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ locale, entries }),
      signal,
    });
    const body = (await res.json().catch(() => ({}))) as {
      results?: TranslateResult[];
      translation?: string;
      error?: string;
      code?: string;
    };
    if (!res.ok) {
      return { results: [], error: body.error ?? `Translation failed (${res.status}).` };
    }
    if (Array.isArray(body.results)) return { results: body.results };
    // The `locale === "en"` server path answers with one string.
    if (typeof body.translation === "string") {
      return { results: entries.map((e) => ({ key: e.key, text: body.translation as string, origin: "tm" })) };
    }
    return { results: [] };
  } catch {
    return { results: [], error: "Translation service unreachable." };
  }
}

/** Turn server results into catalogue entries. AI/MT drafts come back
    marked `reviewRequired: true` — the flag is what stops an unreviewed
    machine string from ever being treated as signed-off copy. */
export function toTranslationEntries(
  results: TranslateResult[]
): Record<string, TranslationEntry> {
  const out: Record<string, TranslationEntry> = {};
  for (const r of results) {
    if (!r.text) continue;
    // "tm" is a reviewed memory hit, so it is safe to serve; "ai"/"mt" are
    // drafts and stay flagged for native review.
    out[r.key] = {
      text: r.text,
      origin: r.origin === "tm" ? "reviewed" : r.origin,
      reviewRequired: r.origin !== "tm",
    };
  }
  return out;
}
