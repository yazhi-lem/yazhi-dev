import { NextRequest, NextResponse } from "next/server";
import { createAccountAndSignIn } from "@/lib/circle/client";
import { sameOrigin, writeSession } from "@/lib/circle/session";
import { circleErrorResponse, forbidden, noStore } from "../_shared";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST { fullName, email, password, adult, conduct } → creates a Circle
    account on yazhi-api for a developer and signs them in.

    The developer track is for adults: Yazhi does not let anyone under 18
    hold an account here (children reach Yazh only through the family flow,
    with verified parental consent). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return forbidden();
  const body = await req.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (body?.adult !== true) {
    return NextResponse.json({ error: "Developer accounts are for people aged 18 and over." }, { status: 400 });
  }
  if (body?.conduct !== true) {
    return NextResponse.json({ error: "Please accept the code of conduct to join." }, { status: 400 });
  }
  if (!fullName || fullName.length > 120) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  // yazhi-api hashes with bcrypt, which takes at most 72 bytes of input.
  if (password.length < 10 || new TextEncoder().encode(password).length > 72) {
    return NextResponse.json(
      { error: "Use a password of 10 to 72 characters (fewer if it has Tamil or other non-Latin letters)." },
      { status: 400 }
    );
  }

  try {
    const tokens = await createAccountAndSignIn({ email, password, fullName });
    await writeSession(tokens);
    return NextResponse.json({ account: tokens.account }, { status: 201, headers: noStore });
  } catch (err) {
    return circleErrorResponse(err);
  }
}
