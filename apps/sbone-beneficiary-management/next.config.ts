import path from "node:path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  // Multi-zone micro frontend: every page and asset lives under /beneficiaries, so the platform (sbone-migration)
  // can forward that path here. Must match the path proxied in apps/sbone-migration/proxy.ts.
  basePath: "/beneficiaries",
  // Self-contained server for the Docker image (see Dockerfile)
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  cacheComponents: true,
  // @sbone/shared is a workspace package shipped as TypeScript + SCSS source, so Next compiles it
  transpilePackages: ["@sbone/shared"],
  turbopack: {
    // Monorepo root, so Turbopack can read packages/shared through the workspace link
    root: monorepoRoot,
    rules: {
      // Tailwind only processes app/globals.css (matching every "*.css" would empty the CSS-module class names)
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
