import { NextResponse } from "next/server";
import { chatStatus } from "@/lib/chat/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Whether /chat may send right now: connected to yazhi-api, and
    yazhi-api reporting sovereign inference. The UI disables sending and
    says why for every other state. */
export async function GET() {
  return NextResponse.json(await chatStatus(), { headers: { "Cache-Control": "no-store" } });
}
