"use client";

/**
 * FigWindow — stripe.dev's "Fig. N" generative art window.
 *
 * Anatomy: <figure> ink frame (4px sides + bottom) → 20px bar: "[ Fig. N ]" + draglines (fade to
 * .4 on hover/focus) + blinking "10x" badge while held → art area (default aspect 302/252) holding
 * one canvas that draws the seeded print from art.ts. Colours flip with the tone (bg-fg frame).
 *
 * Motion: canvas fades in (500ms) on first paint; 25fps while in view and the tab is visible
 * (IntersectionObserver + visibilitychange), dpr ≤ 1.75. Press-and-hold (pointer, or Space/Enter
 * on the focused art) runs time 10× faster. The whole window drags (framer-motion: x only on fine
 * pointers, free on touch) and springs home (dragSnapToOrigin, bounceStiffness 600 / damping 30).
 * Reduced motion / motion toggle off: one static frame (redrawn when params change), no drag/hold.
 *
 * LabGlobe — stripe.dev's spinning wireframe globe badge (4 meridian half-ellipses, 10s turn,
 * ≤30fps, same gating). Stroke = currentColor. Decorative.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion as m } from "framer-motion";
import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { LabStyles } from "./grid";
import { artConfig, drawArt, type ArtOverrides, type ArtPreset } from "./art";

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void;

/**
 * Canvas loop: sizes the backing store (dpr ≤ 1.75), paints once on every resize, and runs `draw`
 * at ≤ `fps` only while `animate` && in view && tab visible. Returns a ref to a one-shot repaint.
 */
export function useCanvasLoop(canvasRef: RefObject<HTMLCanvasElement | null>, draw: Draw, animate: boolean, fps = 25) {
  const drawRef = useRef(draw);
  const repaint = useRef(() => {});
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let inView = false;

    const paint = (dt: number) => {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current(ctx, w, h, dt);
      canvas.dataset.ready = "";
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (last && now - last < 1000 / fps - 2) return;
      paint(last ? Math.min(0.1, (now - last) / 1000) : 0);
      last = now;
    };
    const sync = () => {
      const run = animate && inView && document.visibilityState === "visible";
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(1.75, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      paint(0);
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    ro.observe(canvas);
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    repaint.current = () => paint(0);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      repaint.current = () => {};
    };
  }, [canvasRef, animate, fps]);

  return repaint;
}

export type FigWindowProps = {
  /** Deterministic seed (e.g. the item's title or slug). */
  seed: string;
  /** Figure number shown in the bar: "[ Fig. N ]". */
  fig: number;
  /** Art preset; omitted = picked by the seed. */
  preset?: ArtPreset;
  className?: string;
  /** CSS aspect-ratio of the art area (default "302 / 252", stripe.dev's). */
  aspect?: string;
  /** Live overrides (RouterFigure re-parameterises through these without re-mounting). */
  count?: number;
  noise?: number;
  scale?: number;
};

export function FigWindow({ seed, fig, preset, className, aspect = "302 / 252", count, noise, scale }: FigWindowProps) {
  const motion = useMotionEnabled();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [held, setHeld] = useState(false);
  const [coarse, setCoarse] = useState(false);

  const params = useMemo(() => {
    const overrides: ArtOverrides = {};
    if (count !== undefined) overrides.count = count;
    if (noise !== undefined) overrides.noise = noise;
    if (scale !== undefined) overrides.scale = scale;
    return artConfig(seed, preset, overrides);
  }, [seed, preset, count, noise, scale]);

  const live = useRef({ params, held, time: params.t0 });
  const draw = useCallback<Draw>((ctx, w, h, dt) => {
    const state = live.current;
    state.time += dt * state.params.speed * (state.held ? 10 : 1);
    drawArt(ctx, w, h, state.time, state.params);
  }, []);
  const repaint = useCanvasLoop(canvas, draw, motion);

  useEffect(() => {
    live.current.params = params;
    live.current.held = held;
    if (!motion) repaint.current();
  }, [params, held, motion, repaint]);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const press = (on: boolean) => motion && setHeld(on);
  const label = `Fig. ${fig}, generative print`;

  return (
    <m.figure
      drag={motion ? (coarse ? true : "x") : false}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
      className={cn(
        "group/fig relative w-full select-none bg-fg px-1 pb-1 text-surface animate-in fade-in duration-300 motion-reduce:animate-none motion-off:animate-none",
        motion && "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <LabStyles />
      <figcaption className="flex h-5 items-center gap-2 px-1 font-mono text-[10px] uppercase leading-none">
        <span className="shrink-0">[ Fig. {fig} ]</span>
        <span
          aria-hidden
          className="h-[7px] flex-1 bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_3px)] transition-opacity duration-200 group-hover/fig:opacity-40 group-focus-within/fig:opacity-40"
        />
        {held ? (
          <span aria-hidden className="shrink-0 bg-marker px-1 py-0.5 text-ink animate-[lab-blink_1s_steps(1)_infinite]">
            10x
          </span>
        ) : null}
      </figcaption>
      {/* One element in both modes so the canvas never re-mounts when motion resolves. */}
      <div
        role={motion ? "button" : "img"}
        tabIndex={motion ? 0 : undefined}
        aria-label={motion ? `${label}. Press and hold to run it ten times faster.` : label}
        className="relative w-full bg-cream"
        style={{ aspectRatio: aspect }}
        onPointerDown={() => press(true)}
        onPointerUp={() => press(false)}
        onPointerCancel={() => press(false)}
        onPointerLeave={() => press(false)}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat && motion) {
            event.preventDefault();
            press(true);
          }
        }}
        onKeyUp={(event) => (event.key === " " || event.key === "Enter") && press(false)}
        onBlur={() => press(false)}
      >
        <canvas
          ref={canvas}
          aria-hidden
          className="absolute inset-0 size-full opacity-0 transition-opacity duration-500 data-[ready]:opacity-100 motion-reduce:transition-none"
        />
      </div>
    </m.figure>
  );
}

export type LabGlobeProps = {
  /** Size classes (default: 63px at 390 → 88px at 1440). */
  className?: string;
};

export function LabGlobe({ className }: LabGlobeProps) {
  const motion = useMotionEnabled();
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const draw = useCallback<Draw>((ctx, w, h, dt) => {
    time.current = (time.current + dt / 10) % 1;
    const r = Math.min(w, h) / 2 - 1;
    const cx = w / 2;
    const cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = getComputedStyle(ctx.canvas).color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();
    for (let k = 0; k < 4; k++) {
      const c = Math.cos((time.current + k / 4) * Math.PI);
      ctx.beginPath();
      // Meridian: the half-ellipse facing the viewer flips side as cos changes sign.
      ctx.ellipse(cx, cy, Math.max(0.01, r * Math.abs(c)), r, 0, -Math.PI / 2, Math.PI / 2, c < 0);
      ctx.stroke();
    }
  }, []);
  useCanvasLoop(canvas, draw, motion, 30);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={cn("block aspect-square w-[clamp(63px,calc(2.381vw+53.7px),88px)] text-fg", className)}
    />
  );
}
