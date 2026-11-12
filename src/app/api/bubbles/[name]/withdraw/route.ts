import type { NextRequest } from "next/server";
import { handle, routeParams } from "@/lib/api/handlers/http";
import { withdrawBubble } from "@/lib/api/handlers/withdraw";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/bubbles/<name>/withdraw — author or maintainer.
    Small body, so a 16 KiB transport cap. */
export async function POST(req: NextRequest, ctx: { params: Promise<Record<string, string | string[]>> }) {
  return handle(req, withdrawBubble, "required", { params: await routeParams(ctx), limit: "small" });
}
