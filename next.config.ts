import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // `curl -fsSL https://yazhi.dev/install | bash` — the extensionless
      // path is what people type and what the script's own header documents.
      // The file itself lives in public/install-yazhi.sh.
      { source: "/install", destination: "/install-yazhi.sh" },
    ];
  },

  async headers() {
    return [
      {
        // Serve the installer as plain text so it renders in a browser
        // instead of downloading — someone should be able to read it before
        // piping it to a shell. `nosniff` stops the browser second-guessing
        // that, and the short max-age keeps a re-publish from being masked
        // by a stale CDN copy.
        //
        // Both paths are listed on purpose: header rules match the INCOMING
        // request path, before the rewrite resolves, so matching only the
        // .sh path leaves /install serving application/x-sh — which a
        // browser downloads instead of showing. Verified by request.
        source: "/:path(install|install-yazhi.sh)",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=300, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
