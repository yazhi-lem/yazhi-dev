import type { NextRequest } from "next/server";
import { handle } from "@/lib/api/handlers/http";
import { listBubbles } from "@/lib/api/handlers/list";
import { publishBubble } from "@/lib/api/handlers/publish";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/bubbles — browse (public; visibility scopes what you see). */
export async function GET(req: NextRequest) {
  return handle(req, listBubbles, "optional");
}

/** POST /api/bubbles — publish a version (Circle + same-origin).
    The 128 KiB transport cap is enforced BEFORE the auth check, so an
    anonymous oversized body is refused without being buffered. */
export async function POST(req: NextRequest) {
  return handle(req, publishBubble, "required", { limit: "publish" });
}
