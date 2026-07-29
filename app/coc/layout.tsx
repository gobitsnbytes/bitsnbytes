import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | bits&bytes™ Community Guidelines",
  description:
    "bits&bytes™ community guidelines: safe, welcoming, and inclusive. Learn about our values, expectations, and reporting process for all participants and volunteers.",
  alternates: {
    canonical: "https://gobitsnbytes.org/coc",
  },
  openGraph: {
    title: "Code of Conduct | bits&bytes™ Community Guidelines",
    description: "Our community guidelines for creating a safe, welcoming environment for all teen developers.",
    url: "https://gobitsnbytes.org/coc",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cocJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/coc#webpage",
  url: "https://gobitsnbytes.org/coc",
  name: "Code of Conduct | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Code of Conduct", item: "https://gobitsnbytes.org/coc" },
    ],
  },
};

export default function CodeOfConductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cocJsonLd) }}
      />
      {children}
    </>
  );
}
