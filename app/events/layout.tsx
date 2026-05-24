import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Bits&Bytes",
  description:
    "Bits&Bytes pipelines real projects. From teen-led hackathons to our production deployments at India Innovates 2026. Code meets action.",
  keywords: [
    "India Innovates 2026",
    "hackathons",
    "coding events",
    "teen tech events",
    "Bharat Mandapam events",
    "Bits&Bytes events",
    "student hackathons",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/events",
  },
  openGraph: {
    title: "Events | Bits&Bytes",
    description: "Bits&Bytes pipelines real projects. From teen-led hackathons to our production deployments at India Innovates 2026.",
    url: "https://gobitsnbytes.org/events",
    type: "website",
  },
};

// Events structured data for Google rich results
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bits&Bytes Events",
  description: "Hackathons, workshops, and tech events for teen developers in India",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Event",
        name: "India Innovates 2026",
        description:
          "World's Largest Civic Tech Hackathon. Bits&Bytes served as the Official Executive Partner. ₹10 Lakh+ prize pool across Applied AI, Robotics & Drones, and Civic Tech & Defence domains.",
        startDate: "2026-03-28",
        endDate: "2026-03-28",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventMovedOnline",
        url: "https://indiainnovates.org",
        location: {
          "@type": "Place",
          name: "Bharat Mandapam",
          address: {
            "@type": "PostalAddress",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "HN Group & MCD",
        },
      },
    },
  ],
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      {children}
    </>
  );
}
