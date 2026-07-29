import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | GOBITSNBYTES FOUNDATION",
  description:
    "Official Terms of Service for bits&bytes™. Covers network participation, youth operational guidelines, Fork terms, IP policy, and Section 8 compliance.",
  alternates: {
    canonical: "https://gobitsnbytes.org/terms",
  },
  openGraph: {
    title: "Terms of Service | bits&bytes™",
    description: "Official legal terms governing the bits&bytes™ network, Forks, and participants.",
    url: "https://gobitsnbytes.org/terms",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/terms#webpage",
  url: "https://gobitsnbytes.org/terms",
  name: "Terms of Service | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://gobitsnbytes.org/terms" },
    ],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      {children}
    </>
  );
}
