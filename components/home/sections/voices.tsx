"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useMotionEnabled } from "@/components/experience-provider";
import { Button } from "@/components/ui/button";
import { Chapter, ChapterHead } from "@/components/riot/chapter";

const testimonials = [
  {
    quote:
      "Most cities don't have a student tech scene. It's not a lack of talent, it's just a lack of people around you who are also building. We got tired of waiting for someone else to fix that, so we built bits&bytes™. It's just us doing the unglamorous work, showing up, and giving people a place to finally ship their chaotic, half-baked ideas together.",
    author: "Aadrika Maurya",
    role: "Chief Creative Officer & COO",
    company: "bits&bytes™",
  },
  {
    quote:
      "There's a difference between building and shipping, and most people never cross that line. We don't have VC money or fancy decks. We just have a ridiculous amount of conviction that high schoolers should be pushing real projects to real users. Ship first. Panic later. That's the bar.",
    author: "Yash Vardhan Singh",
    role: "Chief Executive Officer",
    company: "bits&bytes™",
  },
  {
    quote:
      "bits&bytes™ started as a cope because my school said no to a CS club. Now, we run hackathons where teenagers actually ship code instead of pitching slide decks. You don't need institutional approval or a five-year plan to build something cool. You just need to ignore the gatekeepers and write the code.",
    author: "Akshat Kushwaha",
    role: "Chief Technology Officer",
    company: "bits&bytes™",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Voices" as a horizontal quote rail on the orange poster surface: native scroll-snap (arrow keys work once
 * the rail has focus), mouse drag-to-scroll, prev/next buttons and a live counter. No autoplay.
 */
export function HomeVoices() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; left: number } | null>(null);
  const [active, setActive] = useState(0);
  const motionOn = useMotionEnabled();

  const step = () => railRef.current?.querySelector<HTMLElement>("figure")?.offsetWidth ?? 0;

  const go = (dir: 1 | -1) =>
    railRef.current?.scrollBy({ left: dir * step(), behavior: motionOn ? "smooth" : "auto" });

  const onScroll = () => {
    const rail = railRef.current;
    const width = step();
    if (!rail || !width) return;
    const next = Math.min(testimonials.length - 1, Math.round(rail.scrollLeft / width));
    if (next !== active) setActive(next);
  };

  // Mouse drag-to-scroll; touch and pens already pan natively.
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || event.pointerType !== "mouse" || event.button !== 0) return;
    rail.setPointerCapture(event.pointerId);
    rail.style.scrollSnapType = "none";
    drag.current = { id: event.pointerId, x: event.clientX, left: rail.scrollLeft };
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || drag.current?.id !== event.pointerId) return;
    rail.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || drag.current?.id !== event.pointerId) return;
    drag.current = null;
    rail.style.removeProperty("scroll-snap-type");
    // Re-snap to the nearest quote.
    const width = step();
    if (width) rail.scrollTo({ left: Math.round(rail.scrollLeft / width) * width, behavior: motionOn ? "smooth" : "auto" });
  };

  return (
    <Chapter id="voices" title="voices" number={6} tone="orange">
      <div className="px-[4vw]">
        <ChapterHead number={6} label="Stories" title="Voices from the crew" />
        <div className="-mt-4 mb-8 flex items-center justify-end gap-3">
          <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous testimonial">
            <ArrowLeft aria-hidden className="size-4" />
          </Button>
          <p className="min-w-16 text-center font-mono text-xs font-bold tracking-[0.14em]" aria-live="polite">
            {pad(active + 1)} / {pad(testimonials.length)}
          </p>
          <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next testimonial">
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label="Testimonials"
        tabIndex={0}
        data-cursor-label="DRAG"
        onScroll={onScroll}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-[4vw] px-[4vw] [scrollbar-width:none] focus-visible:outline-offset-[-3px] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((item, index) => (
          <figure
            key={item.author}
            className="flex w-[min(86vw,760px)] shrink-0 snap-start flex-col border-l-3 border-ink py-2 pl-6 pr-[clamp(24px,4vw,64px)] select-none md:pl-10"
          >
            <span aria-hidden className="font-mono text-[11px] font-bold tracking-[0.14em]">
              [V.{pad(index + 1)}]
            </span>
            <blockquote className="mt-6 flex-1 font-serif text-[clamp(20px,2.1vw,30px)] italic leading-[1.3] tracking-[-0.005em]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t-3 border-ink pt-5">
              <span aria-hidden className="h-[3px] w-6 bg-burgundy" />
              <span>
                <span className="block font-sans text-lg font-black uppercase leading-none tracking-[-0.01em]">
                  {item.author}
                </span>
                <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  {item.role} · {item.company}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Chapter>
  );
}
