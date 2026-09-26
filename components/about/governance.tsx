"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { CubeMark, WIDE } from "@/components/chrome/wordmark";
import { EDITION_GUTTER } from "@/components/edition";
import { Chapter, ChapterHead } from "@/components/riot";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Copy verbatim from public/llms.txt ("Governance & Executive Team", "Fork Network Model", "Code of Conduct").
const CELLS: { title: string; note?: string; span: string; body: ReactNode }[] = [
  {
    title: "Board of Directors",
    note: "(Constitutional Authority)",
    span: "md:col-span-8",
    body: (
      <>
        Ultimate legal, financial, and safeguarding authority over GOBITSNBYTES FOUNDATION sits with the Board of
        Directors. The names of the directors are kept private from public-facing profiles to preserve operational
        privacy.
      </>
    ),
  },
  {
    title: "Executive Officers",
    note: "(Delegated Operations)",
    span: "md:col-span-7",
    body: (
      <>
        Appointed by the Board under Article 28 of the e-Articles of Association (e-AOA) for Network operations. Because
        bits&amp;bytes™ is youth-led and includes minors, these designations represent operational accountability only.
        They <strong>do not</strong> automatically confer statutory directorship, legal membership, signature authority,
        bank control, or the power to bind the Foundation except where explicitly authorized in writing by the Board.
      </>
    ),
  },
  {
    title: "Fork Network Model",
    span: "md:col-span-5",
    body: (
      <>
        A <strong>Fork</strong> is a recognized local, institutional, or thematic operating unit of the Network. It does
        not constitute a separate legal entity, franchise, branch office, joint venture, partnership, or subsidiary. A
        Fork has no authority to bind, contract, represent, or collect funds on behalf of GOBITSNBYTES FOUNDATION. All
        financial transactions and sponsorship agreements must be routed through Upstream.
      </>
    ),
  },
  {
    title: "Minor Protections",
    span: "md:col-span-12",
    body: (
      <>
        All youth and minor participation is protected under the{" "}
        <strong>Protection of Children from Sexual Offences Act, 2012 (POCSO)</strong> and the{" "}
        <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. Parental consent is mandatory.
      </>
    ),
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const RULE = "pointer-events-none absolute bg-cream/35";

/** Top + left hairline of a blueprint cell (drawn in by scale). */
function Rules() {
  return (
    <>
      <span aria-hidden data-rule-x className={cn(RULE, "left-0 top-0 h-px w-full origin-left")} />
      <span aria-hidden data-rule-y className={cn(RULE, "left-0 top-0 h-full w-px origin-top")} />
    </>
  );
}

/**
 * ch.04: governance as a kprverse construction grid on ink. 1px cream hairlines draw in, one cell
 * carries the diagonal + coordinates, then the copy settles (lines → titles → body).
 */
export function Governance() {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } })
        .from(q("[data-rule-x]"), { scaleX: 0, duration: 0.8, stagger: 0.06, ease: "power2.inOut" })
        .from(q("[data-rule-y]"), { scaleY: 0, duration: 0.8, stagger: 0.06, ease: "power2.inOut" }, 0.1)
        .from(q("[data-diag]"), { clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power2.inOut" }, 0.45)
        .from(q("[data-cell-in]"), { autoAlpha: 0, y: 14, duration: 0.45, stagger: 0.05, ease: "expo.out" }, 0.55);
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <Chapter id="governance" title="Governance" number={4} tone="ink" className="pb-24 md:pb-32">
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <ChapterHead number={4} label="GOBITSNBYTES FOUNDATION" title="Governance" />

        <div ref={root} className="relative grid md:grid-cols-12">
          <div className="relative flex min-h-56 flex-col justify-between p-6 md:col-span-4 md:p-8">
            <Rules />
            <svg
              aria-hidden
              data-diag
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full stroke-cream/35"
            >
              <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" strokeWidth={1} />
            </svg>
            <p data-cell-in className="relative font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
              [G.00] Upstream
            </p>
            <div data-cell-in className="relative flex items-end justify-between gap-4">
              <CubeMark className="size-16 text-cream md:size-20" />
              <p className="text-right font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cream/80">
                20.5937° N,
                <br />
                78.9629° E
              </p>
            </div>
          </div>

          {CELLS.map((cell, i) => (
            <section key={cell.title} aria-labelledby={`gov-${i}`} className={cn("relative p-6 md:p-10", cell.span)}>
              <Rules />
              <p data-cell-in className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
                [G.{pad(i + 1)}]{cell.note ? ` ${cell.note}` : ""}
              </p>
              <h3
                id={`gov-${i}`}
                data-cell-in
                className={cn(WIDE, "mt-3 text-[clamp(28px,3.4vw,52px)] uppercase leading-[0.9] text-cream")}
              >
                {cell.title}
              </h3>
              <p data-cell-in className="mt-5 max-w-[62ch] font-serif text-base leading-relaxed text-paper/85 md:text-lg">
                {cell.body}
              </p>
            </section>
          ))}

          {/* closing right + bottom rules of the grid */}
          <span aria-hidden data-rule-x className={cn(RULE, "bottom-0 left-0 h-px w-full origin-right")} />
          <span aria-hidden data-rule-y className={cn(RULE, "right-0 top-0 h-full w-px origin-bottom")} />
        </div>
      </div>
    </Chapter>
  );
}
