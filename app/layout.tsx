import type React from "react";
import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/site-chrome";

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
    { media: "(prefers-color-scheme: light)", color: "#3E1E68" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gobitsnbytes.org"),
  manifest: "/manifest.webmanifest",
  title: {
    default:
      "bits&bytes™ - India's Youth-Led Builder Network | Hackathons & Tech Community",
    template: "%s | bits&bytes™",
  },
  description:
    "Innovate. Collaborate. Hack. Join India's boldest youth-led builder network. Build real projects, attend hackathons, and grow as a developer. 1500+ active members and 2700+ participant submissions evaluated in 3 days.",
  keywords: [
    "bits&bytes™",
    "bits&bytes",
    "teen builders network india",
    "india hackathons for students",
    "student developers india",
    "coding network lucknow",
    "tech events india",
    "learn coding for teens",
    "teen programmers community",
    "hackathons in india 2025",
    "coding classes for teens india",
    "high school coding network",
    "teen tech community",
    "youth coding programs india",
    "student hackathon india",
    "free coding network india",
  ],
  authors: [{ name: "bits&bytes™ Team", url: "https://gobitsnbytes.org/about" }],
  creator: "bits&bytes™",
  publisher: "bits&bytes™",
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
    title:
      "bits&bytes™ - India's Youth-Led Builder Network | Hackathons & Tech Community",
    description:
      "Join India's boldest youth-led builder network. Build real projects, attend hackathons, and grow as a developer. 1500+ active members.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ - India's Youth-Led Builder Network",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bits&bytes™ - India's Youth-Led Builder Network",
    description:
      "Join India's boldest youth-led builder network. 1500+ active members building and shipping real products.",
    images: ["/og-image.png"],
    creator: "@bitsnbytes_lko",
    site: "@bitsnbytes_lko",
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION || "google-site-verification-code",
  },
  category: "education",
  classification: "Nonprofit Youth Builder Network",
  other: {
    "msapplication-TileColor": "#3E1E68",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization structured data for Google Knowledge Panel
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://gobitsnbytes.org/#organization",
    name: "bits&bytes™",
    alternateName: ["bits&bytes™", "BitsNBytes", "bits&bytes™"],
    url: "https://gobitsnbytes.org",
    logo: {
      "@type": "ImageObject",
      url: "https://gobitsnbytes.org/logo.svg",
      width: 512,
      height: 512,
    },
    image: "https://gobitsnbytes.org/og-image.png",
    description:
      "India's boldest youth-led builder network. We run hackathons, workshops, and build real projects with 1500+ student developers across India.",
    foundingDate: "2025",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lucknow",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [
      "https://www.linkedin.com/company/gobitsbytes",
      "https://github.com/gobitsnbytes",
      "https://twitter.com/bitsnbytes_lko",
      "https://www.instagram.com/gobitsnbytes",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://gobitsnbytes.org/contact",
      availableLanguage: ["English", "Hindi"],
    },
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Hackathons",
      "Youth Coding Education",
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
        name: "Projects",
        description: "Explore projects built by teen developers",
        url: "https://gobitsnbytes.org/projects",
      },
      {
        "@type": "WebPage",
        name: "Events",
        description: "Hackathons, workshops, and tech events for students",
        url: "https://gobitsnbytes.org/events",
      },
      {
        "@type": "WebPage",
        name: "Join Us",
        description: "Join India's boldest youth-led builder network - free membership",
        url: "https://gobitsnbytes.org/join",
      },
      {
        "@type": "WebPage",
        name: "Impact",
        description: "See our community impact - 1500+ students, 100% student-led",
        url: "https://gobitsnbytes.org/impact",
      },
      {
        "@type": "WebPage",
        name: "Contact",
        description: "Get in touch with bits&bytes™ team",
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
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
