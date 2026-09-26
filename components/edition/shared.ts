/**
 * Left padding that keeps edition content clear of the fixed chapter index at ≥1280px
 * (index: left 24px + 220px wide + 24px gap). Add it to any content column on an edition page.
 */
export const EDITION_GUTTER = "xl:pl-[268px]";

export const pad = (n: number) => String(n).padStart(2, "0");

export type SurfaceTone = "paper" | "ink" | "orange" | "cream";

/**
 * Calls `run` once the loader has exited (html[data-loaded="true"] or the "bnb:ready" event),
 * or after 1200ms as a safety net. Returns a disposer.
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
  const timer = window.setTimeout(fire, 1200);
  window.addEventListener("bnb:ready", fire, { once: true });
  return () => {
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener("bnb:ready", fire);
  };
}
