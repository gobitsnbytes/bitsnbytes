"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { WIDE } from "@/components/chrome/wordmark";
import { EDITION_GUTTER } from "@/components/edition";
import { Chapter } from "@/components/riot";
import { cn } from "@/lib/utils";
import { aboutContent } from "./data";

gsap.registerPlugin(ScrollTrigger);

const origin = aboutContent.sections[0];
// The original paragraph, sentence by sentence (verbatim), so each stop quotes it exactly.
const [organising, cancelled, founded, grew] = (origin.description.match(/[^.]+\./g) ?? []).map((s) => s.trim());

const STOPS = [
  { big: "JUL", date: "July 2025", dateTime: "2025-07", text: [organising], tone: "" },
  { big: "AUG", date: "Mid-August 2025", dateTime: "2025-08", text: [cancelled], tone: "", struck: true },
  { big: "NOV", date: "November 2025", dateTime: "2025-11", text: [founded, grew], tone: "tone-orange" },
  {
    big: "JUN",
    date: "2 June 2026",
    dateTime: "2026-06-02",
    // public/llms.txt, verbatim
    text: ["GOBITSNBYTES FOUNDATION was legally incorporated as a Section 8 non-profit company on 2 June 2026."],
    tone: "tone-cream",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ch.01: the origin story as a horizontal timeline. The chapter is as tall as the track is wide;
 * a sticky viewport holds still while vertical scroll (the site's one Lenis) pans the track, and an
 * inkfish bracket scrubber reads out [NN%]. Stops reveal via ScrollTrigger containerAnimation.
 * Motion off / reduced motion: plain vertical stack, no sticky, no scrubber.
 */
export function OriginTimeline() {
  const root = useRef<HTMLDivElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      const el = root.current;
      if (!motion || !el) return;
      const q = gsap.utils.selector(el);
      const clip = q("[data-clip]")[0] as HTMLElement;
      const track = q("[data-track]")[0] as HTMLElement;
      const readout = q("[data-readout]")[0] as HTMLElement;
      const stops = q<HTMLElement>("[data-stop]");
      const ticks = q<HTMLElement>("[data-tick]");
      const setFill = gsap.quickSetter(q("[data-fill]"), "scaleX");
      const setHead = gsap.quickSetter(q("[data-head]"), "xPercent");

      const distance = () => Math.max(0, track.scrollWidth - clip.clientWidth);
      // Height = pan distance + one viewport, so 1px of scroll moves the track 1px. Re-measured on every refresh.
      const size = () => {
        const d = distance();
        el.style.setProperty("--run", `${d + window.innerHeight}px`);
        // tick = the moment a stop's left edge crosses the middle of the viewport
        stops.forEach((stop, i) => {
          const at = d ? gsap.utils.clamp(0, 1, (stop.offsetLeft - clip.clientWidth / 2) / d) : 0;
          if (ticks[i]) ticks[i].style.left = `${at * 100}%`;
        });
      };
      size();
      ScrollTrigger.addEventListener("refreshInit", size);

      const pan = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            setFill(progress);
            setHead(progress * 100);
            readout.textContent = `[${pad(Math.round(progress * 100))}%]`;
          },
        },
      });

      // One focal move per stop: the month rises out of its slot (the cancelled one gets struck through).
      stops.forEach((stop) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: stop, containerAnimation: pan, start: "left 80%", toggleActions: "play none none reverse" },
          })
          .from(stop.querySelectorAll("[data-big]"), { yPercent: 70, duration: 0.7, ease: "expo.out" })
          .from(stop.querySelectorAll("[data-strike]"), { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.35);
      });

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", size);
        el.style.removeProperty("--run");
      };
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <Chapter id="origin" title={origin.title} number={1} tone="paper" className="py-0 md:py-0">
      <div
        ref={root}
        className="relative h-(--run) [--run:320svh] motion-reduce:h-auto motion-off:h-auto"
      >
        <div
          className={cn(
            "sticky top-0 flex h-svh min-h-[560px] flex-col px-4 pb-5 pt-[84px] md:px-8 md:pt-[clamp(84px,13svh,104px)]",
            "motion-reduce:static motion-reduce:h-auto motion-reduce:py-20 motion-off:static motion-off:h-auto motion-off:py-20",
            EDITION_GUTTER,
          )}
        >
          <div data-clip className="relative min-h-0 flex-1 overflow-clip motion-reduce:overflow-visible motion-off:overflow-visible">
            <div
              data-track
              className="flex h-full w-max motion-reduce:h-auto motion-reduce:w-full motion-reduce:flex-col motion-off:h-auto motion-off:w-full motion-off:flex-col"
            >
              <div className="flex h-full w-[min(88vw,760px)] shrink-0 flex-col justify-between gap-6 pb-6 pr-8 md:pr-16 motion-reduce:h-auto motion-reduce:w-full motion-off:h-auto motion-off:w-full">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
                  §01 · Timeline [{pad(STOPS.length)}]
                </p>
                <div>
                  <h2 className={cn(WIDE, "text-[clamp(40px,min(6vw,11svh),96px)] uppercase leading-[0.86]")}>{origin.title}</h2>
                  <p className="mt-[clamp(12px,3svh,24px)] max-w-[52ch] font-serif text-base leading-relaxed md:text-[clamp(16px,2.6svh,20px)]">{origin.description}</p>
                </div>
                <p aria-hidden className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] motion-reduce:hidden motion-off:hidden">
                  Scroll →
                </p>
              </div>

              <ol className="flex h-full motion-reduce:h-auto motion-reduce:flex-col motion-off:h-auto motion-off:flex-col">
                {STOPS.map((stop, i) => (
                  <li
                    key={stop.date}
                    data-stop
                    className={cn(
                      "relative flex h-full w-[min(84vw,520px)] shrink-0 flex-col border-l-2 border-t-3 border-line px-5 pt-7 md:px-8",
                      "motion-reduce:h-auto motion-reduce:w-full motion-reduce:border-l-0 motion-off:h-auto motion-off:w-full motion-off:border-l-0",
                      stop.tone,
                    )}
                  >
                    <span aria-hidden className="absolute -left-[9px] -top-[9px] size-4 rotate-45 border-2 border-line bg-signal" />
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
                      [T.{pad(i + 1)}] <time dateTime={stop.dateTime}>{stop.date}</time>
                    </p>
                    <div aria-hidden className="relative mt-4 overflow-clip">
                      <span data-big className="block font-display text-[clamp(120px,19vw,280px)] leading-[0.82]">
                        {stop.big}
                      </span>
                      {stop.struck ? (
                        <span
                          data-strike
                          className="absolute inset-x-0 top-[46%] h-[clamp(8px,1.1vw,14px)] origin-left bg-burgundy"
                        />
                      ) : null}
                    </div>
                    <div className="mt-auto space-y-3 pb-6 pt-6 font-serif text-lg leading-snug md:text-xl">
                      {stop.text.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* inkfish bracket scrubber */}
          <div
            aria-hidden
            className="mt-4 flex items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] motion-reduce:hidden motion-off:hidden"
          >
            <span>[S.01]</span>
            <div className="relative h-5 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-fg/20" />
              <span data-fill className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 origin-left scale-x-0 bg-signal" />
              {STOPS.map((stop) => (
                <span key={stop.date} data-tick className="absolute left-0 top-1/2 h-3 w-[2px] -translate-y-1/2 bg-fg" />
              ))}
              <span data-head className="absolute inset-0">
                <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-page px-0.5 text-signal">[&nbsp;]</span>
              </span>
            </div>
            <span data-readout className="min-w-[6ch] text-right tabular-nums">
              [00%]
            </span>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
