import type { NextRequest } from "next/server";
import { handle } from "@/lib/api/handlers/http";
import { health } from "@/lib/api/handlers/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/health — public. See docs/API.md §health and src/lib/api/handlers/health.ts. */
export async function GET(req: NextRequest) {
  return handle(req, health, "public");
}
