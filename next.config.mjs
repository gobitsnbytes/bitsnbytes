import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
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
