"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { EDITION_GUTTER, pad, type SurfaceTone } from "./shared";

gsap.registerPlugin(ScrollTrigger);

export type IndentStatementProps = {
  /** Eyebrow in the indent ("WHO WE ARE"); also the chapter index title. */
  label: string;
  /** Optional chapter number → "§0N — LABEL". */
  number?: number;
  /** The statement, plain text, existing copy verbatim. */
  children: string;
  id?: string;
  surface?: SurfaceTone;
  /** false drops EDITION_GUTTER (pages without the chapter index, e.g. the homepage). */
  gutter?: boolean;
  className?: string;
  /** Decorative extra placed inside the section (e.g. the character, absolutely positioned in the padding). */
  aside?: ReactNode;
};

/**
 * buttermax "who we are": Archivo 800 uppercase mega statement, first line indented ~26% with the
 * §label sitting in the indent. Words scrub from 15% to full opacity with scroll (one ScrollTrigger).
 * Screen readers get the plain sentence once; the per-word spans are aria-hidden.
 */
export function IndentStatement({
  label,
  number,
  children,
  id,
  surface = "paper",
  gutter = true,
  className,
  aside,
}: IndentStatementProps) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  const words = children.trim().split(/\s+/);

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-word]"),
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-words]")[0], start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id={id}
      data-cinematic-section=""
      data-cinematic-title={label}
      data-surface={surface}
      className={cn(`tone-${surface}`, "relative overflow-x-clip py-24 md:py-40", className)}
    >
      <div className={cn("px-4 md:px-8", gutter && EDITION_GUTTER)}>
        <div className="relative">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal md:absolute md:left-0 md:top-[0.6em] md:mb-0 md:max-w-[24%]">
            {number === undefined ? label : `§${pad(number)} — ${label}`}
          </p>
          <p className="indent-[26%] font-sans text-[clamp(28px,4.2vw,64px)] font-extrabold uppercase leading-none tracking-[-0.03em]">
            <span className="sr-only">{children}</span>
            <span data-words aria-hidden>
              {words.map((word, index) => (
                <span key={index}>
                  <span data-word>{word}</span>{" "}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
      {aside}
    </section>
  );
}
