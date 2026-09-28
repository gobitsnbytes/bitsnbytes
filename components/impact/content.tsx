import Link from "next/link";
import type { ReactNode } from "react";

import { regionalSeriesEvent } from "@/lib/events-data";
import { FORK_CITIES } from "@/lib/forks";

// /impact copy from the previous page (highlightStats, culturePillars) plus the published track record
// (AGENTS.md §5 / public/llms.txt). No aggregate numbers: per-event facts live in their own entry.
// Photos are the real event sets the /events page already attributes to each item.

export const IMPACT_TITLE = "Beyond the venue walls";

export const IMPACT_LEDE =
  "We run hackathons for first-timers and squads inside local schools. Whatever gets built there ships in public, in cities across India.";

export const CHAPTERS = [
  { id: "impact-record", title: "Impact Record" },
  { id: "track-record", title: "Track Record" },
  { id: "shipped-outcomes", title: "Forks and venues" },
  { id: "culture", title: "Culture & Core Principles" },
  { id: "explore", title: "Explore the bits&bytes™ Network" },
] as const;

export type HighlightStat = { value: string; label: string; description: ReactNode; timeframe: string };

export const highlightStats: HighlightStat[] = [
  {
    value: "Community",
    label: "Pan-India",
    description: "Teenage builders in cities across India, with no single home base.",
    timeframe: "Community",
  },
  {
    value: "Forks",
    label: "Local Hubs",
    description: (
      <>
        Local chapters in {FORK_CITIES}. Each takes the playbook from upstream and runs its own room.{" "}
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
    description: "Hackathons with the workshops built in, plus community meetups.",
    timeframe: "Track Record",
  },
  {
    value: "Teen-led",
    label: "Our team",
    description: "Teenagers write the code and run the events, start to finish.",
    timeframe: "Team",
  },
];

export const culturePillars = [
  {
    title: "Ship or dip",
    copy: "Pitching an idea is easy. We'd rather see a rough prototype running by the end of the hackathon than a perfect deck next month.",
  },
  {
    title: "Your squad keeps you honest",
    copy: "Mentors and teammates are the peer pressure that gets things finished. It's hard to ghost a project when your team is waiting on your code.",
  },
  {
    title: "Built for users, not grades",
    copy: "School operations, civic tech, accessibility tools. We want what we ship to get used by someone, and a rubric score doesn't count.",
  },
];

const ev = (file: string) => `/event_pictures/${file}`;

export type TrackItem = { name: string; line: string; photos: string[] };

export const trackRecord: TrackItem[] = [
  {
    name: "India Innovates 2026",
    line: "We were Official Executive Partner for the world's largest civic tech hackathon, with 1.26 crore+ applicants.",
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
    line: "Our 24-hour agentic AI hackathon in Lucknow (now archived): 425 registrations, 110 on the ground, a ₹35,000 prize pool.",
    photos: [ev("h4g/h4g1.jpg"), ev("h4g/h4g0.jpg"), ev("h4g/h4g3.jpg"), ev("h4g/h4g2.jpeg"), ev("h4g/h4g.jpg")],
  },
  {
    name: "Execron 1.0",
    line: "We co-hosted an AI hackathon and workshop at IIT Kanpur for students in Classes 9–12.",
    photos: [1, 2, 3, 4, 5].map((n) => ev(`byteforge${n}.webp`)),
  },
  {
    name: "GitHub Copilot Dev Days",
    line: "We hosted an in-person community event in Lucknow on coding with AI assistants.",
    photos: [ev("devday.jpeg"), ev("devday2.jpeg"), ev("devday3.jpeg"), ev("devday4.jpeg")],
  },
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
    lines: ["Hack4Good v0", "GitHub Copilot Dev Days"],
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
  { label: "Forks", href: "/fork" },
  { label: "Press Kit", href: "/press" },
];

/** "26.8467° N, 80.9462° E" (structural coordinate label). */
export const coords = ([lat, lng]: LatLng) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
