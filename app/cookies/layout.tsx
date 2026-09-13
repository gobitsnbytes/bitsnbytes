import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | GOBITSNBYTES FOUNDATION",
  description:
    "Official Cookie & Tracking Policy for bits&bytes™. Learn how we use essential cookies and storage, protect privacy, and comply with DPDP Act 2023.",
  alternates: {
    canonical: "https://gobitsnbytes.org/cookies",
  },
  openGraph: {
    title: "Cookie Policy | bits&bytes™",
    description: "Our approach to cookies, telemetry, and local storage: privacy-first, zero third-party advertising, and child-safe.",
    url: "https://gobitsnbytes.org/cookies",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cookieJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/cookies#webpage",
  url: "https://gobitsnbytes.org/cookies",
  name: "Cookie Policy | bits&bytes™",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: "https://gobitsnbytes.org/cookies" },
    ],
  },
};

export default function CookieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cookieJsonLd) }}
      />
      {children}
    </>
  );
}
