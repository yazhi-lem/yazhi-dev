import type { Metadata } from "next";
import Link from "next/link";
import { LibraryHeader, NextLink } from "@/components/bubble/LibraryDocs";
import { Bubble } from "@/ui/components/Bubble";
import { PAGE_TEMPLATES } from "@/ui/pages/catalog";
import { firstGrapheme } from "@/ui/text";

export const metadata: Metadata = {
  title: "Pages — Yazhi UI",
  description: "Full app screens for the Yazhi apps, composed from Yazhi UI modules and shown with sample data.",
};

export default function PagesIndex() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-10 lg:px-8">
      <LibraryHeader eyebrow="Yazhi UI · layer 3" title="Pages" taTitle="பக்கங்கள்">
        <p>
          Complete screens for each Yazhi app, composed from <NextLink href="/bubble/modules">modules</NextLink> inside
          one <code className="font-mono text-sm text-ivory">AppFrame</code>. They run on sample data — open one to try
          it live. Start a new app by copying the closest template.
        </p>
      </LibraryHeader>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PAGE_TEMPLATES.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/bubble/pages/${t.slug}`}
              className="flex h-full flex-col rounded-2xl border border-ivory/10 bg-night-2/60 p-5 transition hover:border-gold/50"
            >
              <div className="flex items-center gap-3">
                <Bubble accent={t.app.accent} label={t.app.name} glyph={firstGrapheme(t.app.taName)} size={40} />
                <div>
                  <p className="font-semibold text-ivory">
                    <span lang="ta">{t.app.taName}</span> · {t.app.name}
                  </p>
                  <p className="text-xs text-ivory-dim">{t.app.runtime === "device" ? "runs on-device" : "runs on yazhi-api"}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-ivory-dim">{t.summary}</p>
              <p className="mt-3 font-mono text-[11px] text-ivory-dim/80">{t.modules.join(" · ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
