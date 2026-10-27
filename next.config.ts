import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the Bubble UI library is one page now; its old sub-pages point into it
  async redirects() {
    return [
      { source: "/bubble/design", destination: "/bubble#themes", permanent: true },
      { source: "/bubble/components", destination: "/bubble#components", permanent: true },
      { source: "/bubble/modules", destination: "/bubble#modules", permanent: true },
      { source: "/bubble/pages", destination: "/bubble#templates", permanent: true },
      { source: "/bubble/pages/:slug", destination: "/bubble?template=:slug#templates", permanent: true },
    ];
  },
};

export default nextConfig;
