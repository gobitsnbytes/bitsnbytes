import { Metadata } from "next";

import { communityPartnerEvents } from "@/lib/events-data";

const TITLE = "Hackathons and events across India";
const DESCRIPTION = "Hackathons across India we've run, co-hosted or backed, from Execron at IIT Kanpur to India Innovates, with the footage and photos from each.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "India Innovates 2026",
    "hack4good lucknow",
    "student hackathon india 2026",
    "agentic ai hackathon",
    "github copilot dev days lucknow",
    "execron iit kanpur",
    "teen tech events india",
    "bits&bytes™ events",
    "student hackathons",
    "free youth workshops india",
    "community partner hackathons",
    ...communityPartnerEvents.map((ev) => ev.name),
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/events",
  },
  openGraph: {
    title: `${TITLE} | bits&bytes™`,
    description: DESCRIPTION,
    url: "https://gobitsnbytes.org/events",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ events: hackathons across India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | bits&bytes™`,
    description: DESCRIPTION,
  },
};

// Events structured data for Google rich results
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/events#webpage",
      url: "https://gobitsnbytes.org/events",
      name: `${TITLE} | bits&bytes™`,
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gobitsnbytes.org" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://gobitsnbytes.org/events" },
        ],
      },
    },
    {
      "@type": "Event",
      "@id": "https://gobitsnbytes.org/events#hack4good-v0",
      name: "Hack4Good v0",
      description:
        "Lucknow's first Agentic AI hackathon. 24-hour coding event with 425+ registrations, 110 on-ground attendees, and a ₹35,000 prize pool.",
      startDate: "2026-05-02",
      endDate: "2026-05-03",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Lucknow, Uttar Pradesh",
        address: { "@type": "PostalAddress", addressLocality: "Lucknow", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
      },
      organizer: { "@id": "https://gobitsnbytes.org/#organization" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/SoldOut" },
    },
    {
      "@type": "Event",
      "@id": "https://gobitsnbytes.org/events#execron-1-0",
      name: "Execron 1.0",
      description: "AI Hackathon & Workshop for teens co-hosted at IIT Kanpur during TechKriti '26.",
      startDate: "2026-03-19",
      endDate: "2026-03-22",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "IIT Kanpur",
        address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
      },
      organizer: { "@id": "https://gobitsnbytes.org/#organization" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/SoldOut" },
    },
    {
      "@type": "Event",
      "@id": "https://gobitsnbytes.org/events#github-copilot-dev-days",
      name: "GitHub Copilot Dev Days | Lucknow",
      description: "Community developer event in Lucknow focused on AI-assisted coding with GitHub Copilot. Hosted by bits&bytes™.",
      startDate: "2026-04-19",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Lucknow, Uttar Pradesh",
        address: { "@type": "PostalAddress", addressLocality: "Lucknow", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
      },
      organizer: { "@id": "https://gobitsnbytes.org/#organization" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/SoldOut" },
    },
    {
      "@type": "Event",
      "@id": "https://gobitsnbytes.org/events#india-innovates-2026",
      name: "India Innovates 2026",
      description:
        "World's Largest Civic Tech Hackathon. bits&bytes™ served as the Official Executive Partner. ₹10 Lakh+ prize pool across Applied AI, Robotics & Drones, and Civic Tech & Defence domains.",
      startDate: "2026-03-28",
      endDate: "2026-03-28",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      url: "https://indiainnovates.org",
      location: {
        "@type": "Place",
        name: "Bharat Mandapam",
        address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
      },
      organizer: { "@type": "Organization", name: "HN Group & MCD" },
    },
    // Other teams' events, with bits&bytes™ as community partner (contributor, not organiser).
    ...communityPartnerEvents.map((ev) => ({
      "@type": "Event",
      "@id": `https://gobitsnbytes.org/events#${ev.id}`,
      name: ev.name,
      description: ev.description,
      startDate: ev.startDate,
      ...(ev.endDate ? { endDate: ev.endDate } : {}),
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "VirtualLocation", url: ev.url },
      url: ev.url,
      organizer: { "@type": "Organization", name: ev.host },
      contributor: { "@id": "https://gobitsnbytes.org/#organization" },
    })),
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
