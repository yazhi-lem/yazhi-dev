import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ProjectView } from "@/components/projects/ProjectView";
import { PROJECTS, getProject } from "@/lib/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// only the projects in the registry exist
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name.ta === p.name.en ? p.name.en : `${p.name.ta} • ${p.name.en}`} — Yazhi`,
    description: p.what.en,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return (
    <>
      <Navbar />
      <ProjectView slug={slug} />
      <Footer />
    </>
  );
}
