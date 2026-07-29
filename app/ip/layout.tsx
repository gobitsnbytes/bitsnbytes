import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intellectual Property Policy | GOBITSNBYTES FOUNDATION",
  description:
    "Official Intellectual Property Policy for bits&bytes™. Brand kit compliance, open-source defaults, contributor IP assignment, and DMCA copyright claims.",
  alternates: {
    canonical: "https://gobitsnbytes.org/ip",
  },
  openGraph: {
    title: "Intellectual Property Policy | bits&bytes™",
    description: "Legal policies governing brand kit compliance, open-source software defaults, and copyright protection.",
    url: "https://gobitsnbytes.org/ip",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ipJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/ip#webpage",
  url: "https://gobitsnbytes.org/ip",
  name: "Intellectual Property Policy | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "IP Policy", item: "https://gobitsnbytes.org/ip" },
    ],
  },
};

export default function IntellectualPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ipJsonLd) }}
      />
      {children}
    </>
  );
}
