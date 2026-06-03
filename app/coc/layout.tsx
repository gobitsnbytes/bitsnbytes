import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct - Community Guidelines",
  description:
    "bits&bytes™ community guidelines for a safe, welcoming & inclusive environment. Learn about our values, expectations & policies for teen coders.",
  alternates: {
    canonical: "https://gobitsnbytes.org/coc",
  },
  openGraph: {
    title: "Code of Conduct | bits&bytes™",
    description: "Our community guidelines for creating a safe, welcoming environment for all teen developers.",
    url: "https://gobitsnbytes.org/coc",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CodeOfConductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
