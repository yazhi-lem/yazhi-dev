import { NextResponse } from "next/server";
import { CircleCallError } from "@/lib/circle/client";

/** Turn any failure in a /api/circle/* handler into a JSON error response.
    Only CircleCallError messages are shown to the user; anything else is
    logged and reported generically. */
export function circleErrorResponse(err: unknown): NextResponse {
  if (err instanceof CircleCallError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("[circle]", err);
  return NextResponse.json({ error: "Circle request failed." }, { status: 500 });
}

export const forbidden = () =>
  NextResponse.json({ error: "Cross-site request refused." }, { status: 403 });

export const noStore = { "Cache-Control": "no-store" };
