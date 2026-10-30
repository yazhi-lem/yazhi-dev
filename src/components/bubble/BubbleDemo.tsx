"use client";
import { BubbleUI } from "./BubbleUI";
import { STARTER_BUBBLES } from "@yazhi/bubble/lib/starters";

/** The live Bubble UI host in the /bubble playground, with the starter bubbles. */
export function BubbleDemo() {
  return <BubbleUI bubbles={STARTER_BUBBLES} className="h-[34rem]" />;
}
