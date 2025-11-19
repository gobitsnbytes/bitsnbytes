import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bits&Bytes - Teen Led Code Club',
    short_name: 'Bits&Bytes',
    description: 'Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3E1E68',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
