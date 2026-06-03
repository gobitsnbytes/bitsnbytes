import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - GOBITSNBYTES FOUNDATION",
  description:
    "Official Privacy Policy for bits&bytes. Learn how we handle participant data, DPDPA compliance, cookies, and minor safeguarding safeguards.",
  alternates: {
    canonical: "https://gobitsnbytes.org/privacy",
  },
  openGraph: {
    title: "Privacy Policy | bits&bytes™",
    description: "Our commitment to user privacy, DPDPA 2023 compliance, and safeguarding participant data.",
    url: "https://gobitsnbytes.org/privacy",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
