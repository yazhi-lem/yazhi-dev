import type { NextRequest } from "next/server";
import { handle } from "@/lib/api/handlers/http";
import { agents } from "@/lib/api/handlers/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/agents — public roster, without system prompts. */
export async function GET(req: NextRequest) {
  return handle(req, agents, "public");
}
