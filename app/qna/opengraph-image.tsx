import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Ask bits&bytes™ anything";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "headset", kicker: "Q&A · gobitsnbytes.org/qna", title: "Ask us anything" });
}
