/** Server-only: minimal HMAC-signed cookie session for the Telugu workspaces.
    The repo has no server-side auth (profiles live in localStorage), so this
    is deliberately small: a signed, expiring {sid, tenant} claim. Replace with
    the real IAM (yazhi-api Circle) before production. */
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "yz_ws_session";
export const SESSION_TTL_S = 8 * 60 * 60;

export type TenantKind = "legal" | "health";
export interface Tenant { id: string; kind: TenantKind; name: string }
export interface Session { sid: string; tenant: string; kind: TenantKind; exp: number }

/** Preview-only demo tenants (fictional). Real tenants come from IAM. */
export const DEMO_TENANTS: Record<string, Tenant> = {
  "demo-lawfirm-hyd": { id: "demo-lawfirm-hyd", kind: "legal", name: "Demo Law Chambers, Hyderabad (fictional)" },
  "demo-clinic-hyd": { id: "demo-clinic-hyd", kind: "health", name: "Demo Family Clinic, Hyderabad (fictional)" },
};

function secret(): string | null {
  const s = process.env.WORKSPACE_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export const demoLoginEnabled = () => process.env.WORKSPACE_DEMO_LOGIN === "true" && secret() !== null;

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (data: string, key: string) => createHmac("sha256", key).update(data).digest("base64url");

export function issue(tenant: Tenant): { token: string; session: Session } | null {
  const key = secret();
  if (!key) return null;
  const session: Session = {
    sid: randomUUID(),
    tenant: tenant.id,
    kind: tenant.kind,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S,
  };
  const body = b64(JSON.stringify(session));
  return { token: `${body}.${sign(body, key)}`, session };
}

export function verify(token: string | undefined): Session | null {
  const key = secret();
  if (!key || !token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = Buffer.from(sign(body, key));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const s = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (typeof s.exp !== "number" || s.exp < Date.now() / 1000) return null;
    if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(s.tenant) || (s.kind !== "legal" && s.kind !== "health")) return null;
    return s;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/api/workspace",
  maxAge: SESSION_TTL_S,
};
