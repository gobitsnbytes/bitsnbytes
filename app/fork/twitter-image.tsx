import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Start a bits&bytes™ fork in your city";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "fork", kicker: "Forks · gobitsnbytes.org/fork", title: "No tech scene in your city? Fork one." });
}
