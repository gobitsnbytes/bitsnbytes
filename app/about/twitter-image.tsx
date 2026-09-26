import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "About bits&bytes™: why we started and who runs it";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "idle", kicker: "About · gobitsnbytes.org/about", title: "Started after a cancelled hackathon" });
}
