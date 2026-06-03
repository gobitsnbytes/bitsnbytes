import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Meet India's Youth-Led Builder Network",
  description:
    "Learn about bits&bytes™ - India's boldest youth-led builder network based in Lucknow. Meet our team, our mission, and our open source culture.",
  keywords: [
    "about bits&bytes™",
    "teen builders network india",
    "lucknow coding network",
    "student developers team",
    "youth tech organization india",
    "teen programmers community",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/about",
  },
  openGraph: {
    title: "About Us - Meet India's Youth-Led Builder Network | bits&bytes™",
    description:
      "Learn about bits&bytes™, our mission, and the teen developers building India's boldest youth-led builder network.",
    url: "https://gobitsnbytes.org/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
