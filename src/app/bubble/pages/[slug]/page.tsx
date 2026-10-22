import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TemplatePreview } from "@/ui/docs/Demos";
import { PAGE_TEMPLATES, type TemplateSlug } from "@/ui/pages/catalog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAGE_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = PAGE_TEMPLATES.find((p) => p.slug === slug);
  return t ? { title: `${t.app.name} page — Yazhi UI`, description: t.summary } : {};
}

export default async function TemplatePage({ params }: Params) {
  const { slug } = await params;
  const t = PAGE_TEMPLATES.find((p) => p.slug === slug);
  if (!t) notFound();
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ivory-dim">
        <Link href="/bubble/pages" className="hover:text-ivory">
          Pages
        </Link>{" "}
        / <span className="text-ivory">{t.app.name}</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="max-w-2xl text-sm text-ivory-dim">{t.summary}</p>
        <p className="font-mono text-[11px] text-ivory-dim/80">
          {t.modules.map((m, i) => (
            <span key={m}>
              {i > 0 && " · "}
              {m}
            </span>
          ))}
        </p>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-ivory/15 shadow-2xl shadow-black/40">
        <TemplatePreview slug={t.slug as TemplateSlug} />
      </div>
    </div>
  );
}
