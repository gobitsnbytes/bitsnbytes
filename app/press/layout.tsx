import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press kit and brand assets | bits&bytes™",
  description:
    "The bits&bytes™ press kit: logos, brand colors, typography, public facts, the leadership directory, and a press contact. For journalists and partners.",
  keywords: [
    "bits&bytes™ press kit",
    "GOBITSNBYTES FOUNDATION press",
    "bits&bytes brand assets",
    "youth tech nonprofit media kit",
    "bits&bytes logo download",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/press",
  },
  openGraph: {
    title: "Press kit and brand assets | bits&bytes™",
    description:
      "Logos, brand colors, typography, and the leadership directory for bits&bytes™. For journalists and media partners.",
    url: "https://gobitsnbytes.org/press",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ press kit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press kit and brand assets | bits&bytes™",
    description: "Official logos, brand colors, typography, and a press contact for bits&bytes™.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const pressPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gobitsnbytes.org/press#webpage",
  url: "https://gobitsnbytes.org/press",
  name: "Press kit | bits&bytes™",
  description: "Official press kit with logos, brand assets, and the leadership directory for bits&bytes™.",
  isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
      { "@type": "ListItem", position: 2, name: "Press", item: "https://gobitsnbytes.org/press" },
    ],
  },
};

export default function PressKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressPageJsonLd) }}
      />
      {children}
    </>
  );
}
