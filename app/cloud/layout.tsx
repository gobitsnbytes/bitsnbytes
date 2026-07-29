import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SparkCloud | Free Cloud Credits for bits&bytes™ Builders",
  description:
    "SparkCloud is bits&bytes™'s cloud credits programme for student builders. Apply for free compute, hosting, and infrastructure credits to ship your projects.",
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
    title: "SparkCloud | Free Cloud Credits for bits&bytes™ Builders",
    description:
      "Apply for free cloud credits, compute, and hosting through the SparkCloud programme by bits&bytes™.",
    url: "https://gobitsnbytes.org/cloud",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SparkCloud — Free Cloud Credits for bits&bytes™ Builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SparkCloud | Free Cloud Credits for bits&bytes™ Builders",
    description:
      "Free cloud credits, compute, and hosting for teen builders in the bits&bytes™ network.",
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
        "Free cloud credits programme for student builders in the bits&bytes™ network.",
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
        "Free cloud compute, hosting, and infrastructure credits for teen builders in the bits&bytes™ network.",
      provider: { "@id": "https://gobitsnbytes.org/#organization" },
      audience: {
        "@type": "Audience",
        audienceType: "Teen developers and student builders in India",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free cloud credits for qualifying bits&bytes™ members",
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
