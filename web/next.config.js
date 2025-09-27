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
  
  // Ensure proper path resolution for the build
  webpack: (config, { isServer }) => {
    // Handle path resolution for the monorepo structure
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    
    return config;
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Ensure proper asset prefix if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Ensure proper page resolution
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
