import Script from "next/script";

import { EventArchive } from "@/components/events/archive";
import { ContactWindow } from "@/components/events/contact-window";
import { EventGallery } from "@/components/events/gallery";
import { EventsReel } from "@/components/events/reel";
import { RegionalSeries } from "@/components/events/regional-series";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      name: "Hack4Good v0",
      description: "24-hour Agentic AI hackathon in Lucknow hosted by bits&bytes™. Architect Your Autonomy.",
      startDate: "2026-04-02",
      endDate: "2026-05-03",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Cubispace Lucknow",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lucknow",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
      },
      organizer: { "@type": "Organization", name: "bits&bytes™", url: "https://gobitsnbytes.org" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" },
    },
    {
      "@type": "Event",
      name: "India Innovates 2026",
      description:
        "The finale of a hackathon billed as the world's largest civic tech hackathon, at Bharat Mandapam, New Delhi, with bits&bytes™ as official executive partner.",
      startDate: "2026-03-28T09:00:00+05:30",
      endDate: "2026-03-28T19:00:00+05:30",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Bharat Mandapam",
        address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
      },
      organizer: { "@type": "Organization", name: "HN Group & MCD" },
    },
    {
      "@type": "Event",
      name: "Execron 1.0 at IIT Kanpur",
      description: "An AI hackathon and workshop for students in classes 9–12, run with TechKriti '26 at IIT Kanpur.",
      startDate: "2026-03-19",
      endDate: "2026-03-22",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "IIT Kanpur",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kanpur",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
      },
      organizer: { "@type": "Organization", name: "bits&bytes™", url: "https://gobitsnbytes.org" },
    },
  ],
};

/**
 * /events: inkfishnyc.com 1:1 in the bits&bytes™ brand (DESIGN.md reference allocation): playlist-reel
 * hero (click the reel = fullscreen player), [S.01] series statement, [S.02] events index (list),
 * [S.03] photo masonry, [S.04] contact window. No EditionOpener: inkfish pages bring their own hero.
 */
export default function EventsPage() {
  return (
    <>
      <EventsReel />
      <RegionalSeries />
      <EventArchive />
      <EventGallery />
      <ContactWindow />

      <Script id="luma-checkout" src="https://embed.lu.ma/checkout-button.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
