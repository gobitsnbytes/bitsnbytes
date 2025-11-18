import type React from "react"
import type { Metadata } from "next"
import { Poppins, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

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
  title: "Bits&Bytes - Teen Led Code Club",
  description: "Innovate. Collaborate. Hack. Join the most creative code club for teens.",
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
        </ThemeProvider>
      </body>
    </html>
  )
}
