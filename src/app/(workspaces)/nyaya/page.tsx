import { WorkspaceRoute } from "@/components/workspace/WorkspaceRoute";
import { viewMetadata } from "@/lib/workspace-routes";

export const generateMetadata = viewMetadata("nyaya");

export default function Page() {
  return <WorkspaceRoute id="nyaya" />;
}
