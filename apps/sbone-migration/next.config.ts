import path from "node:path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile)
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  cacheComponents: true,
  partialPrefetching: true,
  // @sbone/shared is a workspace package shipped as TypeScript + SCSS source, so Next compiles it
  transpilePackages: ["@sbone/shared"],
  turbopack: {
    // Monorepo root (two levels up from apps/<app>), so Turbopack can read packages/shared through the workspace link
    root: monorepoRoot,
    rules: {
      // Tailwind only processes app/globals.css. Matching every "*.css" would also catch the CSS compiled from
      // *.module.scss and turn those CSS modules into plain global CSS, leaving their class names empty.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
