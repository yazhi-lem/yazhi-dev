"use client";
import { BubbleUI } from "./BubbleUI";
import { STARTER_BUBBLES } from "@/lib/bubble/starters";

/** The live Bubble UI on /bubble, loaded with the starter bubbles. */
export function BubbleDemo() {
  return <BubbleUI bubbles={STARTER_BUBBLES} className="h-[34rem]" />;
}
