import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact - 1,400+ Members, 5+ Forks",
  description:
    "bits&bytes™ impact: 1,400+ active student members, 5+ city forks, 4+ events. Teen developers across India building and shipping with bits&bytes™.",
  keywords: [
    "bits&bytes™ impact",
    "teen coding statistics",
    "student developer community",
    "youth tech impact india",
    "student developer achievements",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our Impact - 1,400+ Members, 5+ Forks | bits&bytes™",
    description:
      "1,400+ active members, 5+ city forks, 4+ events.",
    url: "https://gobitsnbytes.org/impact",
    type: "website",
  },
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
