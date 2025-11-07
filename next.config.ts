import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint configuration is now handled via .eslintrc.json
  // The eslint option in next.config.ts is deprecated
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

export default nextConfig;
