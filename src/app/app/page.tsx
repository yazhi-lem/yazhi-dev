import { BubbleAppHost, type InitialThread } from "@/components/app/BubbleAppHost";
import { bubbleFor, DEFAULT_BUBBLE_SLUG, workspaceFor } from "@/components/app/bubbles";
import { appMetadata } from "@/components/app/metadata";
import { registryBubbles } from "@/components/app/registry-server";

/** `/app` is request-time: the selection is in the query string and the
    registry half of the tray is read per request. Rendering it on the server
    is the point — a reader without JavaScript still gets the tray, every
    bubble's identity, and the canvas for the selected one (`?ws=guru` mounts
    the workspace shell from the URL alone). */

export const generateMetadata = appMetadata;

type AppSearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AppPage({ searchParams }: { searchParams: AppSearchParams }) {
  const params = await searchParams;
  const requested = first(params.b);
  const wsParam = first(params.ws);
  const workspace = workspaceFor(wsParam);

  // `?ws=guru` alone selects that workspace's bubble; an explicit `?b` wins
  const slug = requested ?? (workspace ? `ws.${workspace.id}` : DEFAULT_BUBBLE_SLUG);
  const bubble = bubbleFor(slug);

  const threadId = first(params.t) ?? "new";
  const q = params.q;
  const questions = (Array.isArray(q) ? q : q ? [q] : []).filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0
  );

  const initialThread: InitialThread = {
    id: threadId,
    bubble: bubble.slug,
    questions,
    fromLink: questions.length > 0,
  };

  // the registry half of the tray; an empty list (registry down, no session,
  // timeout) is a perfectly good answer and never blocks the paint
  const registry = await registryBubbles();

  return (
    <BubbleAppHost
      initialBubbleSlug={bubble.slug}
      initialWorkspace={workspace?.id ?? (bubble.kind === "workspace" ? bubble.slug.replace(/^ws\./, "") : undefined)}
      initialThreadId={threadId}
      initialThread={initialThread}
      registry={registry}
      circleReady={false}
    />
  );
}
