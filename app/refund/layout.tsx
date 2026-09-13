import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | GOBITSNBYTES FOUNDATION",
  description:
    "Official Cancellation and Refund Policy for bits&bytes™ (GOBITSNBYTES FOUNDATION). Learn about our 100% free student programs, donation policies, and refund timelines.",
  alternates: {
    canonical: "https://gobitsnbytes.org/refund",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | bits&bytes™",
    description: "Clear, transparent rules regarding event participation, sponsorships, donations, and refunds under Indian consumer regulations.",
    url: "https://gobitsnbytes.org/refund",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const refundJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/refund#webpage",
  url: "https://gobitsnbytes.org/refund",
  name: "Cancellation & Refund Policy | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Refund Policy", item: "https://gobitsnbytes.org/refund" },
    ],
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(refundJsonLd) }}
      />
      {children}
    </>
  );
}
