import type { Metadata } from "next";

import { ForkEdition } from "./fork-edition";

export const metadata: Metadata = {
  title: "Fork network: start a fork in your city",
  description:
    "Lead a bits&bytes™ fork in your city. Active forks: Bangalore, Kolkata, Chennai, Bhubaneswar, Nagpur, Mumbai, Delhi, Noida, Lucknow and Hyderabad.",
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
    title: "Fork network: start a bits&bytes™ fork in your city",
    description:
      "Apply to lead a bits&bytes™ fork: your city's own copy of upstream. Take the playbook and brand, run your own room, ship the work back.",
    url: "https://gobitsnbytes.org/fork",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ fork network: student-run forks across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fork network: start a bits&bytes™ fork in your city",
    description:
      "Lead a student-run bits&bytes™ fork in your city. Take the playbook from upstream, run your own room, ship the work back.",
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
      name: "Fork network: start a bits&bytes™ fork in your city",
      description: "Student-run bits&bytes™ forks in cities and schools across India.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Fork network", item: "https://gobitsnbytes.org/fork" },
        ],
      },
    },
    {
      "@type": "HowTo",
      "@id": "https://gobitsnbytes.org/fork#howto-start-a-fork",
      name: "How to start a bits&bytes™ fork",
      description: "How teenage builders start a bits&bytes™ fork: a local hackathon and builder crew in their city or school.",
      totalTime: "P14D",
      step: [
        {
          "@type": "HowToStep",
          name: "Apply",
          text: "Apply online at https://gobitsnbytes.org/fork with your city, your team and the events you want to run.",
          url: "https://gobitsnbytes.org/fork",
        },
        {
          "@type": "HowToStep",
          name: "Interview and board review",
          text: "Align with upstream on safety policies, brand standards and community guidelines.",
        },
        {
          "@type": "HowToStep",
          name: "Get the kit, host a kickoff",
          text: "Get graphics, venue playbooks and sponsor introductions, then run your first local meetup.",
        },
      ],
    },
    // No FAQPage here: /fork has no visible FAQ, and FAQ markup must match what the page shows.
  ],
};

export default function ForkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(forkJsonLd) }}
      />
      <ForkEdition applyUrl={applyUrl} />
    </>
  );
}

