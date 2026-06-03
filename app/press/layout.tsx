import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Kit & Brand Assets - GOBITSNBYTES FOUNDATION",
  description:
    "Official Press Kit for bits&bytes. Download logo assets, access typography guidelines, read our origin story, and copy brand color palettes.",
  alternates: {
    canonical: "https://gobitsnbytes.org/press",
  },
  openGraph: {
    title: "Press Kit & Brand Assets | bits&bytes™",
    description: "Official logos, brand palettes, typography, leadership directory, and press contact for bits&bytes.",
    url: "https://gobitsnbytes.org/press",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PressKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
