import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { currentAccount, sameOrigin } from "@/lib/circle/session";
import { CircleCallError } from "@/lib/circle/client";
import {
  MAX_TRANSLATE_BODY_BYTES,
  TRANSLATION_UNAVAILABLE_WARNING,
  boundedBody,
  fallbackResults,
  parseTranslatePost,
  validateGet,
} from "@/lib/translate-core";
import { translateGet, translatePost } from "@/lib/translate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** `/api/translate` — the translation memory (ROUTE-CONTRACTS §A).

    GET  ?locale=hi&q=<source>   public lookup, cached at the edge
         → 200 { source, locale, text: string|null, origin: "tm"|"reviewed"|null }

    POST { locale, strings: [{key, text, context?}], source?: "en" }
         Circle-gated + same-origin  (the kernel's typed client sends
         `entries:[{key, source}]`; `source` is accepted as well)
         → 200 { locale, translations: [{key, text, origin, reviewRequired}],
                 warnings: string[] }

    Honest degradation is a hard rule (Lead's ruling): with no provider
    configured the route still answers **200**, every entry marked
    `origin:"mt"`, `reviewRequired:true`, and
    `warnings:["translation memory unavailable: no provider configured"]`.
    It never 404s, never invents a translation, and never calls a paid
    provider without a key.

    Status codes: 200 ok · 400 malformed · 401 no Circle session ·
    403 cross-site · 405 other methods · 413 body/entry too large ·
    422 wrong field types · 503 Circle outage. */

const NO_STORE = { "Cache-Control": "no-store" } as const;

function error(status: number, message: string, code: string) {
  return NextResponse.json({ error: message, code }, { status, headers: NO_STORE });
}

/** GET — public; a miss is `text: null`, never an error. */
export async function GET(req: NextRequest) {
  const parsed = validateGet(req.nextUrl.searchParams);
  if (!parsed.ok) return error(parsed.status, parsed.error, "bad_request");

  const lookup = await translateGet(parsed.value.locale, parsed.value.q);
  return NextResponse.json(lookup, {
    status: 200,
    headers: {
      // a hit is stable enough to sit at the edge; a miss may become a hit
      // after a review or a provider run, so it expires quickly
      "Cache-Control": lookup.text ? "public, max-age=60, s-maxage=300" : "public, max-age=0, s-maxage=30",
    },
  });
}

/** POST — bounded body first (cheapest gate), then same-origin, then Circle. */
export async function POST(req: NextRequest) {
  // 1. transport cap before any buffering (Content-Length, else a stream guard)
  const read = await boundedBody(req, MAX_TRANSLATE_BODY_BYTES);
  if (!read.ok) return error(413, `Request body exceeds ${read.limit} bytes.`, "payload_too_large");

  // 2. same-origin: this route writes into the memory, so a cross-site form
  //    must not be able to drive it
  if (!sameOrigin(req)) return error(403, "Cross-site request refused.", "forbidden");

  let json: unknown;
  try {
    json = JSON.parse(read.body);
  } catch {
    return error(400, "Invalid JSON body.", "bad_request");
  }

  const parsed = parseTranslatePost(json);
  if (!parsed.ok) {
    return error(parsed.status, parsed.error, parsed.status === 413 ? "payload_too_large" : "bad_request");
  }

  // 3. Circle session — a builder surface, not an anonymous one
  let account;
  try {
    account = await currentAccount();
  } catch (err) {
    return error(503, err instanceof CircleCallError ? err.message : "Circle session check failed.", "upstream_error");
  }
  if (!account) {
    return error(401, "Sign in with a Circle account to translate into the memory.", "unauthorized");
  }

  // 4. the work. Never throws: the worst case is the honest draft fallback.
  try {
    const body = await translatePost(parsed.value);
    return NextResponse.json(body, { status: 200, headers: NO_STORE });
  } catch {
    // a crash here would be worse than an empty, honest batch
    return NextResponse.json(
      {
        locale: parsed.value.locale,
        translations: fallbackResults(parsed.value.strings),
        warnings: [TRANSLATION_UNAVAILABLE_WARNING],
      },
      { status: 200, headers: NO_STORE }
    );
  }
}

const ALLOW = "GET, POST, OPTIONS";

function methodNotAllowed() {
  return NextResponse.json(
    { error: "Method not allowed. Use GET ?locale=&q= or POST {locale, strings}.", code: "method_not_allowed" },
    { status: 405, headers: { Allow: ALLOW, ...NO_STORE } }
  );
}

/** CORS preflight / proxy probe: a 204 with the allowed methods, so the
    route never looks absent (the kernel's OpenAPI and docs advertise it). */
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: ALLOW, ...NO_STORE } });
}

export function PUT() {
  return methodNotAllowed();
}
export function PATCH() {
  return methodNotAllowed();
}
export function DELETE() {
  return methodNotAllowed();
}
