import { NextRequest, NextResponse } from "next/server";

/** Auto-detected node region for onboarding — anonymized by design.
    Vercel's edge network resolves the request IP to city/region/country
    headers before this route ever runs; we read only those derived labels
    and return a coarse cluster string. The IP address itself is never
    read, stored, or forwarded anywhere. Absent in local dev (no edge
    network), where callers should fall back to "Unknown region". */
export function GET(req: NextRequest) {
  const rawCity = req.headers.get("x-vercel-ip-city");
  const region = req.headers.get("x-vercel-ip-country-region");
  const country = req.headers.get("x-vercel-ip-country");

  const city = rawCity ? decodeURIComponent(rawCity) : null;
  const cluster = city ?? (region && country ? `${region}, ${country}` : country ?? "Unknown region");

  return NextResponse.json({ cluster, country: country ?? null });
}
