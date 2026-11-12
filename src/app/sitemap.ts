import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/components/app/metadata";

/** The public routes of yazhi.dev, generated rather than hand-written. `/app`
    (the Bubble UI host) sits high in the list because it is the product; its
    deep links (`?b=`, `?ws=`, `?t=`, `?q=`) are deliberately not listed — one
    canonical `/app` is what a crawler should index, and a thread in the query
    string is somebody's conversation, not a page. */

type Change = MetadataRoute.Sitemap[number]["changeFrequency"];

const ROUTES: { path: string; priority: number; changeFrequency: Change }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/app", priority: 0.9, changeFrequency: "weekly" },
  { path: "/bubble", priority: 0.8, changeFrequency: "monthly" },
  { path: "/workspaces", priority: 0.7, changeFrequency: "monthly" },
  { path: "/chat", priority: 0.7, changeFrequency: "monthly" },
  { path: "/repos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_ORIGIN}${path || "/"}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
