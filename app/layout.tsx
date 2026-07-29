import type React from "react";
import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/site-chrome";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-accent-sans",
  weight: ["400"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// SEO-optimized viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#97192C" },
    { media: "(prefers-color-scheme: dark)", color: "#1E0509" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gobitsnbytes.org"),
  manifest: "/manifest.webmanifest",
  title: {
    default: "bits&bytes™ | India's Boldest Youth Builder Network & Hackathons",
    template: "%s | bits&bytes™",
  },
  description:
    "Join India's boldest pan-India youth-led builder network. Build real software, attend hackathons, and grow with 1400+ teen developers nationwide.",
  keywords: [
    "bits&bytes™",
    "bits&bytes",
    "bitsnbytes",
    "GOBITSNBYTES FOUNDATION",
    "pan india youth builder network",
    "pan india student hackathons",
    "nationwide teen developers india",
    "youth hackathons lucknow",
    "youth hackathons delhi",
    "youth hackathons hyderabad",
    "youth hackathons bangalore",
    "agentic ai hackathons india",
    "free tech events for teens",
    "section 8 non profit youth tech",
  ],
  authors: [{ name: "bits&bytes™ Team", url: "https://gobitsnbytes.org/about" }],
  creator: "GOBITSNBYTES FOUNDATION",
  publisher: "GOBITSNBYTES FOUNDATION",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://gobitsnbytes.org",
    languages: {
      "en-IN": "https://gobitsnbytes.org",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gobitsnbytes.org",
    siteName: "bits&bytes™",
    title: "bits&bytes™ | Pan-India Youth-Led Builder Network & Hackathons",
    description:
      "Join India's boldest pan-India youth-led builder network. Build real software, attend hackathons, and grow with 1400+ teen developers nationwide.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ - Pan-India Youth-Led Builder Network",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bits&bytes™ | Pan-India Youth-Led Builder Network & Hackathons",
    description:
      "Join India's boldest pan-India youth-led builder network. Build real software, attend hackathons, and grow with 1400+ teen developers nationwide.",
    images: ["/og-image.png"],
    creator: "@gobitsnbytes",
    site: "@gobitsnbytes",
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION || "google-site-verification-code",
  },
  category: "education",
  classification: "Nonprofit Pan-India Youth Builder Network",
  other: {
    "msapplication-TileColor": "#97192C",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization + NGO + Pan-India LocalBusiness structured data for Knowledge Panel & Local SEO
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "NGO", "EducationalOccupationalProgram"],
        "@id": "https://gobitsnbytes.org/#organization",
        name: "bits&bytes™",
        legalName: "GOBITSNBYTES FOUNDATION",
        alternateName: ["bits&bytes", "bitsnbytes", "GOBITSNBYTES FOUNDATION", "bits&bytes India", "bits&bytes Builder Network"],
        url: "https://gobitsnbytes.org",
        logo: {
          "@type": "ImageObject",
          url: "https://gobitsnbytes.org/logo.svg",
          width: 512,
          height: 512,
        },
        image: "https://gobitsnbytes.org/og-image.png",
        description:
          "India's premier pan-India youth-led builder network operated by GOBITSNBYTES FOUNDATION (Section 8 non-profit). Organizing student hackathons, hardware meetups, AI sprints, and local builder hubs across India.",
        disambiguatingDescription:
          "Pan-India youth builder network and Section 8 non-profit organisation (GOBITSNBYTES FOUNDATION). Not affiliated with the PyTorch Python library bitsandbytes, BNB cryptocurrency/Binance, or Airbnb.",
        foundingDate: "2025-11-01",
        nonprofitStatus: "NonprofitSection8",
        email: "hello@gobitsnbytes.org",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lucknow",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.8467,
          longitude: 80.9462,
        },
        areaServed: [
          {
            "@type": "Country",
            name: "India",
          },
          {
            "@type": "City",
            name: "Jaipur",
          },
          {
            "@type": "City",
            name: "Hyderabad",
          },
          {
            "@type": "City",
            name: "Bengaluru",
          },
          {
            "@type": "City",
            name: "Kolkata",
          },
          {
            "@type": "City",
            name: "Noida",
          },
          {
            "@type": "City",
            name: "Lucknow",
          },
        ],
        sameAs: [
          "https://www.linkedin.com/company/gobitsbytes",
          "https://github.com/gobitsnbytes",
          "https://x.com/gobitsnbytes",
          "https://www.instagram.com/gobitsnbytes",
          "https://discord.gg/rjqPfwKKTE",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "hello@gobitsnbytes.org",
            url: "https://gobitsnbytes.org/contact",
            availableLanguage: ["English", "Hindi"],
          },
        ],
        knowsAbout: [
          "Web Development",
          "Mobile App Development",
          "Artificial Intelligence",
          "Agentic AI",
          "Hackathons",
          "Youth Coding Education",
          "Open Source",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://gobitsnbytes.org/#localbusiness",
        name: "bits&bytes™ HQ (GOBITSNBYTES FOUNDATION)",
        image: "https://gobitsnbytes.org/og-image.png",
        url: "https://gobitsnbytes.org",
        email: "hello@gobitsnbytes.org",
        priceRange: "Free",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lucknow",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.8467,
          longitude: 80.9462,
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
    ],
  };

  // WebSite structured data for sitelinks search box
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://gobitsnbytes.org/#website",
    url: "https://gobitsnbytes.org",
    name: "bits&bytes™",
    description:
      "India's youth-led builder network for hackathons, workshops, and building real projects",
    publisher: {
      "@id": "https://gobitsnbytes.org/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gobitsnbytes.org/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };

  // Breadcrumb for homepage
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gobitsnbytes.org",
      },
    ],
  };

  // Navigation/Sitelinks structured data
  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: "https://gobitsnbytes.org",
    hasPart: [
      {
        "@type": "WebPage",
        name: "About Us",
        description: "Learn about bits&bytes™ - India's youth-led builder network",
        url: "https://gobitsnbytes.org/about",
      },
      {
        "@type": "WebPage",
        name: "Events",
        description: "Hackathons, workshops, and tech events for students",
        url: "https://gobitsnbytes.org/events",
      },
      {
        "@type": "WebPage",
        name: "Impact",
        description: "See our community impact - 1400+ students, 100% student-led",
        url: "https://gobitsnbytes.org/impact",
      },
      {
        "@type": "WebPage",
        name: "Fork Network",
        description: "Local chapters and builder hubs across India",
        url: "https://gobitsnbytes.org/fork",
      },
      {
        "@type": "WebPage",
        name: "Press & Media Kit",
        description: "Official logos, brand kit, facts, and press releases",
        url: "https://gobitsnbytes.org/press",
      },
      {
        "@type": "WebPage",
        name: "Join Us",
        description: "Join India's boldest youth-led builder network - free membership",
        url: "https://gobitsnbytes.org/join",
      },
      {
        "@type": "WebPage",
        name: "Contact",
        description: "Get in touch with bits&bytes™ team in Lucknow",
        url: "https://gobitsnbytes.org/contact",
      },
      {
        "@type": "WebPage",
        name: "FAQ",
        description: "Frequently asked questions about bits&bytes™",
        url: "https://gobitsnbytes.org/faq",
      },
    ],
  };


  return (
    <html
      lang="en-IN"
      className={`${anton.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-accent/30 selection:text-primary overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationJsonLd),
          }}
        />
        <ThemeProvider>
          <SmoothCursor />
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
