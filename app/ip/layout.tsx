import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intellectual Property Policy - GOBITSNBYTES FOUNDATION",
  description:
    "Official Intellectual Property Policy for bits&bytes. Learn about brand kit compliance, open-source defaults, contributor licenses, and DMCA copyright claims.",
  alternates: {
    canonical: "https://gobitsnbytes.org/ip",
  },
  openGraph: {
    title: "Intellectual Property Policy | bits&bytes™",
    description: "Legal policies governing brand kit compliance, open-source software defaults, and copyright protection.",
    url: "https://gobitsnbytes.org/ip",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntellectualPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
