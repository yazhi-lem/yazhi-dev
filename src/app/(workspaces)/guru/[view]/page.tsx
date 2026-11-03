import { WorkspaceRoute } from "@/components/workspace/WorkspaceRoute";
import { viewMetadata, viewParams } from "@/lib/workspace-routes";

export const dynamicParams = false;
export const generateStaticParams = viewParams("guru");
export const generateMetadata = viewMetadata("guru");

export default async function Page({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  return <WorkspaceRoute id="guru" view={view} />;
}
