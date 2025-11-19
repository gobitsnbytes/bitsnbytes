import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gobitsnbytes.org'
  
  // Core pages
  const routes = [
    '',
    '/about',
    '/impact',
    '/join',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : route.startsWith('/demo') ? 0.5 : 0.8,
  }))

  return routes
}
