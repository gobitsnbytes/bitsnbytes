/** public/logo.svg geometry (viewBox 28 54 146 146): the hexagon silhouette and its four cut-outs. */
export const LOGO_VIEWBOX = "28 54 146 146";

export const LOGO_HEX =
  "m 101.27586,64.293104 56.89655,32.810343 V 161.5862 L 101.46552,194.01724 44.568964,161.5862 44.75862,96.534482 Z";

/** Assembly order: left B, right B, top chevron, star. `from` is the misregistered offset each piece snaps back from. */
export const LOGO_PIECES = [
  {
    from: { x: -5, y: 3 },
    d: "m 49.025862,107.06034 v 51.58621 l 46.086207,25.69828 v -20.29311 l -7.681037,-4.36207 0.189656,11 L 56.61207,154 56.51724,142.52586 87.620688,159.68965 87.431032,149.5431 56.61207,133.0431 v -12.51724 l 31.008618,16.87931 -0.189656,12.42241 7.586208,4.07759 0.09483,-21.81034 z",
  },
  {
    from: { x: 5, y: 3 },
    d: "m 104.78448,133.61207 45.61207,-25.41379 0.47414,21.05172 -8.06035,4.26724 v -11.56897 l -30.62931,16.87931 v 11.75863 L 143,133.23276 l -0.0948,10.05172 -30.81896,16.78448 c 0,0 0.18965,13.18104 -0.0948,13.18104 -0.28449,0 -0.28449,0 -0.28449,0 l 30.9138,-17.06897 v -12.70689 l 7.68103,-4.26725 0.18966,19.9138 -45.61207,26.83621 z",
  },
  {
    from: { x: 0, y: -5 },
    d: "m 136.38627,98.970564 c 6.97353,-4.023193 6.97353,-4.023193 6.97353,-4.023193 L 101.38448,70.405889 61.823075,93.606307 69.869465,98.03182 101.65269,80.195662 Z",
  },
  {
    from: { x: 0, y: -4 },
    d: "m 104.33482,95.617905 6.30301,2.145702 -6.1689,2.950343 -2.54802,5.76658 -2.548026,-5.76658 -6.571215,-2.950343 6.437109,-2.548023 2.413912,-5.498364 z",
  },
] as const;

/** Real files under public/ and real routes under app/, cycled by the loading ticker. */
export const TICKER_PATHS = [
  "/logo.svg",
  "/events",
  "/movie/regional-series-trailer.mp4",
  "/event_pictures/h4g/h4g2.jpeg",
  "/about",
  "/movie/bnb-trailer-poster.jpg",
  "/images/hero-img.jpeg",
  "/impact",
  "/event_pictures/byteforge1.webp",
  "/llms.txt",
  "/join",
  "/event_pictures/h4g/h4g_hackers.jpg",
  "/movie/regional-series-trailer-poster.jpg",
  "/cloud",
  "/images/lko-build-guild.jpg",
  "/event_pictures/devday.jpeg",
  "/contact",
  "/event_pictures/india-innovates-2026-stage-address.mp4",
  "/partners/github.jpg",
  "/faq",
  "/images/copilot-dev-day.png",
  "/event_pictures/h4g/h4gbanner.jpg",
  "/press",
  "/movie/bnb-trailer.mp4",
  "/sparkcloud-poster.jpg",
  "/prospectus",
  "/event_pictures/bd1.jpg",
  "/globe.json",
  "/fork",
  "/movie/mc-server-bg.mp4",
  "/manifest.webmanifest",
  "/minecraft",
] as const;
