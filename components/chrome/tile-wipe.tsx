"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

const COLS = 8;
const ROWS = 5;
const STEP_MS = 30;
const FILLS = ["bg-burgundy", "bg-orange", "bg-ink"] as const;
/** Routes that pin their own full-viewport stage keep their opt-out. */
const OPT_OUT = new Set(["/fork", "/minecraft"]);

// Module state (client only): the first template mount is the initial page load, which the loader owns.
let firstPath: string | null = null;
let navigated = false;
let keyboardNav = false;

if (typeof window !== "undefined") {
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter" || event.key === " ") keyboardNav = true;
    },
    true,
  );
  window.addEventListener("pointerdown", () => (keyboardNav = false), true);
}

/**
 * Should this template mount play the wipe? Call from a useState initializer (stable across the
 * StrictMode double call). Skips SSR, the first load, keyboard-initiated navigation, reduced
 * motion, the motion toggle and the opt-out routes.
 */
export function shouldWipe(pathname: string | null) {
  if (typeof window === "undefined" || !pathname) return false;
  if (firstPath === null) {
    firstPath = pathname;
    return false;
  }
  if (pathname !== firstPath) navigated = true;
  return (
    navigated &&
    !keyboardNav &&
    !OPT_OUT.has(pathname) &&
    document.documentElement.dataset.immersiveMotion !== "off" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveal-only route wipe (buttermax tiles + inkfish mountain): an 8x5 grid covering the fresh page
 * retracts upward, bottom-centre first (30ms steps, 380ms per tile, ~610ms total). A fixed sibling
 * of the page, never a wrapper, so the page keeps no transform. Pointer-transparent throughout.
 */
export function TileWipe({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 650);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[900] grid grid-cols-8 grid-rows-5 motion-reduce:hidden motion-off:hidden"
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const fill = (row + col) % 3;
        return (
          <span
            key={i}
            className={cn("bnb-tile", FILLS[fill], fill === 1 && col % 2 === 0 && "halftone")}
            style={{ animationDelay: `${(ROWS - 1 - row + Math.abs(col - (COLS - 1) / 2)) * STEP_MS}ms` }}
          />
        );
      })}
    </div>
  );
}
