import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "The bits&bytes™ Minecraft survival server";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ pose: "idle", kicker: "Minecraft · gobitsnbytes.org/minecraft", title: "Survival, run by students." });
}
