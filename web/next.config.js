/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid issues with generated Prisma files
    ignoreDuringBuilds: true,
  },
  
  // Monorepo configuration
  experimental: {
    // Enable external packages resolution
    externalDir: true,
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Ensure proper page resolution
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
