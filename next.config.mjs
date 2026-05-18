import path from "path"
import { execSync } from "child_process"

// Inject git build info at build time
const getGitInfo = () => {
  try {
    const commitHash = execSync("git rev-parse HEAD").toString().trim();
    const commitShort = execSync("git rev-parse --short HEAD").toString().trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    const commitMessage = execSync("git log -1 --pretty=%s").toString().trim();
    const commitDate = execSync("git log -1 --pretty=%ci").toString().trim();
    return { commitHash, commitShort, branch, commitMessage, commitDate };
  } catch {
    return { commitHash: "unknown", commitShort: "unknown", branch: "unknown", commitMessage: "", commitDate: "" };
  }
};

const gitInfo = getGitInfo();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: gitInfo.commitHash,
    NEXT_PUBLIC_GIT_COMMIT_SHORT: gitInfo.commitShort,
    NEXT_PUBLIC_GIT_BRANCH: gitInfo.branch,
    NEXT_PUBLIC_GIT_COMMIT_MESSAGE: gitInfo.commitMessage,
    NEXT_PUBLIC_GIT_COMMIT_DATE: gitInfo.commitDate,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_REPO_URL: "https://github.com/gobitsnbytes/bitsnbytes",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["sharp", "onnxruntime-node"],
  images: {
    // Enable image optimization for Vercel
    domains: [],
    qualities: [60, 75, 85, 90],
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
  // Production source maps for better debugging
  productionBrowserSourceMaps: false,
  // Compress output
  compress: true,
  turbopack: {
    // Explicitly set the Turbopack root to the project root
    root: process.cwd(),
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
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/logo.svg',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.gobitsnbytes.org',
          },
        ],
        destination: 'https://gobitsnbytes.org/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://tally.so https://hcaptcha.com https://*.hcaptcha.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' blob: data: https:; font-src 'self' data: https://r2cdn.perplexity.ai; connect-src 'self' https://vitals.vercel-insights.com https://hcaptcha.com https://*.hcaptcha.com https://*.supabase.co https://cloudflareinsights.com; frame-src 'self' https://tally.so https://hcaptcha.com https://*.hcaptcha.com https://discord.com https://*.discord.com https://*.notion.site https://www.notion.so;"
          }
        ]
      }
    ]
  },
}

export default nextConfig
