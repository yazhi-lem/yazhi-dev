import type { NextRequest } from "next/server";
import { openApiDocument } from "@/lib/api/openapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/openapi.json — the documented v1 surface (OpenAPI 3.1).
    Public and cheap: the document is built from a literal, no I/O. */
export async function GET(_req: NextRequest) {
  void _req;
  return Response.json(openApiDocument(), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
