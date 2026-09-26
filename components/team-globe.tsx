"use client";

import type { Marker } from "cobe";

import { LUCKNOW, places, type LatLng } from "@/components/impact/content";
import { Globe } from "@/components/ui/globe";

const MARKERS: Marker[] = [
  { location: LUCKNOW, size: 0.1 }, // Lucknow (Core Hub)
  { location: [25.4358, 81.8463], size: 0.08 }, // Prayagraj
  { location: [12.9716, 77.5946], size: 0.08 }, // Bangalore
  { location: [28.6139, 77.209], size: 0.08 }, // Delhi
  { location: [22.5726, 88.3639], size: 0.08 }, // Kolkata
  { location: [26.2345, 81.2329], size: 0.06 }, // Raebareli
  { location: [21.1702, 72.8311], size: 0.06 }, // Surat
  { location: [30.901, 75.8573], size: 0.06 }, // Ludhiana
  { location: [13.0827, 80.2707], size: 0.06 }, // Chennai
  { location: [19.076, 72.8777], size: 0.08 }, // Mumbai
  { location: [26.9124, 75.7873], size: 0.06 }, // Jaipur
  { location: [17.385, 78.4867], size: 0.06 }, // Hyderabad
  ...places.slice(2).map((place) => ({ location: place.at, size: 0.06 })), // IIT Kanpur, IIT Bombay
];

// Arcs only between places already in the site copy: Lucknow → New Delhi, IIT Kanpur, IIT Bombay.
const ARCS = places.slice(1).map((place) => ({ from: LUCKNOW, to: place.at }));

const LABEL = `Globe: arcs from Lucknow to ${places
  .slice(1)
  .map((place) => place.place)
  .join(", ")}`;

export default function TeamGlobe({ focus = LUCKNOW, animate = true }: { focus?: LatLng; animate?: boolean }) {
  return <Globe markers={MARKERS} arcs={ARCS} focus={focus} animate={animate} label={LABEL} />;
}
