import type { Metadata } from "next";
import { CatalogGallery, ImportLine, LibraryHeader, NextLink } from "@/components/bubble/LibraryDocs";
import { MODULES } from "@/ui/docs/catalog";

export const metadata: Metadata = {
  title: "Modules — Yazhi UI",
  description: "App-level blocks for Avai, Nyaya, Kural, Guru, Kadai, Open Sangam and Yazh, built from Yazhi UI components.",
};

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-10 lg:px-8">
      <LibraryHeader eyebrow="Yazhi UI · layer 2" title="Modules" taTitle="தொகுதிகள்">
        <p>
          App-level blocks built only from <NextLink href="/bubble/components">components</NextLink>: cited answers,
          runbooks, the hint ladder, the verse reader, orders, the consent gate. Each lists the apps that use it and the
          rule it carries. Whole screens made from them are in <NextLink href="/bubble/pages">pages</NextLink>.
        </p>
        <ImportLine names="CitedAnswer, LegalAnswerCard, HintLadder, RunbookPanel, VerseReader, ConsentGate" />
      </LibraryHeader>
      <CatalogGallery entries={MODULES} />
    </div>
  );
}
