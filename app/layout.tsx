import type React from "react"
import type { Metadata } from "next"
import { Poppins, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { FloatingAiAssistant } from "@/components/ui/glowing-ai-chat-assistant"
import { ThemeProvider } from "@/components/theme-provider"
import { PageBackground } from "@/components/page-background"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gobitsnbytes.org'),
  title: {
    default: "Bits&Bytes - Teen Led Code Club | Lucknow",
    template: "%s | Bits&Bytes"
  },
  description: "Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow. Build real projects, attend hackathons, and grow as a developer.",
  keywords: ["bits&bytes", "teen code club", "lucknow hackathons", "student developers", "coding club", "tech events lucknow", "learn coding", "teen programmers", "hackathons in lucknow", "coding classes for teens"],
  authors: [{ name: "Bits&Bytes Team", url: "https://gobitsnbytes.org" }],
  creator: "Bits&Bytes",
  publisher: "Bits&Bytes",
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gobitsnbytes.org",
    siteName: "Bits&Bytes",
    title: "Bits&Bytes - Teen Led Code Club | Lucknow",
    description: "Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bits&Bytes - Teen Led Code Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bits&Bytes - Teen Led Code Club | Lucknow",
    description: "Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow.",
    images: ["/og-image.png"],
    creator: "@bitsnbytes_lko",
    site: "@bitsnbytes_lko",
  },
  category: "education",
  classification: "Nonprofit Code Club",
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "google-site-verification=1234567890",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bits&Bytes",
    "url": "https://gobitsnbytes.org",
    "logo": "https://gobitsnbytes.org/logo.svg",
    "sameAs": [
      "https://www.linkedin.com/company/gobitsbytes"
    ],
    "description": "Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lucknow",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    }
  }

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-accent/30 selection:text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <PageBackground />
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingAiAssistant />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
