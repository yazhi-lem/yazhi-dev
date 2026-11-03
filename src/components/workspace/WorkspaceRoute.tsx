"use client";
import Link from "next/link";
import { WorkspaceLauncher, WorkspaceShell, type LinkLike } from "@yazhi/workspace";
import { MANIFESTS } from "@yazhi/apps/registry";
import { WORKSPACES } from "@yazhi/apps/meta";
import { LogoMark } from "@/components/ui/LogoMark";
import { MissionMenu } from "@/components/mission/Mission";

const NextLink: LinkLike = ({ href, className, children, ...rest }) => (
  <Link href={href} className={className} {...rest}>
    {children}
  </Link>
);

function Home({ to = "/workspaces", label = "All workspaces" }: { to?: string; label?: string }) {
  return (
    <Link href={to} aria-label={label} title={label} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ivory/15 hover:border-ivory/40">
      <LogoMark size={20} />
    </Link>
  );
}

/** One workspace view, wired to Next's router and the Circle session. */
export function WorkspaceRoute({ id, view }: { id: string; view?: string }) {
  const manifest = MANIFESTS[id];
  const host = manifest.mountsIn ? MANIFESTS[manifest.mountsIn] : undefined;
  return (
    <WorkspaceShell
      manifest={manifest}
      viewId={view}
      Link={NextLink}
      home={<Home />}
      account={<MissionMenu size={34} />}
      embeddedIn={host ? `${host.name} · ${host.taName}` : undefined}
    />
  );
}

/** /workspaces — every product workspace. */
export function WorkspacesIndex() {
  return <WorkspaceLauncher workspaces={WORKSPACES} Link={NextLink} home={<Home to="/" label="Yazhi home" />} account={<MissionMenu size={34} />} />;
}
