import { NextResponse } from "next/server";
import { circleConfigured, circleSignupOpen } from "@/lib/circle/client";
import { currentAccount } from "@/lib/circle/session";
import type { CircleSessionResponse } from "@/lib/circle/types";
import { circleErrorResponse, noStore } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET → who is signed in. Refreshes an expired access token in place. */
export async function GET() {
  if (!circleConfigured()) {
    const body: CircleSessionResponse = { signedIn: false, configured: false, signupOpen: false };
    return NextResponse.json(body, { headers: noStore });
  }
  try {
    const account = await currentAccount();
    const body: CircleSessionResponse = account
      ? { signedIn: true, account }
      : { signedIn: false, configured: true, signupOpen: circleSignupOpen() };
    return NextResponse.json(body, { headers: noStore });
  } catch (err) {
    return circleErrorResponse(err);
  }
}
