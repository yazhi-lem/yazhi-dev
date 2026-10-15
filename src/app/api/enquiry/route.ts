import { NextRequest, NextResponse } from "next/server";
import { asksFor, getProject } from "@/lib/projects";
import { ENQUIRY_LIMITS, validContact, type EnquiryErrorCode, type EnquiryRequest, type EnquiryResponse } from "@/lib/enquiry/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Enquiries from the project pages.

   The route validates and forwards; it stores nothing itself. Where it
   forwards is YAZHI_ENQUIRY_URL — an inbox endpoint on Yazhi's own
   servers (Aram 2: never a third-party form service), called with
   YAZHI_ENQUIRY_TOKEN as a bearer token when set. Unset, the route says
   so (503 "unconfigured") and the form tells the person plainly that
   nothing was sent, with another way to reach us (Aram 5). */
const INBOX = process.env.YAZHI_ENQUIRY_URL;
const TOKEN = process.env.YAZHI_ENQUIRY_TOKEN;

const HTTP: Record<EnquiryErrorCode, number> = { bad_request: 400, rate_limited: 429, unconfigured: 503, upstream: 502 };

function fail(code: EnquiryErrorCode, message: string, field?: keyof EnquiryRequest) {
  return NextResponse.json<EnquiryResponse>(
    { ok: false, error: { code, message, ...(field ? { field } : {}) } },
    { status: HTTP[code], headers: { "Cache-Control": "no-store" } },
  );
}

// best effort, per server instance: 5 enquiries per address per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();
function limited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > 16_000) return fail("bad_request", "The enquiry is too long.");

  let body: Partial<EnquiryRequest>;
  try {
    body = await req.json();
  } catch {
    return fail("bad_request", "The request body is not valid JSON.");
  }

  const project = getProject(str(body.project));
  if (!project) return fail("bad_request", "Unknown project.", "project");

  // a filled honeypot gets a quiet success and goes nowhere
  if (str(body.website)) return NextResponse.json<EnquiryResponse>({ ok: true, reference: "—" });

  const name = str(body.name);
  const contact = str(body.contact);
  const organisation = str(body.organisation);
  const message = str(body.message);
  const asks = asksFor(project);
  const interest = Number(body.interest);

  if (!name || name.length > ENQUIRY_LIMITS.name) return fail("bad_request", "Please give your name.", "name");
  if (!validContact(contact) || contact.length > ENQUIRY_LIMITS.contact) {
    return fail("bad_request", "Please give an email address or a phone number we can reply to.", "contact");
  }
  if (organisation.length > ENQUIRY_LIMITS.organisation) return fail("bad_request", "The organisation name is too long.", "organisation");
  if (!Number.isInteger(interest) || interest < 0 || interest >= asks.length) return fail("bad_request", "Please choose what you're enquiring about.", "interest");
  if (message.length < ENQUIRY_LIMITS.minMessage || message.length > ENQUIRY_LIMITS.message) {
    return fail("bad_request", `Please write between ${ENQUIRY_LIMITS.minMessage} and ${ENQUIRY_LIMITS.message} characters.`, "message");
  }
  if (body.adult !== true) return fail("bad_request", "Enquiries are for adults (18 and over).", "adult");
  if (body.consent !== true) return fail("bad_request", "Please agree to how we'll use these details.", "consent");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return fail("rate_limited", "Too many enquiries from here — please try again in a few minutes.");

  if (!INBOX) return fail("unconfigured", "The enquiry inbox is not connected yet. Nothing was sent.");

  const reference = `YZ-${project.slug.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  try {
    const res = await fetch(INBOX, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
      body: JSON.stringify({
        reference,
        project: project.slug,
        interest: asks[interest].en,
        name,
        contact,
        organisation: organisation || undefined,
        message,
        lang: body.lang === "ta" || body.lang === "en" ? body.lang : "both",
        receivedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fail("upstream", "The enquiry inbox did not accept the message.");
  } catch {
    return fail("upstream", "The enquiry inbox could not be reached.");
  }

  return NextResponse.json<EnquiryResponse>({ ok: true, reference }, { headers: { "Cache-Control": "no-store" } });
}
