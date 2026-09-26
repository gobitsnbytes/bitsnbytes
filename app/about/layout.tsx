import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About bits&bytes™ | Teen-led builder network in India",
  description:
    "Who runs bits&bytes™, a teen-led builder network across India: how it started after a cancelled hackathon, what we believe and the people behind it.",
  keywords: [
    "about bits&bytes™",
    "teen builders network india",
    "pan-india teen coding network",
    "student developers team",
    "youth tech organization india",
    "GOBITSNBYTES FOUNDATION",
    "teen programmers community",
    "youth-led nonprofit india",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/about",
  },
  openGraph: {
    title: "About bits&bytes™ | Teen-led builder network in India",
    description:
      "Who runs bits&bytes™, a teen-led builder network across India: how it started after a cancelled hackathon, what we believe and the people behind it.",
    url: "https://gobitsnbytes.org/about",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The bits&bytes™ team, a teen-led builder network across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About bits&bytes™ | Teen-led builder network in India",
    description:
      "Who runs bits&bytes™, a teen-led builder network across India: how it started after a cancelled hackathon, what we believe and the people behind it.",
  },
};

const personSchemas = [
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#yash-singh",
    name: "Yash Singh",
    jobTitle: "Chief Executive Officer",
    description:
      "National IOQM qualifier who prototypes with AI. Built Codiva, a 5-star VS Code extension with thousands of users. Lead organizer for developer meetups and student hackathons.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    url: "https://yashvibe.codes/",
    sameAs: [
      "https://www.linkedin.com/in/yashvardhansinghbnb/",
      "https://github.com/yashclouded",
    ],
    image: "https://gobitsnbytes.org/team/yash.jpeg",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#aadrika-maurya",
    name: "Aadrika Maurya",
    jobTitle: "Chief Creative Officer & Chief Operating Officer",
    description:
      "RSI India alumna who did neuroscience research on EEG signals and attention modeling. Leads the visual voice and creative strategy at bits&bytes™.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    url: "https://aadrikasportfolio.framer.website/",
    sameAs: [
      "https://www.linkedin.com/in/aadrika-maurya/",
      "https://github.com/Aadrika08",
    ],
    image: "https://gobitsnbytes.org/team/aadrika.png",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#akshat-kushwaha",
    name: "Akshat Kushwaha",
    jobTitle: "Chief Technology Officer",
    description:
      "Systems and LLMOps engineer. Former Jr. Research Engineer at jhana.ai. Built and runs the bits&bytes™ stack, from retrieval pipelines to production infrastructure.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    url: "https://a3ro.dev",
    sameAs: [
      "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      "https://github.com/a3ro-dev",
    ],
    image: "https://gobitsnbytes.org/team/akshat.jpg",
    email: "akshatsingh14372@outlook.com",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#devaansh-pathak",
    name: "Devaansh Pathak",
    jobTitle: "Chief Financial Officer",
    description:
      "Co-architected the bits&bytes™ backend. Manages partner accounts, sponsors and the budget.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: ["https://www.linkedin.com/in/devaanshpa/"],
    image: "https://gobitsnbytes.org/team/devansh.jpeg",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#drishti-arora",
    name: "Drishti Arora",
    jobTitle: "Chief Growth Officer",
    description:
      "Runs growth at bits&bytes™: audience campaigns, brand strategy and coordination across regional cohorts.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: ["https://www.linkedin.com/in/drish-arora"],
    image: "https://gobitsnbytes.org/team/drishti.jpg",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#raghwender-vasisth",
    name: "Raghwender Vasisth",
    jobTitle: "Head of Operations",
    description:
      "Keeps bits&bytes™ operations moving: process automation, resource planning and logistics for the team and its events.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: ["https://www.linkedin.com/in/raghwender-vasisth/"],
    image: "https://gobitsnbytes.org/team/raghav.png",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#maryam-fatima",
    name: "Maryam Fatima",
    jobTitle: "Head of Brand & Media",
    description:
      "Looks after media, visual content, graphic identity and social campaigns for bits&bytes™.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: ["https://www.linkedin.com/in/maryam-fatima-9719aa377/"],
    image: "https://gobitsnbytes.org/team/maryam.jpeg",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#srishti-singh",
    name: "Srishti Singh",
    jobTitle: "Head of Partnerships & Institutional Relations",
    description:
      "Handles institutional relations, sponsor contacts and communication with the regional chapters of bits&bytes™.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: ["https://www.linkedin.com/in/srishti-singh-ab6a1b391"],
    image: "https://gobitsnbytes.org/team/srishti.jpeg",
  },
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#angel",
    name: "Angel",
    jobTitle: "Head of Research & Strategy",
    description:
      "Leads research at bits&bytes™: studying the community and planning how the organization grows.",
    worksFor: { "@id": "https://gobitsnbytes.org/#organization" },
    sameAs: [
      "https://www.linkedin.com/in/angelp-online/",
      "https://www.instagram.com/rightangeled/",
    ],
    image: "https://gobitsnbytes.org/team/angel.jpg",
  },
];

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://gobitsnbytes.org/about#webpage",
      url: "https://gobitsnbytes.org/about",
      name: "About bits&bytes™ | Teen-led builder network in India",
      description:
        "Who runs bits&bytes™, a teen-led builder network across India: how it started after a cancelled hackathon, what we believe and the people behind it.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      about: { "@id": "https://gobitsnbytes.org/#organization" },
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
            name: "About",
            item: "https://gobitsnbytes.org/about",
          },
        ],
      },
    },
    ...personSchemas,
  ],
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      {children}
    </>
  );
}
