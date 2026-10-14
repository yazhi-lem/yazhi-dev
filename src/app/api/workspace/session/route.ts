import { NextRequest, NextResponse } from "next/server";
import { cookieOptions, DEMO_TENANTS, demoLoginEnabled, issue, SESSION_COOKIE, verify } from "@/lib/workspace/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Current session (tenant + kind only), plus whether demo login is offered. */
export async function GET(req: NextRequest) {
  const s = verify(req.cookies.get(SESSION_COOKIE)?.value);
  const tenant = s ? DEMO_TENANTS[s.tenant] : undefined;
  return NextResponse.json(
    { session: s ? { tenant: s.tenant, kind: s.kind, name: tenant?.name ?? s.tenant } : null, demoLogin: demoLoginEnabled() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** Demo login for previews: POST { tenant } with a demo tenant id. Disabled
    unless WORKSPACE_DEMO_LOGIN=true and WORKSPACE_SESSION_SECRET is set. */
export async function POST(req: NextRequest) {
  if (!demoLoginEnabled()) return NextResponse.json({ error: "Login is not available" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const tenant = DEMO_TENANTS[typeof body?.tenant === "string" ? body.tenant : ""];
  if (!tenant) return NextResponse.json({ error: "Unknown tenant" }, { status: 400 });
  const issued = issue(tenant);
  if (!issued) return NextResponse.json({ error: "Login is not available" }, { status: 503 });
  const res = NextResponse.json({ session: { tenant: tenant.id, kind: tenant.kind, name: tenant.name } });
  res.cookies.set(SESSION_COOKIE, issued.token, cookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ session: null });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
