import "server-only";

/** The registry half of the tray, read on the server.

    `GET /api/bubbles` is api-kernel's route (published + public versions, or
    the caller's own). The page calls it directly, in-process, and keeps only
    what a tray needs; anything that fails — the route throwing, a hung
    fetch, an empty registry, no session — degrades to an empty list, so the
    host always paints. Nothing here reaches the client bundle beyond the
    manifests themselves.

    A timeout guards the render: a slow registry must not hold up the page. */

import { createClient } from "@/lib/api/client";
import type { BubbleManifestV1 } from "@yazhi/bubble";

const TIMEOUT_MS = 1200;

export async function registryBubbles(): Promise<BubbleManifestV1[]> {
  try {
    // lazily, in the factory: the port module (and the Circle session it
    // reaches) is imported only when this server file actually runs
    const client = createClient(async () => (await import("@/lib/api/ports-local")).localPort(), { attempts: 1, baseDelayMs: 0 });
    const page = await Promise.race([
      client.listBubbles({ pageSize: 50, status: "published" }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
    ]);
    if (!page) return [];
    return page.bubbles
      .map((version) => version.manifest)
      .filter((m): m is BubbleManifestV1 => Boolean(m) && m.schema === "yazhi.bubble/v1");
  } catch {
    // an empty tray half is the correct degradation
    return [];
  }
}
