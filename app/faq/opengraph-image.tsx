import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "bits&bytes™ FAQ";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "thinking", kicker: "FAQ · gobitsnbytes.org/faq", title: "Questions, answered straight" });
}
