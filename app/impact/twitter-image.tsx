import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "bits&bytes™ impact: events and forks across India";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "point-down", kicker: "Impact · gobitsnbytes.org/impact", title: "Beyond the venue walls" });
}
