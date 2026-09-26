"use client";

/**
 * PixelGlyph — stripe.dev's self-building "DEV" block glyph, with our own 5×7 bitmap font.
 *
 * Anatomy: one <svg role="img" aria-label={text}>. Each letter's pixels are merged into Tetris
 * blocks (vertical-first greedy meshing: stems become one tall rect, bars one wide rect), drawn as
 * <rect>s with a 2-unit gap and sorted bottom-to-top. Letters sit 1 cell apart, spaces are 3 cells.
 *
 * Motion (only with motion enabled): the first time the glyph scrolls into view (after the loader),
 * every block starts one glyph-height above the top edge (clipped by the svg) and drops into place
 * — 500ms easeOutQuint (cubic-bezier(.23,1,.32,1)), 16–60ms stagger, whole build ≤ ~1.2s.
 * Hover paints a block with `paintColor` instantly; after leaving it holds 2.5s and fades back over
 * 1.2s (paint trail). Reduced motion / motion toggle off: blocks render in place.
 *
 * Size: intrinsic `cell` px per pixel (7 × cell tall). The default class sizes it to the cap height
 * of the surrounding text (h-[0.72em] w-auto) so it sits inline in a LAB_TEXT.hero title; pass a
 * className to size it yourself. fill = currentColor.
 */
import { useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotionEnabled } from "@/components/experience-provider";
import { whenReady } from "@/components/edition/shared";
import { cn } from "@/lib/utils";
import { GLYPH_ROWS, layoutGlyph } from "./glyph-font";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GAP = 2;

export type PixelGlyphProps = {
  /** Word to draw; also the accessible label. */
  text: string;
  className?: string;
  /** Intrinsic px per pixel (default 16). The 2-unit gap is relative to this. */
  cell?: number;
  /** Hover paint (default var(--lab-hi, var(--marker))). */
  paintColor?: string;
  /** Hide from assistive tech when the same word is already in the text next to it. */
  decorative?: boolean;
};

export function PixelGlyph({ text, className, cell = 16, paintColor, decorative }: PixelGlyphProps) {
  const svg = useRef<SVGSVGElement>(null);
  const motion = useMotionEnabled();
  const { blocks, cols } = useMemo(() => layoutGlyph(text), [text]);
  const width = cols * cell - GAP;
  const height = GLYPH_ROWS * cell - GAP;

  useGSAP(
    (_, contextSafe) => {
      if (!motion || !svg.current || !contextSafe) return;
      const rects = gsap.utils.toArray<SVGRectElement>(svg.current.querySelectorAll("rect"));
      if (!rects.length) return;
      gsap.set(rects, { y: -(height + GAP) });
      const stagger = Math.min(0.06, Math.max(0.016, 0.7 / rects.length));
      let dispose = () => {};
      ScrollTrigger.create({
        trigger: svg.current,
        start: "top 92%",
        once: true,
        onEnter: () => {
          dispose = whenReady(contextSafe(() => gsap.to(rects, { y: 0, duration: 0.5, ease: "quint.out", stagger })));
        },
      });
      return () => dispose();
    },
    { scope: svg, dependencies: [motion, text, cell], revertOnUpdate: true },
  );

  return (
    <svg
      ref={svg}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : text}
      aria-hidden={decorative || undefined}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("inline-block h-[0.72em] w-auto overflow-hidden align-baseline", className)}
      style={{ "--lab-paint": paintColor ?? "var(--lab-hi, var(--marker))" } as CSSProperties}
    >
      {blocks.map(([x, y, w, h]) => (
        <rect
          key={`${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={w * cell - GAP}
          height={h * cell - GAP}
          className="fill-current [transition:fill_1.2s_ease_2.5s] hover:fill-[var(--lab-paint)] hover:[transition:fill_0s]"
        />
      ))}
    </svg>
  );
}
