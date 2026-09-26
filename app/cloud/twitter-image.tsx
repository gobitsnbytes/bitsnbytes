import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "SparkCloud × bits&bytes™: free cloud credits for teen builders";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "typing", kicker: "Cloud · gobitsnbytes.org/cloud", title: "Free cloud credits for teen builders" });
}
