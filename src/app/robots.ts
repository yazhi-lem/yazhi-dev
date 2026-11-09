import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/components/app/metadata";

/** Everyone may crawl the app, the library and the workspaces; the API is
    for programs, not crawlers, and `/app?b=…&q=…` threads are per-person
    state, not pages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/profile/", "/onboarding"],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
