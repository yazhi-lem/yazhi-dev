"use client";
import Link from "next/link";
import { Bi } from "@/components/ui/Bi";
import { BUILD } from "@/lib/content";
import { getProject, type Project } from "@/lib/projects";
import { toneStyle } from "@/bubble/tone";

const FLAGSHIPS = BUILD.order.map((s) => getProject(s)).filter((p): p is Project => Boolean(p));

/** What the movement is building, kept quiet: a name, a line and a demo
    for Adhan, Yazh and Open Sangam, and a way to everything else. The
    detail lives on each project's page. Neytal governs it. */
export function Build() {
  return (
    <section id="build" aria-labelledby="build-title" className="mx-auto max-w-[var(--max-w)] px-6 py-16 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-ivory/10 pt-8">
        <h2 id="build-title">
          <Bi ta={BUILD.eyebrowTa} en={BUILD.eyebrowEn} className="flex flex-wrap gap-x-2 text-sm text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
        </h2>
        <Link href="/projects" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
          <Bi ta={BUILD.allTa} en={BUILD.allEn} className="inline-flex gap-1.5" separator="·" />
          <span aria-hidden> →</span>
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {FLAGSHIPS.map((p) => (
          <li key={p.slug} style={toneStyle(p.tone)} className="flex flex-col gap-2 border-l-2 border-[color:var(--tone)]/60 pl-4">
            <Link href={`/projects/${p.slug}`} className="group flex flex-wrap items-baseline gap-x-2">
              <Bi
                ta={p.name.ta} en={p.name.en}
                className="inline-flex flex-wrap items-baseline gap-x-2"
                taClass="font-display text-[length:var(--text-xl)] font-semibold text-ivory group-hover:underline group-hover:underline-offset-4"
                enClass="text-sm text-ivory-dim"
              />
              <Bi ta={p.kind.ta} en={p.kind.en} className="ybi-tone-text inline-flex gap-1 text-xs" separator="·" />
            </Link>
            <Bi as="p" ta={p.what.ta} en={p.what.en} className="flex flex-col gap-0.5 text-sm text-ivory-dim" enClass="text-xs" />
            {p.demo && (
              <Link
                href={p.demo.href}
                {...(p.demo.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="ybi-tone-text inline-flex w-fit items-baseline gap-1 text-sm underline decoration-current/30 underline-offset-4 hover:decoration-current"
              >
                <Bi ta={p.demo.ta} en={p.demo.en} className="inline-flex gap-1.5" separator="·" />
                <span aria-hidden>{p.demo.external ? "↗" : "→"}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
