import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ: questions people actually ask us",
  description:
    "Straight answers about bits&bytes™ hackathons: teams, what to bring, parents, what you own, how we handle your data and how forks work.",
  keywords: [
    "bits&bytes™ faq",
    "teen coding network questions",
    "hackathon faq",
    "how to join coding network",
    "student hackathon questions",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/faq",
  },
  openGraph: {
    title: "bits&bytes™ FAQ: questions people actually ask us",
    description:
      "Straight answers about bits&bytes™ hackathons: teams, what to bring, what you own and how forks work.",
    url: "https://gobitsnbytes.org/faq",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "bits&bytes™ FAQ: questions people actually ask us",
    description: "Does it cost anything? Do I need experience? Can I bring a team? Straight answers from bits&bytes™.",
  },
};

// The FAQPage JSON-LD lives in page.tsx, generated from the visible questions so the two never drift.
export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
