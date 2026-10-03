import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BubbleView } from "@/bubble";
import { loadProject } from "@/lib/foundry/client";
import { FOUNDRY_PROJECTS, getProject } from "@/lib/foundry/projects";
import { projectView } from "@/lib/foundry/views";

// re-read yazhi-api at most once a minute (matches unary()'s fetch revalidate)
export const revalidate = 60;

type Params = Promise<{ project: string }>;

export function generateStaticParams() {
  return FOUNDRY_PROJECTS.map((p) => ({ project: p.id }));
}

// only the six registered domains exist
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProject((await params).project);
  if (!p) return {};
  return {
    title: `${p.name.ta} • ${p.name.en} — Yazhi Foundry`,
    description: p.summary,
  };
}

export default async function FoundryProjectPage({ params }: { params: Params }) {
  const p = getProject((await params).project);
  if (!p) notFound();
  const { quality, health, source } = await loadProject(p.id);
  return <BubbleView blocks={projectView(p, quality, health, source)} />;
}
