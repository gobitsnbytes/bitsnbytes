import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join bits&bytes™ | Free Teen Builder Network India",
  description:
    "Join 1400+ teen developers in India's boldest youth builder network. Free membership, real hackathons, and a crew that actually ships. Ages 13-19 welcome.",
  keywords: [
    "join bits&bytes™",
    "teen coding network membership",
    "free coding network india",
    "how to join hackathon network",
    "student developer community",
    "teen programmers india join",
    "youth tech network free membership",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/join",
  },
  openGraph: {
    title: "Join bits&bytes™ | Free Teen Builder Network India",
    description:
      "Join 1400+ teen developers in India's boldest youth builder network. Free membership, real hackathons, and a crew that actually ships. Ages 13-19 welcome.",
    url: "https://gobitsnbytes.org/join",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Join bits&bytes™ — Free Teen Builder Network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join bits&bytes™ | Free Teen Builder Network India",
    description: "Join 1400+ teen developers. Free membership, real hackathons, and a crew that ships.",
  },
};

const joinPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/join#webpage",
  url: "https://gobitsnbytes.org/join",
  name: "Join bits&bytes™",
  description: "Free membership for teen builders aged 13-19. Join 1400+ developers across India.",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Join", item: "https://gobitsnbytes.org/join" },
    ],
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(joinPageJsonLd) }}
      />
      {children}
    </>
  );
}
