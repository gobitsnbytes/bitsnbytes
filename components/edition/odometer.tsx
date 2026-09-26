"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export type OdometerProps = {
  /** A per-event figure ("₹35,000") or a word ("Forks"). Digits roll, everything else is static. */
  value: string;
  label: ReactNode;
  detail?: ReactNode;
  className?: string;
};

/**
 * Anton mega-stat. The final value is plain text from SSR; ~200px before it scrolls in, the digits
 * are swapped for aria-hidden columns that roll up from 0 (transform only) while a 3px rule draws in.
 */
export function Odometer({ value, label, detail, className }: OdometerProps) {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();
  const [armed, setArmed] = useState(false);

  // Arm just before it enters the viewport so the swap to "0" is never seen.
  useGSAP(
    () => {
      if (!motion || armed) return;
      const arm = () => setArmed(true);
      ScrollTrigger.create({ trigger: root.current, start: "top bottom+=200", onEnter: arm, onLeave: arm, once: true });
    },
    { scope: root, dependencies: [motion, armed], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!motion || !armed || !root.current) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } })
        .fromTo(
          q("[data-strip]"),
          { y: 0, yPercent: 0 },
          {
            yPercent: (_: number, el: HTMLElement) => -Number(el.dataset.d) * 10,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.05,
          },
        )
        .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "expo.out" }, 0.1);
    },
    { scope: root, dependencies: [motion, armed], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={cn("min-w-0", className)}>
      <p className="whitespace-nowrap font-display text-[clamp(96px,12.5vw,200px)] uppercase leading-none tracking-[-0.01em]">
        {armed && motion ? (
          <>
            <span className="sr-only">{value}</span>
            <span aria-hidden className="inline-flex">
              {Array.from(value).map((char, index) =>
                /\d/.test(char) ? (
                  <span key={index} className="relative inline-block overflow-hidden">
                    <span className="invisible">{char}</span>
                    <span
                      data-strip
                      data-d={char}
                      className="absolute inset-x-0 top-0 flex flex-col items-center"
                      style={{ transform: `translateY(-${Number(char) * 10}%)` }}
                    >
                      {DIGITS.map((digit) => (
                        <span key={digit}>{digit}</span>
                      ))}
                    </span>
                  </span>
                ) : (
                  <span key={index} className="whitespace-pre">
                    {char}
                  </span>
                ),
              )}
            </span>
          </>
        ) : (
          value
        )}
      </p>
      <span data-rule aria-hidden className="mt-3 block h-[3px] origin-left bg-current" />
      <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-signal">{label}</p>
      {detail ? <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] opacity-70">{detail}</p> : null}
    </div>
  );
}
