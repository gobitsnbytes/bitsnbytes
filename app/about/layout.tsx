import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About bits&bytes™ | Teen-Led Builder Network, India",
  description:
    "Meet the student team behind India's boldest youth tech network. Learn about our origin story, founding mission, and the 9 core team members driving bits&bytes™ across India.",
  keywords: [
    "about bits&bytes™",
    "teen builders network india",
    "lucknow coding network",
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
    title: "About bits&bytes™ | Teen-Led Builder Network, India",
    description:
      "Meet the student team behind India's boldest youth tech network. Learn about our origin story, founding mission, and the 9 core team members driving bits&bytes™ across India.",
    url: "https://gobitsnbytes.org/about",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ Team — India's Youth-Led Builder Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About bits&bytes™ | Teen-Led Builder Network, India",
    description:
      "Meet the student team behind India's boldest youth tech network. Learn about our origin story, founding mission, and the 9 core team members driving bits&bytes™ across India.",
  },
};

const personSchemas = [
  {
    "@type": "Person",
    "@id": "https://gobitsnbytes.org/about#yash-singh",
    name: "Yash Singh",
    jobTitle: "Chief Executive Officer",
    description:
      "Math qualifier (IOQM) & AI prototyping dev. Creator of Codiva (5-star VS Code extension with thousands of users). Lead organizer for developer meetups and student hackathons.",
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
      "RSI India Alumni. Conducted neuroscience research on EEG signals and attention modeling. Leads brand visual voice and creative strategies at bits&bytes™.",
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
      "Systems architect and LLMOps engineer. Ex Jr. Research Engineer at jhana.ai. Builds high-performance retrieval pipelines and production infrastructure for bits&bytes™.",
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
      "Co-architected high-performance backend systems. Manages partner accounts, sponsor relationships, and budget logistics for bits&bytes™.",
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
      "Leads audience campaigns, community growth, brand strategy, and coordination across regional cohorts for bits&bytes™.",
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
      "Manages process automation, resource planning, logistical support, and team operations at scale across all bits&bytes™ events.",
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
      "Oversees media assets, visual content, graphic identity, and social media campaigns for bits&bytes™.",
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
      "Coordinates institutional relations, sponsor liaisons, and communications across regional chapters of bits&bytes™.",
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
      "Leads strategic research initiatives, community analysis, and organizational growth frameworks at bits&bytes™.",
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
      name: "About bits&bytes™ | Teen-Led Builder Network, India",
      description:
        "Meet the student team behind India's boldest youth tech network. Learn about our origin story and founding mission.",
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
