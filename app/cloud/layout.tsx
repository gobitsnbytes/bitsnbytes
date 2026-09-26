import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SparkCloud: free cloud for teen builders",
  description:
    "Free cloud spaces, container hosting and databases for Indian teens aged 13–19 in the bits&bytes™ community, run with Sparkden. No credit card needed.",
  keywords: [
    "sparkcloud",
    "bits&bytes cloud credits",
    "free cloud credits students india",
    "student cloud hosting india",
    "bits&bytes™ sparkcloud",
    "free compute credits teens",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/cloud",
  },
  openGraph: {
    title: "SparkCloud × bits&bytes™: free cloud for teen builders",
    description:
      "Free cloud spaces, container hosting and databases for teen builders in the bits&bytes™ community. No credit card needed.",
    url: "https://gobitsnbytes.org/cloud",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SparkCloud × bits&bytes™: free cloud for teen builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SparkCloud × bits&bytes™: free cloud for teen builders",
    description:
      "Free cloud spaces and hosting for teen builders in the bits&bytes™ community. No credit card needed.",
  },
};

const cloudPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/cloud#webpage",
      url: "https://gobitsnbytes.org/cloud",
      name: "SparkCloud | bits&bytes™",
      description:
        "Free cloud spaces for teen builders in the bits&bytes™ community, run with Sparkden.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://gobitsnbytes.org",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "SparkCloud",
            item: "https://gobitsnbytes.org/cloud",
          },
        ],
      },
    },
    {
      "@type": "Service",
      "@id": "https://gobitsnbytes.org/cloud#service",
      name: "SparkCloud Credits Programme",
      description:
        "Free cloud compute, hosting and databases for teen builders in the bits&bytes™ community.",
      provider: { "@id": "https://gobitsnbytes.org/#organization" },
      audience: {
        "@type": "Audience",
        audienceType: "Teen developers and student builders in India",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free cloud access for eligible bits&bytes™ community members aged 13–19",
      },
    },
  ],
};

export default function CloudLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cloudPageJsonLd) }}
      />
      {children}
    </>
  );
}
