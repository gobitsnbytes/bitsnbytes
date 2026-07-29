import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GOBITSNBYTES FOUNDATION",
  description:
    "Official Privacy Policy for bits&bytes™. Learn how we handle participant data, comply with DPDPA 2023, and safeguard minors under POCSO.",
  alternates: {
    canonical: "https://gobitsnbytes.org/privacy",
  },
  openGraph: {
    title: "Privacy Policy | bits&bytes™",
    description: "Our commitment to user privacy, DPDPA 2023 compliance, and safeguarding participant data.",
    url: "https://gobitsnbytes.org/privacy",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/privacy#webpage",
  url: "https://gobitsnbytes.org/privacy",
  name: "Privacy Policy | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://gobitsnbytes.org/privacy" },
    ],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      {children}
    </>
  );
}
