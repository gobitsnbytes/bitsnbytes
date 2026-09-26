"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { EDITION_GUTTER } from "./shared";

gsap.registerPlugin(ScrollTrigger, SplitText);

export type SerifStatementProps = {
  /** Existing copy only (pull a sentence out, never rewrite it). */
  children: ReactNode;
  /** Background of the block. The swash is burgundy on paper/cream, orange on ink (text-signal). */
  surface?: "paper" | "ink" | "cream";
  /** Element for the statement text. Default p. */
  as?: "p" | "blockquote" | "h2" | "h3";
  /** Give it a title (and id) to make the block a chapter in the index. */
  title?: string;
  id?: string;
  className?: string;
};

/**
 * Editions narrative statement: Georgia italic clamp(32px,5vw,80px)/1.05 with a Yellowtail swash
 * first letter hanging into the gutter. Lines rise in once on enter (SplitText, reverted afterwards).
 */
export function SerifStatement({ children, surface = "paper", as: Tag = "p", title, id, className }: SerifStatementProps) {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const text = root.current?.querySelector<HTMLElement>("[data-statement]");
      if (!motion || !text) return;
      const split = SplitText.create(text, { type: "lines" });
      gsap.from(split.lines, {
        yPercent: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: text, start: "top 82%", once: true },
        onComplete: () => split.revert(),
      });
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  const chapter = title
    ? { "data-cinematic-section": "", "data-cinematic-title": title }
    : undefined;

  return (
    <div
      ref={root}
      id={id}
      data-surface={surface}
      {...chapter}
      className={cn(`tone-${surface}`, "relative overflow-x-clip py-20 md:py-32", className)}
    >
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <Tag
          data-statement
          className={cn(
            "max-w-[28ch] pt-[0.35em] font-serif text-[clamp(32px,5vw,80px)] italic leading-[1.05] tracking-[-0.02em] md:pl-[0.6em]",
            "first-letter:pr-[0.04em] first-letter:font-script first-letter:text-[2.4em] first-letter:font-normal first-letter:not-italic first-letter:leading-[0] first-letter:text-signal md:first-letter:-ml-[0.25em]",
          )}
        >
          {children}
        </Tag>
      </div>
    </div>
  );
}
