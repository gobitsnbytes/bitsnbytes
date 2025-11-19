import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot'],
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'PerplexityBot'],
        allow: ['/', '/llms.txt'],
      },
    ],
    sitemap: 'https://gobitsnbytes.org/sitemap.xml',
  }
}
