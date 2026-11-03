import type { Metadata } from "next";
import { WorkspacesIndex } from "@/components/workspace/WorkspaceRoute";

export const metadata: Metadata = {
  title: "பணியிடங்கள் · Workspaces — Guru, Nyaya, Kural, Kadai · Yazhi",
  description: "Yazhi's product workspaces on one shared bilingual shell: Guru, Nyaya, Kural and Kadai — modular views, customizable layouts and guided workflows.",
};

export default function WorkspacesPage() {
  return <WorkspacesIndex />;
}
