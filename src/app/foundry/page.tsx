import type { Metadata } from "next";
import { BubbleView } from "@/bubble";
import { loadOverview } from "@/lib/foundry/client";
import { overviewView } from "@/lib/foundry/views";

// re-read yazhi-api at most once a minute (matches unary()'s fetch revalidate)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "வார்ப்பகம் • Yazhi Foundry",
  description: "Yazhi's six domain data programmes — pipelines, corpus quality and what is blocking each one, read from yazhi-api.",
};

export default async function FoundryPage() {
  const { overview, source } = await loadOverview();
  return <BubbleView blocks={overviewView(overview, source)} />;
}
