import type { Metadata } from "next";
import { WORKSPACE_BY_ID } from "@yazhi/apps/meta";

/** Route helpers shared by /guru, /nyaya, /kural and /kadai: one static
    page per view, and metadata from the workspace's own data. */
export function viewParams(id: string) {
  // the first view is the workspace's base route, so it isn't repeated
  return () => WORKSPACE_BY_ID[id].views.slice(1).map((v) => ({ view: v.id }));
}

export function viewMetadata(id: string) {
  return async ({ params }: { params?: Promise<{ view?: string }> }): Promise<Metadata> => {
    const w = WORKSPACE_BY_ID[id];
    const p = params ? await params : {};
    const v = w.views.find((x) => x.id === p.view) ?? w.views[0];
    return {
      title: `${v.label.ta} · ${v.label.en} — ${w.taName} ${w.name} · Yazhi`,
      description: `${w.tagline.en} ${v.purpose.en}`,
    };
  };
}
