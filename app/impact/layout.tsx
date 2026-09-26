import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our impact: the events and forks behind bits&bytes™",
  description:
    "The record behind bits&bytes™: India Innovates 2026, Hack4Good v0, Execron 1.0 at IIT Kanpur, and forks in cities across India.",
  keywords: [
    "bits&bytes™ impact",
    "student developer community india",
    "youth tech impact india",
    "student developer achievements",
    "hack4good impact",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our impact: the events and forks behind bits&bytes™",
    description:
      "The record behind bits&bytes™: India Innovates 2026, Hack4Good v0, Execron 1.0 at IIT Kanpur, and forks in cities across India.",
    url: "https://gobitsnbytes.org/impact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ impact: events and forks across India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our impact: the events and forks behind bits&bytes™",
    description: "The record behind bits&bytes™: India Innovates 2026, Hack4Good v0, Execron 1.0 at IIT Kanpur, and forks in cities across India.",
  },
};

const impactPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/impact#webpage",
      url: "https://gobitsnbytes.org/impact",
      name: "Our impact: the events and forks behind bits&bytes™",
      description: "The record behind bits&bytes™: India Innovates 2026, Hack4Good v0, Execron 1.0 at IIT Kanpur, and forks in cities across India.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Impact", item: "https://gobitsnbytes.org/impact" },
        ],
      },
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

