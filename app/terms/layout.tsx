import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - GOBITSNBYTES FOUNDATION",
  description:
    "Official Terms of Service for bits&bytes. Learn about our network model, youth operational guidelines, IP policy, and Section 8 compliance.",
  alternates: {
    canonical: "https://gobitsnbytes.org/terms",
  },
  openGraph: {
    title: "Terms of Service | bits&bytes™",
    description: "Official legal terms governing the bits&bytes network, forks, and participants.",
    url: "https://gobitsnbytes.org/terms",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
