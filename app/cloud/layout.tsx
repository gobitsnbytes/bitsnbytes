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
    {
      "@type": "FAQPage",
      "@id": "https://gobitsnbytes.org/cloud#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SparkCloud?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SparkCloud is an educational PaaS operated in partnership with Sparkden (The Spark Forward Foundation, Inc.) that provides free cloud development spaces, container compute, and databases for teen builders without credit cards.",
          },
        },
        {
          "@type": "Question",
          name: "Who is eligible for SparkCloud credits?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Active bits&bytes™ community members who are Indian residents aged 13 to 19 with a verified GitHub account and Student ID.",
          },
        },
        {
          "@type": "Question",
          name: "Does SparkCloud require a credit card?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. SparkCloud uses a transparent non-expiring student token grant billing model that eliminates credit card requirements and surprise cloud bills.",
          },
        },
      ],
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
