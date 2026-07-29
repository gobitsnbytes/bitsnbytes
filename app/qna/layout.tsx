import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI Assistant | Ask bits&bytes™ Anything",
  description:
    "Chat live with the bits&bytes™ AI assistant. Ask about joining the network, upcoming events, Forks, how bits&bytes™ works, or anything else about our community.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://gobitsnbytes.org/qna",
  },
  openGraph: {
    title: "QnA Assistant | bits&bytes™ AI Bot",
    description:
      "Chat with the official bits&bytes™ AI assistant. Ask anything about our network, events, and tech community.",
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
    title: "QnA Assistant | bits&bytes™ AI",
    description:
      "Chat with the official bits&bytes™ AI assistant. Ask about our network, events, and community.",
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
