import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Contact bits&bytes™";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "headset", kicker: "Contact · gobitsnbytes.org/contact", title: "Let's build something together" });
}
