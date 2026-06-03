import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with bits&bytes™",
  description:
    "Contact bits&bytes™ team for partnerships, volunteering, questions or collaboration. Reach India's teen-led builders club based in Lucknow, Uttar Pradesh.",
  keywords: [
    "contact bits&bytes™",
    "teen builders club contact",
    "lucknow coding club email",
    "bits&bytes™ support",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/contact",
  },
  openGraph: {
    title: "Contact Us | bits&bytes™",
    description: "Get in touch with bits&bytes™ team for partnerships, volunteering, or questions.",
    url: "https://gobitsnbytes.org/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
