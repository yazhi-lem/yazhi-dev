import "server-only";

/** Circle session cookies for yazhi.dev.

    The browser holds two httpOnly cookies and nothing else:
      yz_circle_at — the yazhi-api session access token (RS256 JWT, ~15 min)
      yz_circle_rt — the single-use refresh token (7-day sliding window)
    Neither is readable from JavaScript, so page code (including any bubble
    a developer builds) can never lift a session. Route handlers read them,
    refresh when the access token has lapsed, and rewrite both on rotation. */

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  CircleCallError,
  getSessionAccount,
  refreshSession,
  type CircleTokens,
} from "./client";
import type { CircleAccount } from "./types";

const ACCESS_COOKIE = "yz_circle_at";
const REFRESH_COOKIE = "yz_circle_rt";
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function writeSession(tokens: CircleTokens): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: tokens.expiresIn });
  jar.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: REFRESH_MAX_AGE });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

/** Resolve the signed-in Circle account for this request, refreshing the
    session when the access token has expired. Returns null when nobody is
    signed in (or the session can no longer be renewed). Must run in a
    Route Handler, because a refresh rewrites cookies. */
export async function currentAccount(): Promise<CircleAccount | null> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  if (access) {
    try {
      return await getSessionAccount(access);
    } catch (err) {
      // An expired/revoked token falls through to refresh; anything else
      // (yazhi-api down) is a real error the caller should surface.
      if (!(err instanceof CircleCallError) || err.status !== 401) throw err;
    }
  }
  if (!refresh) return null;
  try {
    const tokens = await refreshSession(refresh);
    await writeSession(tokens);
    return tokens.account;
  } catch (err) {
    if (err instanceof CircleCallError && err.status === 401) {
      await clearSession();
      return null;
    }
    throw err;
  }
}

/** Reject cross-site state-changing requests. SameSite=Lax already keeps
    our cookies off cross-site POSTs; this also stops a cross-site form
    from creating or signing in to an account in the victim's browser. */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches from older browsers omit it
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
