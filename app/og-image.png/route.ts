// Page metadata and JSON-LD point their share image at /og-image.png: serve the generated card there.
import OgImage from "../opengraph-image";

export const runtime = "edge";

export function GET() {
  return OgImage();
}
