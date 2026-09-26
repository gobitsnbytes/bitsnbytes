import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "bits&bytes™: a teen-led builder network across India";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "wave" });
}
