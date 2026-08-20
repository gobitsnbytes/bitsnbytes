import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact | 1400+ Builders, 5+ Forks — bits&bytes™",
  description:
    "See the real impact of bits&bytes™: 1400+ community members, 5+ active city Forks, 2700+ projects evaluated, and events across India's top institutions including IIT Kanpur.",
  keywords: [
    "bits&bytes™ impact",
    "teen coding statistics",
    "student developer community india",
    "youth tech impact india",
    "student developer achievements",
    "hack4good impact",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our Impact | 1400+ Builders, 5+ Forks — bits&bytes™",
    description:
      "1400+ active members, 5+ city Forks, 2700+ projects evaluated. See what India's boldest teen builder network has achieved.",
    url: "https://gobitsnbytes.org/impact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ Impact — 1400+ Builders across India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Impact | 1400+ Builders, 5+ Forks — bits&bytes™",
    description: "1400+ members, 5+ city Forks, 4+ events. See what India's boldest teen builder network has achieved.",
  },
};

const impactPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/impact#webpage",
      url: "https://gobitsnbytes.org/impact",
      name: "Our Impact | 1400+ Builders, 5+ Forks — bits&bytes™",
      description: "1400+ community members, 5+ Forks, events at IIT Kanpur and across India.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Impact", item: "https://gobitsnbytes.org/impact" },
        ],
      },
    },
    {
      "@type": "Dataset",
      "@id": "https://gobitsnbytes.org/impact#dataset",
      name: "India Youth Tech & Builder Benchmarks 2026",
      description:
        "Original survey data and empirical metrics on high school and teen developer adoption of AI tools, hackathon completion rates, and regional hub distribution in India.",
      creator: { "@id": "https://gobitsnbytes.org/#organization" },
      temporalCoverage: "2025-11-01/2026-08-20",
      spatialCoverage: "India",
      variableMeasured: [
        "Active Teen Builders (1,400+)",
        "Hackathon Project Evaluation Rate (2,700+ submissions)",
        "Mean Builder Age (16.5 Years)",
        "Agentic AI Tool Adoption (84%)",
        "Female Builder Participation (38%)",
        "Active Regional Forks (5+ Cities)",
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
  ],
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(impactPageJsonLd) }}
      />
      {children}
    </>
  );
}

