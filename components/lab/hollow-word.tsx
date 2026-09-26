"use client";

/**
 * HollowWord — stripe.dev's "endless footer" word as a closing flourish (no scroll teleport/loop:
 * that fights Lenis and traps keyboard users).
 *
 * Anatomy: a clipped block (overflow: clip) holding one line of giant outlined type — Anton
 * uppercase, transparent fill, 2.5px -webkit-text-stroke in --lab-stroke (default the tone's fg),
 * sized from the word length to span the page width (≤1728px). Decorative: aria-hidden, so never
 * put content here that isn't also on the page.
 * Motion: as the block scrolls in, the word rises out of the slot (yPercent 70 → 0) and grows
 * (.92 → 1) on a lagged scrub (scrub .8 ≈ stripe.dev's 0.1-per-frame lerp). Static when motion is off.
 */
import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HollowWordProps = {
  text: string;
  className?: string;
};

export function HollowWord({ text, className }: HollowWordProps) {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      gsap.fromTo(
        "[data-hollow]",
        { yPercent: 70, scale: 0.92 },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        },
      );
    },
    { scope: root, dependencies: [motion, text], revertOnUpdate: true },
  );

  // Anton caps average ≈ .5em wide: size the line to fill the width, capped for short words.
  const style = {
    fontSize: `min(calc((min(100vw, 1728px) - 24px) / ${Math.max(text.length, 1) * 0.5}), 30vw)`,
  } as CSSProperties;

  return (
    <div ref={root} aria-hidden className={cn("relative mx-auto w-full max-w-[1728px] overflow-clip px-3 pt-[8vw]", className)}>
      <div
        data-hollow
        style={style}
        className="origin-bottom whitespace-nowrap text-center font-display uppercase leading-[0.86] tracking-[-0.01em] text-transparent [-webkit-text-stroke:2.5px_var(--lab-stroke,var(--fg))]"
      >
        {text}
      </div>
    </div>
  );
}
