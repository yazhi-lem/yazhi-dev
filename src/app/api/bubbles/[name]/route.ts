import type { NextRequest } from "next/server";
import { handle, routeParams } from "@/lib/api/handlers/http";
import { getBubble } from "@/lib/api/handlers/get";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/bubbles/<name>?version= — one version. An invisible version is
    404, never 403, so a probe cannot enumerate. */
export async function GET(req: NextRequest, ctx: { params: Promise<Record<string, string | string[]>> }) {
  return handle(req, getBubble, "optional", { params: await routeParams(ctx) });
}
