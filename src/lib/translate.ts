/** Translation memory — server side, stateful half.

    Everything that needs Node or a provider lives here; the pure rules live
    in `translate-core.ts`. `/api/translate` (the route) is a few lines that
    call `translateGet` / `translatePost`.

    Provider precedence (ROUTE-CONTRACTS §A, first present wins):
      1. `YAZHI_TRANSLATE_URL` + `YAZHI_TRANSLATE_KEY` — an OpenAI-compatible
         chat-completions endpoint,
      2. else `YAZHI_API_URL` (no key required; the same host `/api/chat`
         talks to).
    With neither set, nothing is called and the route degrades honestly
    (see `fallbackResults`). */

import {
  MAX_TRANSLATE_ENTRIES,
  TRANSLATION_UNAVAILABLE_WARNING,
  fallbackResults,
  type TranslateInput,
  type TranslatePostBody,
  type TranslatePostResponse,
  type TranslateResult,
} from "./translate-core";
import type { Locale } from "@yazhi/i18n";

/* ── provider configuration ───────────────────────────────────────────── */

export type ProviderConfig = { url: string; key?: string; chatPath: string } | null;

/** The configured provider, or `null`. Read per request (not at import), so
    a `.env` change does not need a rebuild and tests can stub it. */
export function providerConfig(env: NodeJS.ProcessEnv = process.env): ProviderConfig {
  const chatPath = env.YAZHI_CHAT_PATH ?? "/v1/chat/completions";
  const translateUrl = env.YAZHI_TRANSLATE_URL?.trim();
  const translateKey = env.YAZHI_TRANSLATE_KEY?.trim();
  if (translateUrl && translateKey) return { url: translateUrl.replace(/\/$/, ""), key: translateKey, chatPath };
  const apiUrl = env.YAZHI_API_URL?.trim();
  // never call a paid provider without a key: the YAZHI_API_URL fallback is
  // the site's own backend, which does not require one
  if (apiUrl) return { url: apiUrl.replace(/\/$/, ""), chatPath };
  return null;
}

/* ── the memory itself ────────────────────────────────────────────────── */

export type MemoryHit = { text: string; origin: "tm" | "reviewed" | "ai" | "mt" };

type Memory = Map<string, MemoryHit>;

/** Process-global so a dev-server reload does not empty the memory in the
    middle of a session. Storage is explicitly NOT in scope this round
    (ROUTE-CONTRACTS §B says the same of the registry); this is the seam. */
const MEMORY_KEY = Symbol.for("yazhi.translateMemory.v1");

function memory(): Memory {
  const holder = globalThis as unknown as Record<symbol, Memory | undefined>;
  let mem = holder[MEMORY_KEY];
  if (!mem) {
    mem = new Map<string, MemoryHit>();
    holder[MEMORY_KEY] = mem;
  }
  return mem;
}

const memoryKey = (locale: Locale, source: string) => `${locale}\u0000${source}`;

/** A reviewed memory hit for `source`, or `null`. Drafts (`ai`/`mt`) are
    returned too, but the caller must never present them as reviewed — the
    route maps them to `origin:"ai"`/`"mt"`, `reviewRequired: true`. */
export function lookup(locale: Locale, source: string): MemoryHit | null {
  return memory().get(memoryKey(locale, source)) ?? null;
}

/** Save one result. Only `reviewed` and `tm` are stored as reviewed; provider
    output is stored as `ai`/`mt` with the draft flag intact. */
export function remember(locale: Locale, source: string, hit: MemoryHit): void {
  if (!source.trim() || !hit.text.trim()) return;
  memory().set(memoryKey(locale, source), hit);
}

/** Test/dev helper: forget everything (not exported from the route). */
export function clearMemory(): void {
  memory().clear();
}

/** Look up a batch: memory first, provider for the misses. */
async function translateMisses(
  locale: Locale,
  entries: TranslateInput[]
): Promise<{ results: TranslateResult[]; warnings: string[] }> {
  const results: TranslateResult[] = [];
  const warnings: string[] = [];
  const misses: TranslateInput[] = [];

  for (const entry of entries) {
    const hit = lookup(locale, entry.text);
    if (hit) {
      const reviewed = hit.origin === "reviewed" || hit.origin === "tm";
      results.push({ key: entry.key, text: hit.text, origin: hit.origin, reviewRequired: !reviewed });
    } else {
      misses.push(entry);
    }
  }

  if (misses.length === 0) return { results, warnings };

  const config = providerConfig();
  if (!config) {
    // Nothing configured: no invention, no network. Every miss is returned
    // as the source text marked as a machine draft that needs review.
    results.push(...fallbackResults(misses));
    warnings.push(TRANSLATION_UNAVAILABLE_WARNING);
    return { results, warnings };
  }

  seenProviderFailure = false;
  const generated = await callProvider(config, locale, misses);
  if (!generated) {
    results.push(...fallbackResults(misses));
    warnings.push(TRANSLATION_UNAVAILABLE_WARNING);
    return { results, warnings };
  }
  results.push(...generated);
  return { results, warnings };
}

