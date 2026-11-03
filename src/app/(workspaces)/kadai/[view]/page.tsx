import { WorkspaceRoute } from "@/components/workspace/WorkspaceRoute";
import { viewMetadata, viewParams } from "@/lib/workspace-routes";

export const dynamicParams = false;
export const generateStaticParams = viewParams("kadai");
export const generateMetadata = viewMetadata("kadai");

export default async function Page({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  return <WorkspaceRoute id="kadai" view={view} />;
}
