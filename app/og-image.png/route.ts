// Page metadata, JSON-LD and old shares point at /og-image.png: serve the home card there, built once at build time.
import { ogCard } from "@/lib/og/card";

export const dynamic = "force-static";

export function GET() {
  return ogCard({ pose: "wave" });
}
