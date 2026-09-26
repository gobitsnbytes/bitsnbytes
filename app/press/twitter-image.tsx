import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "bits&bytes™ press kit and brand assets";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "megaphone", kicker: "Press · gobitsnbytes.org/press", title: "Press kit and brand assets" });
}
