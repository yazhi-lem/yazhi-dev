import type { Metadata } from "next";
import { Library } from "@yazhi/bubble/docs/Library";
import { BUILD_TOC, BuildDocs } from "@/components/bubble/BuildDocs";

export const metadata: Metadata = {
  title: "Bubble UI — the Yazhi UI library",
  description:
    "Yazhi's Bubble UI on one page: five Sangam landscapes as light and dark themes, components, modules, app templates, agents and Mission Control — plus how to build, run and sign a bubble.",
};

export default function BubblePage() {
  return <Library build={<BuildDocs />} buildToc={BUILD_TOC} />;
}
