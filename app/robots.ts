import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gobitsnbytes.org'
  
  return {
    rules: [
      {
        // Default rules for general crawlers
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/_next/', '/admin/'],
      },
      {
        // Search Engines
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['Bingbot', 'msnbot', 'Applebot', 'DuckDuckBot', 'Yandex', 'Baiduspider'],
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        // Modern AI & LLM Search Crawlers (2026-specific)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'cohere-ai',
          'Meta-ExternalAgent',
          'Diffbot',
          'Bytespider',
          'CCBot',
          'omgili',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt', '/rss.xml', '/feed.xml'],
        disallow: ['/api/', '/private/'],
      },
      {
        // Disallow spam/scraper bots
        userAgent: ['MJ12bot'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

