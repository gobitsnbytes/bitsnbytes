import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact bits&bytes™ | Partnerships, press and sponsors",
  description:
    "Email the bits&bytes™ team about partnerships, sponsorships, press or anything else. We are a teen-led network across India and reply within 48 hours.",
  keywords: [
    "contact bits&bytes™",
    "teen builders network contact",
    "pan-india teen coding network email",
    "bits&bytes™ partnerships",
    "bits&bytes™ sponsorship",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/contact",
  },
  openGraph: {
    title: "Contact bits&bytes™ | Partnerships, press and sponsors",
    description:
      "Email the bits&bytes™ team about partnerships, sponsorships, press or anything else. We are a teen-led network across India and reply within 48 hours.",
    url: "https://gobitsnbytes.org/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact bits&bytes™" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact bits&bytes™ | Partnerships, press and sponsors",
    description: "Partnerships, sponsorships, press or a question: email the bits&bytes™ team. We reply within 48 hours.",
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
      description: "Contact the bits&bytes™ team about partnerships, sponsorships, press or community questions.",
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
