import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Ask the bits&bytes™ AI assistant",
  description:
    "Ask the bits&bytes™ assistant about joining, events, forks and how we work. It answers from our published docs and the page you are on.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://gobitsnbytes.org/qna",
  },
  openGraph: {
    title: "Ask the bits&bytes™ AI assistant",
    description:
      "Ask our assistant about joining, events and forks. It answers from what we have published.",
    url: "https://gobitsnbytes.org/qna",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ QnA Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask the bits&bytes™ AI assistant",
    description:
      "Ask our assistant about joining, events and forks. It answers from what we have published.",
    images: ["/og-image.png"],
    creator: "@gobitsnbytes",
  },
};

// Breadcrumb schema for inner page SEO
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://gobitsnbytes.org",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "QnA Assistant",
      item: "https://gobitsnbytes.org/qna",
    },
  ],
};

export default function QnALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
