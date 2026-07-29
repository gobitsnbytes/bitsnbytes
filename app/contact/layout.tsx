import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact bits&bytes™ | Partnerships, Press & Inquiries",
  description:
    "Reach the bits&bytes™ team in Lucknow, India. For partnerships, press inquiries, sponsorships, or general questions — we respond within 48 hours.",
  keywords: [
    "contact bits&bytes™",
    "teen builders network contact",
    "lucknow coding network email",
    "bits&bytes™ partnerships",
    "bits&bytes™ sponsorship",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/contact",
  },
  openGraph: {
    title: "Contact bits&bytes™ | Partnerships, Press & Inquiries",
    description:
      "Reach the bits&bytes™ team in Lucknow, India. For partnerships, press inquiries, sponsorships, or general questions — we respond within 48 hours.",
    url: "https://gobitsnbytes.org/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact bits&bytes™" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact bits&bytes™ | Partnerships, Press & Inquiries",
    description: "Reach the bits&bytes™ team for partnerships, press, or sponsorships. Based in Lucknow, India.",
  },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://gobitsnbytes.org/contact#webpage",
      url: "https://gobitsnbytes.org/contact",
      name: "Contact bits&bytes™",
      description: "Get in touch with the bits&bytes™ team for partnerships, press, or community inquiries.",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Contact", item: "https://gobitsnbytes.org/contact" },
        ],
      },
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      {children}
    </>
  );
}
