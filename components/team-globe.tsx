"use client";

import type { Marker } from "cobe";

import { INDIA, places, type LatLng } from "@/components/impact/content";
import { Globe } from "@/components/ui/globe";
import { FORKS } from "@/lib/forks";

// The active forks (pan-India, no hub), then the event venues that are not fork cities.
const MARKERS: Marker[] = [
  ...FORKS.map((fork) => ({ location: fork.at, size: 0.08 })),
  ...places.slice(2).map((place) => ({ location: place.at, size: 0.06 })), // IIT Kanpur, IIT Bombay
];

const LABEL = `Globe: bits&bytes™ forks in ${FORKS.map((fork) => fork.city).join(", ")}`;

export default function TeamGlobe({ focus = INDIA, animate = true }: { focus?: LatLng; animate?: boolean }) {
  return <Globe markers={MARKERS} focus={focus} animate={animate} label={LABEL} />;
}
