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
      name: "Fork Network | Start a bits&bytes™ Hub in Your City",
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
    {
      "@type": "HowTo",
      "@id": "https://gobitsnbytes.org/fork#howto-start-a-fork",
      name: "How to Launch a bits&bytes™ Regional Fork Chapter",
      description: "Instructions for high school and teenage builders to start a local hackathon and builder squad in their city.",
      totalTime: "P14D",
      step: [
        {
          "@type": "HowToStep",
          name: "Submit Fork Application",
          text: "Apply online at https://gobitsnbytes.org/fork with your city, team members, and proposed events.",
          url: "https://gobitsnbytes.org/fork",
        },
        {
          "@type": "HowToStep",
          name: "Complete Interview & Board Review",
          text: "Align with Upstream leadership on safety policies, brand standards, and community guidelines.",
        },
        {
          "@type": "HowToStep",
          name: "Receive Operational Kit & Host Kickoff",
          text: "Get access to graphics, venue playbooks, sponsor introductions, and run your first local meetup.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://gobitsnbytes.org/fork#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a bits&bytes™ Fork?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A Fork is a recognized local or institutional chapter of the bits&bytes™ network where students run hackathons, workshops, and build squads under our non-profit governance.",
          },
        },
        {
          "@type": "Question",
          name: "Can a Fork raise its own funds or sign contracts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Fork recognition is an operational and brand-use license. All legal agreements, sponsorship contracts, and fundraising must be executed through Upstream at GOBITSNBYTES FOUNDATION.",
          },
        },
      ],
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

