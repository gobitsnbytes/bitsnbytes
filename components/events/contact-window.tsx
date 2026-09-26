"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

import { SectionHead } from "./shared";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const IST = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** inkfish footer clock: HH:mm:ss in the studio's timezone, ticking every second (text only). */
function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(IST.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <time className="tabular-nums">{now ?? "--:--:--"}</time>;
}

/**
 * /events [S.04]: inkfish contact window. The section clips (clip-path: inset(0)) a position:fixed
 * backdrop, so it reads as a window onto a plate the page scrolls over; the plate counter-drifts
 * y 10% → -10% across the section's pass. The photo prints as burgundy (grayscale × burgundy multiply),
 * which caps its brightness so paper copy stays ≥ 7:1 anywhere. Motion off: the window, no drift.
 */
export function ContactWindow() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo(
        plateRef.current,
        { yPercent: 10 },
        {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: rootRef, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="contact"
      data-cinematic-section=""
      data-cinematic-title="Contact"
      data-chapter-number="04"
      data-surface="ink"
      className="tone-ink relative flex min-h-[max(100svh,640px)] flex-col justify-between gap-16 px-4 pb-16 pt-24 [clip-path:inset(0)] md:px-5 md:pb-[100px] md:pt-28"
    >
      <div ref={plateRef} aria-hidden className="pointer-events-none fixed inset-x-0 -top-[10vh] -z-10 isolate h-[120vh]">
        <Image src="/event_pictures/HEe923uagAATqvy.jpg" alt="" fill sizes="100vw" className="object-cover grayscale contrast-125" />
        <span className="absolute inset-0 bg-burgundy mix-blend-multiply" />
        <span className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
      </div>

      <SectionHead label={<h2>Contact</h2>} section={4} className="text-paper" />

      <div className="max-w-[540px] self-end text-paper lg:mr-[180px]">
        <p className={cn(WIDE, "text-[clamp(28px,2.8vw,40px)] uppercase leading-none")}>Let&apos;s build something together</p>
        <p className="mt-5 font-serif text-lg leading-snug text-paper md:text-xl">
          Partner with us on hackathons, workshops, or school programs across Lucknow.
        </p>
        <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream">
          Lucknow, India · 26.8467° N, 80.9462° E · <Clock /> IST
        </p>
      </div>

      <Link
        href="/contact"
        className={cn(
          WIDE,
          "group relative inline-flex items-end gap-[0.14em] self-start text-[clamp(52px,11.2vw,160px)] uppercase leading-[0.85] text-paper",
        )}
      >
        {/* inkfish hook: an L + triangle that drops away while the underline runs out to the right. */}
        <span aria-hidden className="relative mb-[0.08em] block h-[0.5em] w-[0.34em] shrink-0 overflow-hidden">
          <span className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-y-full group-focus-visible:translate-y-full motion-reduce:transition-none motion-off:transition-none">
            <span className="absolute left-0 top-0 h-full w-[0.07em] bg-orange" />
            <span className="absolute bottom-0 left-0 h-[0.07em] w-[0.2em] bg-orange" />
            <span className="absolute bottom-[-0.08em] right-0 size-[0.23em] bg-orange [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          </span>
        </span>
        <span className="relative">
          Contact Us
          <span
            aria-hidden
            className="absolute -bottom-[0.06em] left-0 h-[0.07em] w-full origin-left scale-x-0 bg-orange transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none motion-off:transition-none"
          />
        </span>
      </Link>
    </section>
  );
}
