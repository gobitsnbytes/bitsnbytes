import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact - 1,500+ Students, 100% Student-led",
  description:
    "Bits&Bytes impact: 1,500+ active student members, 2,700+ evaluated submissions, 100% student-led. Teen developers across India building and shipping with Bits&Bytes.",
  keywords: [
    "bits and bytes impact",
    "teen coding statistics",
    "student developer community",
    "youth tech impact india",
    "coding club achievements",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our Impact - 1,500+ Students, 100% Student-led | Bits&Bytes",
    description:
      "1,500+ active members, 2,700+ evaluated submissions, 100% student-led.",
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
