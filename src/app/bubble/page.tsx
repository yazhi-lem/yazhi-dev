import type { Metadata } from "next";
import { Library } from "@yazhi/bubble/docs/Library";
import { BUILD_TOC, BuildDocs } from "@/components/bubble/BuildDocs";

export const metadata: Metadata = {
  title: "Bubble UI — the Yazhi UI library",
  description:
    "Yazhi's Bubble UI on one page: five Sangam landscapes as light and dark themes, components, modules, app templates, agents and Mission Control — plus how to build, run and sign a bubble.",
};

/** The single "Open the app" call to action: the library page's one job is
    to show what a bubble looks like; /app is where a person actually uses
    one. Rendered above the library so it is the first thing read. */
function OpenTheApp() {
  return (
    <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:px-6">
      <p className="text-sm text-ivory-dim">
        <span lang="ta" className="text-ivory">
          குமிழ் UI-யைப் பயன்படுத்தத் தயாரா?
        </span>{" "}
        <span className="text-ivory-dim">· Ready to use it?</span>
      </p>
      <a
        href="/app"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-night transition hover:bg-bronze"
      >
        <span lang="ta">பயன்பாட்டைத் திற</span>
        <span aria-hidden>·</span>
        <span>Open the app</span>
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

export default function BubblePage() {
  return (
    <>
      <OpenTheApp />
      <Library build={<BuildDocs />} buildToc={BUILD_TOC} />
    </>
  );
}
