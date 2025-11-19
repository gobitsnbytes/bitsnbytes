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
  metadataBase: new URL('https://lucknow.codes'),
  title: {
    default: "Bits&Bytes - Teen Led Code Club | Lucknow",
    template: "%s | Bits&Bytes"
  },
  description: "Innovate. Collaborate. Hack. Join the most creative code club for teens in Lucknow. Build real projects, attend hackathons, and grow as a developer.",
  keywords: ["bits&bytes", "teen code club", "lucknow hackathons", "student developers", "coding community", "tech events lucknow", "learn coding", "teen programmers"],
  authors: [{ name: "Bits&Bytes Team" }],
  creator: "Bits&Bytes",
  publisher: "Bits&Bytes",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lucknow.codes",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-accent/30 selection:text-primary">
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
