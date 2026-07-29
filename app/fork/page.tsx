import type { Metadata } from "next";

import { ForkScroll } from "./fork-scroll";

export const metadata: Metadata = {
  title: "Fork Network | Start a bits&bytes™ Hub in Your City",
  description:
    "Apply to lead a bits&bytes™ Fork — a student-run local chapter in your city. 5+ active Forks operating across Jaipur, Hyderabad, Bengaluru, Kolkata, and Noida.",
  keywords: [
    "bits&bytes fork",
    "student tech hub india",
    "local hackathon chapter india",
    "youth tech community chapter",
    "bits&bytes local chapter",
    "apply fork bits&bytes",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/fork",
  },
  openGraph: {
    title: "Fork Network | Start a bits&bytes™ Hub in Your City",
    description:
      "Apply to lead a bits&bytes™ Fork — a student-run local chapter in your city. 5+ active Forks across India.",
    url: "https://gobitsnbytes.org/fork",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ Fork Network — Local Student-Led Chapters across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fork Network | Start a bits&bytes™ Hub in Your City",
    description:
      "5+ active Forks across India. Apply to lead one in your city.",
  },
};

const applyUrl =
  "https://perfect-dinghy-781.notion.site/33a49ed2fc33800984e7c28ca3d7cd2a?pvs=105";

const forkJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/fork#webpage",
      url: "https://gobitsnbytes.org/fork",
      name: "Fork Network | bits&bytes™",
      description: "Student-run local chapters of the bits&bytes™ network across India.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Fork Network", item: "https://gobitsnbytes.org/fork" },
        ],
      },
    },
  ],
};

export default function ForkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(forkJsonLd) }}
      />
      <ForkScroll applyUrl={applyUrl} />
    </>
  );
}

