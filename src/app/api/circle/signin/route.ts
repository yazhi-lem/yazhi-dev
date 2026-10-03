import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/circle/client";
import { sameOrigin, writeSession } from "@/lib/circle/session";
import { circleErrorResponse, forbidden, noStore } from "../_shared";

export const runtime = "nodejs";

/** POST { email, password } → signs in to yazhi-api Circle and sets the
    httpOnly session cookies. Returns the account, never the tokens. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return forbidden();
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  try {
    const tokens = await signIn(email, password);
    await writeSession(tokens);
    return NextResponse.json({ account: tokens.account }, { headers: noStore });
  } catch (err) {
    return circleErrorResponse(err);
  }
}
