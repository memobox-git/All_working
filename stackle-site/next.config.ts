import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain HTML, CSS and JS in out/, served by Netlify. No server to run.
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  // Lets several dev servers run side by side (NEXT_DIST_DIR=.next-2 npm run dev -- -p 3002).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    // The site lives in a subfolder of a repo that has its own lockfile at the top.
    root: __dirname,
  },
};

export default nextConfig;
