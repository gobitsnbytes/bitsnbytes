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
    root: '.',
  },
};

export default nextConfig;
