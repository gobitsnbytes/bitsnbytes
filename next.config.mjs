import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for Vercel
    domains: [],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Production source maps for better debugging
  productionBrowserSourceMaps: false,
  // Compress output
  compress: true,
  turbopack: {
    // Explicitly set the Turbopack root to the project root (where package.json lives)
    root: ".",
  },
  webpack(config) {
    if (!config.resolve) {
      config.resolve = {}
    }

    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@public": path.resolve("./public"),
    }

    return config
  },
}

export default nextConfig
