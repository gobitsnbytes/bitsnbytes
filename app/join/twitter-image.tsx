import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Join bits&bytes™, a free teen builder network";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "door", kicker: "Join · gobitsnbytes.org/join", title: "Join the crew" });
}
