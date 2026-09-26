import Script from "next/script";

import { Breadcrumbs } from "@/components/breadcrumb";
import { EditionOpener, EDITION_GUTTER } from "@/components/edition";
import { EventArchive } from "@/components/events/archive";
import { EventGallery } from "@/components/events/gallery";
import { RegionalSeries } from "@/components/events/regional-series";
import { Tag, TornEdge } from "@/components/riot";
import { regionalSeriesEvent } from "@/lib/events-data";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: regionalSeriesEvent.id, title: regionalSeriesEvent.title },
  { id: "archive", title: "The event archive" },
  { id: "in-pictures", title: "In Pictures" },
];

const HIGHLIGHTS = ["High Agency Shipping", "IIT Kanpur & Delhi Summits", "National Scale Partners"];

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
        "World's Largest Civic Tech Hackathon finale at Bharat Mandapam, New Delhi with bits&bytes™ as Executive Partner.",
      startDate: "2026-03-28T09:00:00+05:30",
      endDate: "2026-03-28T19:00:00+05:30",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Bharat Mandapam",
        address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" },
      },
      organizer: { "@type": "Organization", name: "bits&bytes™", url: "https://gobitsnbytes.org" },
    },
    {
      "@type": "Event",
      name: "Execron 1.0 at IIT Kanpur",
      description: "AI Hackathon & Workshop for Class 9-12 students in collaboration with TechKriti '26 IIT Kanpur.",
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

export default function EventsPage() {
  return (
    <>
      <EditionOpener
        title="Where code meets the real world"
        kicker="Event Log · GOBITSNBYTES FOUNDATION"
        chapters={CHAPTERS}
        art={{ src: regionalSeriesEvent.posterSrc, alt: `${regionalSeriesEvent.title} trailer poster` }}
      />

      <div data-surface="ink" data-tour="page-hero" className="tone-ink relative overflow-x-clip pb-8 pt-20 md:pt-28">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <Breadcrumbs items={[{ name: "Events", href: "/events" }]} className="mb-10" />
          <p
            data-speakable="true"
            data-citation="true"
            className="max-w-[26ch] font-serif text-[clamp(30px,4.4vw,68px)] italic leading-[1.05] tracking-[-0.02em] text-cream first-letter:pr-[0.04em] first-letter:font-script first-letter:text-[1.6em] first-letter:font-normal first-letter:not-italic first-letter:leading-[0] first-letter:text-orange"
          >
            Hackathons, summits, and workshops where teen builders actually ship things across India.
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight}>
                <Tag tone="ink">{highlight}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <RegionalSeries />
      <TornEdge from="ink" to="paper" />
      <EventArchive />
      <TornEdge from="paper" to="ink" flip />
      <EventGallery />

      <Script id="luma-checkout" src="https://embed.lu.ma/checkout-button.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
