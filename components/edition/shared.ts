/**
 * Left padding that keeps edition content clear of the fixed chapter index at ≥1280px
 * (index: left 24px + 220px wide + 24px gap). Add it to any content column on an edition page.
 */
export const EDITION_GUTTER = "xl:pl-[268px]";

export const pad = (n: number) => String(n).padStart(2, "0");

export type SurfaceTone = "paper" | "ink" | "orange" | "cream";

// Advance widths (1/100 em) of uppercase Archivo 900 at font-stretch 125% with -0.03em tracking, measured in
// the browser; word sums land within ~2% of the real (kerned) width. Anything else counts as 95.
const ADVANCE: Record<string, number> = {
  A: 92, B: 90, C: 91, D: 90, E: 83, F: 78, G: 98, H: 98, I: 37, J: 73, K: 96, L: 76, M: 115,
  N: 98, O: 98, P: 84, Q: 98, R: 91, S: 85, T: 85, U: 96, V: 91, W: 120, X: 93, Y: 94, Z: 85,
  "0": 78, "1": 70, "2": 78, "3": 78, "4": 79, "5": 78, "6": 79, "7": 72, "8": 80, "9": 79,
  "&": 104, "™": 109, "'": 29, "’": 29, "×": 72, "-": 39, ".": 35, ",": 35, "?": 71, "!": 36, ":": 34,
};

/**
 * CSS font-size that keeps the widest word of an uppercase wide-Archivo title (tracking -0.03em) on one
 * line inside its nearest @container (cqi = that container's content width), capped at `max`. Titles then
 * wrap between words only, never mid-word. 4% slack for rendering differences.
 */
export function fitTitle(title: string, max: string) {
  const widest = Math.max(
    1,
    ...title
      .toUpperCase()
      .split(/\s+/)
      .map((word) => [...word].reduce((sum, ch) => sum + (ADVANCE[ch] ?? 95), 0) / 100),
  );
  return `min(${max}, ${(100 / (widest * 1.04)).toFixed(2)}cqi)`;
}

/** The first-visit intro (components/chrome/loader.tsx, ≤3.5s) is still covering the page. */
export function introCovering() {
  const { loader, loaded } = document.documentElement.dataset;
  return loader === "on" && loaded !== "true";
}

/**
 * Calls `run` once the loader has exited (html[data-loaded="true"] or the "bnb:ready" event).
 * Safety net: 3800ms while the intro covers the page (its hard cap is 3.5s), else 1200ms.
 * Returns a disposer.
 */
export function whenReady(run: () => void) {
  if (document.documentElement.dataset.loaded === "true") {
    run();
    return () => {};
  }
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener("bnb:ready", fire);
    run();
  };
  const timer = window.setTimeout(fire, introCovering() ? 3800 : 1200);
  window.addEventListener("bnb:ready", fire, { once: true });
  return () => {
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener("bnb:ready", fire);
  };
}
