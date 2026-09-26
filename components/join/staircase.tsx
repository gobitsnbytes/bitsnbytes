"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export type StaircaseProps = {
  /** One existing headline, split into lines (verbatim words, only the breaks are ours). */
  lines: string[];
  as?: "h2" | "h3";
  className?: string;
};

/**
 * kprverse staircase headline: each line steps right, with a hanging mono index tag. Lines slide in
 * once on enter (x + opacity, expo.out, 100ms stagger). Screen readers get the sentence once.
 */
export function Staircase({ lines, as: Tag = "h2", className }: StaircaseProps) {
  const root = useRef<HTMLHeadingElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      gsap.from(root.current.querySelectorAll("[data-line]"), {
        x: -120,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <Tag
      ref={root}
      className={cn(
        WIDE,
        "text-[clamp(40px,7.5vw,128px)] uppercase leading-[0.86] [--stair:7vw] md:[--stair:8vw]",
        className,
      )}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, index) => (
          <span
            key={index}
            data-line
            className="block w-fit max-w-full break-words"
            style={{ marginLeft: `calc(${index} * var(--stair))` }}
          >
            <sup className="mr-[0.4em] align-top font-mono text-[11px] font-bold tracking-[0.1em] [font-stretch:100%]">
              [{String(index + 1).padStart(2, "0")}]
            </sup>
            {line}
          </span>
        ))}
      </span>
    </Tag>
  );
}
