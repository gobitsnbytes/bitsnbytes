"use client";

import { type MouseEvent, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useSpring } from "framer-motion";

import { WIDE } from "@/components/chrome/wordmark";
import { useMotionEnabled } from "@/components/experience-provider";
import { Button, Tag } from "@/components/riot";
import { regionalSeriesEvent as event } from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { WATCH_EVENT, type WatchDetail } from "./reel";
import { SectionHead } from "./shared";

// Every line of copy in this chapter is a trailer caption, verbatim.
const [HOOK, PITCH, HEADED, DATES, CLOSER] = event.trailerLines;

/** inkfish magnetic halo: a 40px invisible margin; the button leans ((p − .5) × size / 4) on a spring. */
function Magnetic({ children }: { children: ReactNode }) {
  const motionOn = useMotionEnabled();
  const spring = { stiffness: 260, damping: 18, mass: 0.6 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!motionOn || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * (r.width / 4));
    y.set(((e.clientY - r.top) / r.height - 0.5) * (r.height / 4));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <div onPointerMove={move} onPointerLeave={reset} className="-m-10 p-10">
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}

/** inkfish text-roll: two stacked copies slide up together on hover / keyboard focus. */
function Roll({ children }: { children: string }) {
  const slide =
    "block transition-transform duration-300 ease-[cubic-bezier(.65,0,.35,1)] group-hover:-translate-y-[calc(100%+8px)] group-focus-visible:-translate-y-[calc(100%+8px)] motion-reduce:transition-none motion-off:transition-none";
  return (
    <span className="relative block overflow-hidden">
      <span className={slide}>{children}</span>
      <span aria-hidden className={cn(slide, "absolute left-0 top-[calc(100%+8px)]")}>
        {children}
      </span>
    </span>
  );
}

function Caption({ n, children, className }: { n: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-[340px] font-mono text-[13px] leading-relaxed", className)}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-signal">[{n}]</p>
      {children}
    </div>
  );
}

/**
 * /events [S.01]: inkfish "Agency statement" anatomy on paper. Header row (title | [S.01]), a giant
 * centred statement built from the trailer captions, the finale block flanked by two caption blocks,
 * then the magnetic CTA (existing network CTA → /join) and "View trailer" (opens the reel's player).
 */
export function RegionalSeries() {
  const watch = (e: MouseEvent<HTMLButtonElement>) =>
    window.dispatchEvent(
      new CustomEvent<WatchDetail>(WATCH_EVENT, { detail: { index: 0, from: e.currentTarget } }),
    );

  return (
    <section
      id={event.id}
      data-cinematic-section=""
      data-cinematic-title={event.title}
      data-chapter-number="01"
      data-surface="paper"
      className="tone-paper relative overflow-x-clip px-4 pb-24 pt-20 md:px-5 md:pb-[60px] md:pt-[120px]"
    >
      <SectionHead label={<h2>{event.title}</h2>} section={1} className="mb-14 md:mb-20" />

      <div className="mx-auto max-w-[1080px] text-center">
        <p className={cn(WIDE, "text-[clamp(20px,2.6vw,38px)] uppercase leading-[0.95]")}>{HOOK}</p>
        <p className={cn(WIDE, "mt-6 text-[clamp(40px,9vw,150px)] uppercase leading-[0.85] md:mt-8")}>{CLOSER}</p>
      </div>

      <div className="mt-16 grid items-center gap-10 md:mt-24 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)_minmax(0,340px)] lg:gap-8">
        <Caption n="01" className="lg:order-1">
          <p>{PITCH}</p>
        </Caption>
        <div className="text-center lg:order-2">
          <Tag tone="orange">{event.statusLabel}</Tag>
          <p className="mt-5 font-display text-[clamp(56px,8.4vw,132px)] uppercase leading-[0.84]">
            {event.finaleVenueLabel}{" "}
            <span className="whitespace-nowrap">
              <span className="text-burgundy">·</span> {event.finaleDateLabel}
            </span>
          </p>
        </div>
        <Caption n="02" className="lg:order-3 lg:ml-auto lg:text-right">
          <p>
            {HEADED} <span aria-hidden className="text-signal">|</span> {DATES}
          </p>
        </Caption>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:mt-20">
        <Magnetic>
          <Button asChild variant="burgundy" size="lg" className="group">
            <Link href="/join">
              <Roll>Join the crew</Roll>
            </Link>
          </Button>
        </Magnetic>
        <Button variant="outline" size="lg" aria-haspopup="dialog" onClick={watch}>
          <span aria-hidden>▶</span> View trailer
        </Button>
      </div>
    </section>
  );
}
