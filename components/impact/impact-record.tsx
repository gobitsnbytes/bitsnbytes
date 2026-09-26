"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { EDITION_GUTTER, Odometer } from "@/components/edition";
import { useMotionEnabled } from "@/components/experience-provider";
import { Chapter, Tag } from "@/components/riot";
import { cn } from "@/lib/utils";
import { CHAPTERS, highlightStats } from "./content";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

// Odometer's value size, shrunk below md so "16.5 YEARS" fits a 390px screen. Plates share it.
const VALUE_SIZE = "text-[clamp(96px,12.5vw,200px)] max-md:text-[19vw]";
const ODOMETER_SIZE = "max-md:[&>p:first-child]:text-[19vw]";

/**
 * ch.01 — revelatio metrics rows: a hairline rule draws in across each row, the Anton odometer rolls,
 * and two riso plates (burgundy, orange) slip out from under the ink figure with scroll velocity.
 */
export function ImpactRecord() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);

      q("[data-row]").forEach((row) => {
        gsap.fromTo(
          row.querySelector("[data-row-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "circ.out", scrollTrigger: { trigger: row, start: "top 85%", once: true } },
        );
        // Plates stay hidden until the odometer (1.4s roll from "top 85%") has landed on the real figure.
        ScrollTrigger.create({
          trigger: row,
          start: "top 85%",
          once: true,
          // onToggle also fires when the page loads already scrolled past the row.
          onToggle: () => gsap.set(row.querySelectorAll("[data-plate]"), { autoAlpha: 1, delay: 1.5 }),
        });
      });

      const plates = q<HTMLElement>("[data-plate]");
      const moves = plates.map((el, i) => {
        const sign = i % 2 ? -1 : 1;
        const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        return (d: number) => {
          x(d * sign);
          y(d * sign * 0.5);
        };
      });
      const shift = (d: number) => moves.forEach((move) => move(d));
      let settle: gsap.core.Tween | undefined;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          shift(gsap.utils.clamp(-10, 10, self.getVelocity() * 0.004));
          settle?.kill();
          settle = gsap.delayedCall(0.12, () => shift(0));
        },
      });
      return () => settle?.kill();
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <Chapter ref={root} id={CHAPTERS[0].id} title={CHAPTERS[0].title} number={1} tone="paper" className="pt-4 md:pt-8">
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b-3 border-line pb-6">
          <h2 className="font-display text-[clamp(56px,9vw,144px)] uppercase leading-[0.86]">{CHAPTERS[0].title}</h2>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
            §01 — [{pad(highlightStats.length)}]
          </p>
        </header>

        <ol>
          {highlightStats.map((stat, index) => (
            <li
              key={stat.label}
              data-row
              className="relative grid gap-5 pb-12 pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 md:pb-16"
            >
              <span data-row-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div className="flex flex-col items-start gap-4 md:max-w-[34ch]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold tracking-[0.14em]">[S.{pad(index + 1)}]</span>
                  <Tag tone={index % 2 ? "orange" : "cream"}>{stat.timeframe}</Tag>
                </div>
                <p className="font-serif text-lg leading-snug md:text-xl">{stat.description}</p>
              </div>
              <div className="relative isolate min-w-0 md:justify-self-end">
                {["text-burgundy", "text-orange-lt"].map((color) => (
                  <p
                    key={color}
                    data-plate
                    aria-hidden
                    className={cn(
                      "pointer-events-none invisible absolute left-0 top-0 -z-10 whitespace-nowrap font-display uppercase leading-none tracking-[-0.01em] opacity-0",
                      VALUE_SIZE,
                      color,
                    )}
                  >
                    {stat.value}
                  </p>
                ))}
                <Odometer value={stat.value} label={stat.label} className={ODOMETER_SIZE} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
