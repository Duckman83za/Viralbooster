import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages
  transpilePackages: ['@contentos/db', '@contentos/ai', '@contentos/core', '@contentos/connectors'],

  // Use edge runtime for API routes with BullMQ
  experimental: {
    // Enable PPR for better performance (optional)
  },

  // Disable ESLint during builds (using separate lint command)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during builds (we run tsc separately)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

