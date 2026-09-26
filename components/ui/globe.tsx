"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";

import { cn } from "@/lib/utils";

export type LatLng = [number, number];
type RGB = [number, number, number];

export type GlobeProps = {
  markers: Marker[];
  /** Drawn from → to (burgundy → orange) the first time the globe is on screen. */
  arcs?: { from: LatLng; to: LatLng }[];
  /** Point the globe turns to face (eased; snapped when animate is false). */
  focus: LatLng;
  /** false: no draw-in or easing, rendered straight in its final state (reduced motion / toggle off). */
  animate?: boolean;
  /** Accessible description of the picture. */
  label: string;
  className?: string;
};

const rgb = (hex: number): RGB => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const BURGUNDY = rgb(0x97192c);
const ORANGE = rgb(0xfc920d);
// Frame colour (burgundy depth #3c0a12): the halo is painted in it, so no glow shows.
const PLUM = rgb(0x3c0a12);
const DRAW_SECONDS = 1.4;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Wrap an angle to [-π, π] so the globe always turns the short way round. */
const wrap = (a: number) => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));
/** cobe camera angles that put a lat/long in the middle of the disc. */
const toAngles = ([lat, lng]: LatLng): [number, number] => [
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
];

/**
 * cobe v2 globe in print colours for a #3c0a12 frame: ink sphere, cream land dots, orange markers, arcs drawn out from their
 * origin while shifting burgundy → orange. cobe v2 has no render loop of its own, so this owns one and
 * only runs it while something moves (draw-in, easing to a new focus, dragging) and the globe is on
 * screen. The WebGL context is created the first time it scrolls near the viewport.
 */
export function Globe({ markers, arcs = [], focus, animate = true, label, className }: GlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const target = useRef(toAngles(focus));
  const refocus = useRef<() => void>(() => {});

  useEffect(() => {
    target.current = toAngles(focus);
    refocus.current();
  }, [focus]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Imperative canvas: cobe wraps it in its own div, so React never has to reconcile that subtree.
    const canvas = document.createElement("canvas");
    canvas.className = "block size-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-700";
    host.append(canvas);

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf = 0;
    let last = 0;
    let visible = false;
    let [phi, theta] = target.current;
    let drawn = animate ? 0 : 1;
    let dragFrom: number | null = null;
    let dragBase = 0;
    let dragPhi = 0;

    const arcsAt = (t: number): Arc[] => {
      const p = Math.max(0.02, easeOut(t));
      return arcs.map(({ from, to }) => ({
        from,
        to: [lerp(from[0], to[0], p), lerp(from[1], to[1], p)],
        color: BURGUNDY.map((c, i) => lerp(c, ORANGE[i], p)) as RGB,
      }));
    };

    const frame = (now: number) => {
      raf = 0;
      if (!globe) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      const k = animate ? 1 - Math.exp(-dt * 5) : 1;
      const dPhi = wrap(target.current[0] + dragPhi - phi);
      const dTheta = target.current[1] - theta;
      phi += dPhi * k;
      theta += dTheta * k;
      if (animate && drawn < 1) drawn = Math.min(1, drawn + dt / DRAW_SECONDS);
      globe.update({ phi, theta, arcs: arcsAt(drawn) });

      const moving = dragFrom !== null || Math.abs(dPhi) > 1e-4 || Math.abs(dTheta) > 1e-4 || drawn < 1;
      if (animate && visible && moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    refocus.current = () => {
      dragPhi = 0;
      kick();
    };

    const create = () => {
      const size = host.clientWidth;
      if (globe || !size) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: size,
        height: size,
        phi,
        theta,
        dark: 1,
        diffuse: 1.4,
        scale: 1.2,
        mapSamples: 16000,
        mapBrightness: 5,
        mapBaseBrightness: 0,
        // dark mode: ocean = base × .1 (≈ ink), lit dots ≈ base × 5 (≈ cream #fee9cf)
        baseColor: [0.2, 0.18, 0.16],
        markerColor: ORANGE,
        glowColor: PLUM,
        markers,
        arcs: arcsAt(drawn),
        arcColor: ORANGE,
        arcWidth: 1.2,
        arcHeight: 0.05,
        markerElevation: 0.01,
      });
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) return;
        create();
        kick();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      const size = host.clientWidth;
      if (globe && size) globe.update({ width: size, height: size });
    });
    ro.observe(host);

    // Horizontal drag spins the globe; vertical movement stays page scroll (touch-action: pan-y).
    const down = (event: PointerEvent) => {
      dragFrom = event.clientX;
      dragBase = dragPhi;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      kick();
    };
    const move = (event: PointerEvent) => {
      if (dragFrom === null) return;
      dragPhi = dragBase + (event.clientX - dragFrom) / 200;
      kick();
    };
    const up = () => {
      dragFrom = null;
      canvas.style.cursor = "";
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      globe?.destroy();
      refocus.current = () => {};
      host.replaceChildren();
    };
  }, [markers, arcs, animate]);

  return <div ref={hostRef} role="img" aria-label={label} className={cn("relative aspect-square w-full", className)} />;
}

export default Globe;
