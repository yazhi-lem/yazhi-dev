import type { NextRequest } from "next/server";
import { handle } from "@/lib/api/handlers/http";
import { validateManifestHandler } from "@/lib/api/handlers/manifest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/manifest/validate — public, no session, no network.
    The 128 KiB transport cap is enforced before the body is read. */
export async function POST(req: NextRequest) {
  return handle(req, validateManifestHandler, "public", { limit: "validate" });
}
