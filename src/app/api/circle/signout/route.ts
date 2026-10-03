import { NextRequest, NextResponse } from "next/server";
import { clearSession, sameOrigin } from "@/lib/circle/session";
import { forbidden, noStore } from "../_shared";

export const runtime = "nodejs";

/** POST → forget the session on this browser. The access token lapses on
    its own within its 15-minute lifetime; the refresh token is gone. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return forbidden();
  await clearSession();
  return NextResponse.json({ signedIn: false }, { headers: noStore });
}
