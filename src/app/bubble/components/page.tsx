import type { Metadata } from "next";
import { CatalogGallery, ImportLine, LibraryHeader, NextLink } from "@/components/bubble/LibraryDocs";
import { COMPONENTS } from "@/ui/docs/catalog";

export const metadata: Metadata = {
  title: "Components — Yazhi UI",
  description: "The primitives every Yazhi app shares: bubbles, status pills, citations, guardrails, confirm gates, composer.",
};

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-10 lg:px-8">
      <LibraryHeader eyebrow="Yazhi UI · layer 1" title="Components" taTitle="கூறுகள்">
        <p>
          The primitives every Yazhi app shares. Several exist to enforce a rule in the interface itself: a citation for
          every claim, an honest &quot;I don&apos;t know&quot;, a person in front of every system change. Compose them into{" "}
          <NextLink href="/bubble/modules">modules</NextLink>.
        </p>
        <ImportLine names="Bubble, Pill, Panel, CitationMark, IDontKnow, ConfirmGate, Composer" />
      </LibraryHeader>
      <CatalogGallery entries={COMPONENTS} />
    </div>
  );
}
