import Link from "next/link";
import type { ReactNode } from "react";

import { regionalSeriesEvent } from "@/lib/events-data";
import { FORK_CITIES } from "@/lib/forks";

// /impact copy from the previous page (highlightStats, culturePillars) plus the published track record
// (AGENTS.md §5 / public/llms.txt). No aggregate numbers: per-event facts live in their own entry.
// Photos are the real event sets the /events page already attributes to each item.

export const IMPACT_TITLE = "Beyond the venue walls";

export const IMPACT_LEDE =
  "From first-time hackathons to squads inside local schools, we build experiences that get teens building, and we ship the results publicly across India.";

export const CHAPTERS = [
  { id: "impact-record", title: "Impact Record" },
  { id: "track-record", title: "Track Record" },
  { id: "shipped-outcomes", title: "Teen-led squads, shipped outcomes" },
  { id: "culture", title: "Culture & Core Principles" },
  { id: "explore", title: "Explore the bits&bytes™ Network" },
] as const;

export type HighlightStat = { value: string; label: string; description: ReactNode; timeframe: string };

export const highlightStats: HighlightStat[] = [
  {
    value: "Community",
    label: "Pan-India",
    description: "Teen builders active across India",
    timeframe: "Community",
  },
  {
    value: "Forks",
    label: "Local Hubs",
    description: (
      <>
        City chapters under upstream governance in {FORK_CITIES}.{" "}
        <Link
          href="/fork"
          className="font-bold text-signal underline decoration-2 underline-offset-4 hover:decoration-orange"
        >
          gobitsnbytes.org/fork
        </Link>
      </>
    ),
    timeframe: "Distribution",
  },
  {
    value: "Events",
    label: "Events across India",
    description: "Hackathons, hardware meetups, and developer workshops",
    timeframe: "Track Record",
  },
  {
    value: "Teen-led",
    label: "Our team",
    description: "100% youth-led engineering and operations team",
    timeframe: "Team",
  },
];

export const culturePillars = [
  {
    title: "Ship or dip",
    copy: "Talking about your idea is easy. We'd rather have a working prototype by Sunday than a perfect slide deck by next month.",
  },
  {
    title: "Your squad keeps you honest",
    copy: "Mentors, pods, and the kind of peer pressure that makes you actually finish things. Nobody ghosts a project when their team is waiting on their code.",
  },
  {
    title: "Built for users, not grades",
    copy: "School operations, civic tech, accessibility tools. The things we ship get used by real people, not just submitted for a rubric.",
  },
];

const ev = (file: string) => `/event_pictures/${file}`;

export type TrackItem = { name: string; line: string; photos: string[] };

export const trackRecord: TrackItem[] = [
  {
    name: "India Innovates 2026",
    line: "Official Executive Partner for the World's Largest Civic Tech Hackathon with 1.26 crore+ applicants.",
    photos: [
      ev("HEe93oOakAAi2Mi.jpg"),
      ev("HEe923ub0AE-92F.jpg"),
      ev("866d62697f3d42819e2007714047a3a80001af45.jpg"),
      ev("3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg"),
      ev("1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg"),
      ev("HEe923uagAATqvy.jpg"),
    ],
  },
  {
    name: "Hack4Good v0",
    line: "Archived 24-hour Agentic AI hackathon in Lucknow with 425 registrations, 110 on-ground attendees, and a ₹35,000 prize pool.",
    photos: [ev("h4g/h4g1.jpg"), ev("h4g/h4g0.jpg"), ev("h4g/h4g3.jpg"), ev("h4g/h4g2.jpeg"), ev("h4g/h4g.jpg")],
  },
  {
    name: "Execron 1.0",
    line: "Co-hosted AI Hackathon & Workshop at IIT Kanpur for students in Classes 9–12.",
    photos: [1, 2, 3, 4, 5].map((n) => ev(`byteforge${n}.webp`)),
  },
  {
    name: "GitHub Copilot Dev Days",
    line: "Hosted community developer event focused on AI-assisted coding in Lucknow.",
    photos: [ev("devday.jpeg"), ev("devday2.jpeg"), ev("devday3.jpeg"), ev("devday4.jpeg")],
  },
  {
    name: "Lucknow Build Guild",
    line: "Free hardware workshop and meetup for local tech people.",
    photos: [1, 2, 3, 4, 5].map((n) => ev(`bd${n}.jpg`)),
  },
  { name: "Regional Space Apps Hackathon", line: "300+ participants.", photos: [] },
];

export type LatLng = [number, number];

/** Geographic centre of India: the globe's resting focus (we are pan-India, no home city). */
export const INDIA: LatLng = [20.5937, 78.9629];

/** Globe stops: the places our events ran. Copy from existing site content only. */
export const places: {
  id: string;
  place: string;
  at: LatLng;
  title: string;
  lines: string[];
  href?: string;
}[] = [
  {
    id: "lucknow",
    place: "Lucknow",
    at: [26.8467, 80.9462],
    title: "Lucknow",
    lines: ["Hack4Good v0", "GitHub Copilot Dev Days", "Lucknow Build Guild"],
  },
  {
    id: "new-delhi",
    place: "New Delhi",
    at: [28.6139, 77.209],
    title: "India Innovates 2026",
    lines: ["28 Mar 2026 · New Delhi", trackRecord[0].line],
  },
  {
    id: "iit-kanpur",
    place: "IIT Kanpur",
    at: [26.5123, 80.2329],
    title: "Execron 1.0",
    lines: [trackRecord[2].line],
  },
  {
    id: "iit-bombay",
    place: regionalSeriesEvent.finaleVenueLabel,
    at: [19.1334, 72.9133],
    title: regionalSeriesEvent.title,
    lines: [
      `${regionalSeriesEvent.statusLabel} · ${regionalSeriesEvent.finaleDateLabel}`,
      regionalSeriesEvent.trailerLines[2],
    ],
    href: regionalSeriesEvent.href,
  },
];

export const exploreLinks = [
  { label: "Events", href: "/events" },
  { label: "Local Hubs", href: "/fork" },
  { label: "Press Kit", href: "/press" },
];

/** "26.8467° N, 80.9462° E" (structural coordinate label). */
export const coords = ([lat, lng]: LatLng) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
