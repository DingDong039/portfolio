import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Next 16.3.x skips writing .next/next-server.js.nft.json when a deployment
  // adapter is present, but the standalone finalizer still reads it, so Vercel
  // builds fail with ENOENT (vercel/next.js#96646). Vercel does not need
  // standalone output; keep it for Docker. Drop the condition once the
  // backport (vercel/next.js#98167) ships in a 16.3.x release.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