/* ── the provider ─────────────────────────────────────────────────────── */

/** Latched per request; reset at the start of each provider call. */
let seenProviderFailure = false;

const TARGET_LANGUAGE: Record<Locale, string> = { ta: "Tamil", en: "English", hi: "Hindi" };

function systemPrompt(locale: Locale): string {
  return [
    `You are a professional localiser for yazhi.dev, a Tamil-first technology site.`,
    `Translate each English UI string into ${TARGET_LANGUAGE[locale] ?? locale}.`,
    `Rules: keep brand and technical terms unchanged (Yazhi, Yazh, Adhan, Open Sangam, Mission Control, Bubble UI, yazhi-api, GitHub, Discord); copy any {placeholder} verbatim and never translate inside braces; keep the tone short and plain; never add explanations.`,
    `Answer ONLY with a JSON object: {"translations": [{"key": "<key>", "text": "<translation>"}]} containing exactly the keys you were given.`,
  ].join("\n");
}

/** One provider call for the misses. Returns `null` on any failure (bad
    keys, network, malformed payload) — the caller degrades, never crashes. */
async function callProvider(
  config: NonNullable<ProviderConfig>,
  locale: Locale,
  misses: TranslateInput[]
): Promise<TranslateResult[] | null> {
  const payload = {
    model: process.env.YAZHI_TRANSLATE_MODEL ?? "adhan",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt(locale) },
      {
        role: "user",
        content: JSON.stringify(misses.map((m) => ({ key: m.key, text: m.text, ...(m.context ? { context: m.context } : {}) }))),
      },
    ],
  };

  let res: Response;
  try {
    res = await fetch(`${config.url}${config.chatPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.key ? { Authorization: `Bearer ${config.key}` } : {}),
      },
      body: JSON.stringify(payload),
      // a hung provider must not hold the request open forever
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const raw = await res.text().catch(() => "");
  const content = extractMessage(raw);
  if (!content) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripFences(content));
  } catch {
    return null;
  }
  const rows = (parsed as { translations?: unknown })?.translations;
  if (!Array.isArray(rows)) return null;

  const byKey = new Map<string, string>();
  for (const row of rows) {
    if (row && typeof row === "object") {
      const { key, text } = row as { key?: unknown; text?: unknown };
      if (typeof key === "string" && typeof text === "string" && text.trim()) byKey.set(key, text.trim());
    }
  }

  const out: TranslateResult[] = [];
  for (const miss of misses) {
    const text = byKey.get(miss.key);
    // a missing key from the provider is not a translation: fall back to the
    // honest draft rather than pretending it was translated
    if (!text) {
      out.push({ key: miss.key, text: miss.text, origin: "mt", reviewRequired: true });
      continue;
    }
    const result: TranslateResult = { key: miss.key, text, origin: "ai", reviewRequired: true };
    remember(locale, miss.text, { text, origin: "ai" });
    out.push(result);
  }
  return out;
}

/** OpenAI-compatible response → the assistant's message content. Handles a
    plain-text body too (some servers answer with the string directly). */
function extractMessage(raw: string): string | null {
  if (!raw.trim()) return null;
  try {
    const json = JSON.parse(raw) as { choices?: { message?: { content?: unknown } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
  } catch {
    // not JSON — treat it as the content itself
  }
  return raw;
}

function stripFences(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : text).trim();
}

/* ── request handlers' shared logic (used by the route) ───────────────── */

/** GET ?locale=&q= — public memory lookup. A miss is a 200 with
    `text: null`, never an error: the caller falls back to Tamil. */
export async function translateGet(locale: Locale, q: string): Promise<{
  source: string;
  locale: Locale;
  text: string | null;
  origin: "tm" | "reviewed" | null;
}> {
  const hit = lookup(locale, q);
  const reviewed = hit && (hit.origin === "reviewed" || hit.origin === "tm");
  return {
    source: q,
    locale,
    text: hit?.text ?? null,
    origin: reviewed ? (hit!.origin as "tm" | "reviewed") : null,
  };
}

/** POST — translate a batch into the memory (or say honestly that it could
    not). The route does the auth/body work; this never throws. */
export async function translatePost(body: TranslatePostBody): Promise<TranslatePostResponse> {
  const bounded = body.strings.slice(0, MAX_TRANSLATE_ENTRIES);
  const { results, warnings } = await translateMisses(body.locale, bounded);
  return { locale: body.locale, translations: results, warnings };
}
