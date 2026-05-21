import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Disable Vercel Analytics to prevent webpage_content_reporter.js errors
  env: {
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: "",
  },
  // Suppress preload warnings for unused CSS chunks
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
