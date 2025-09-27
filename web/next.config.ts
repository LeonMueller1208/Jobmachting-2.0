import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid issues with generated Prisma files
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
