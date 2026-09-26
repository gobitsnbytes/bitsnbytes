"use client";

/*
 * HomeHero — buttermax.net's hero, 1:1 in our brand (DESIGN.md "Homepage" 1; tmp/research-full.json → buttermax).
 *
 * Reference moves:
 *  - Full-bleed campaign-colour first viewport (orange for their #FFD600) with a giant edge-to-edge wordmark and
 *    a script accent, a tiny uppercase caption under its left side, and a 3D object floating in front.
 *  - Wordmark draw-on → here: letters rise from a clip mask (45ms stagger), the script "&bytes" wipes in after,
 *    then object → caption → actions. Starts on the loader's "bnb:ready" (or at once if html[data-loaded]),
 *    with a 1200ms safety fallback. Skipped when the wordmark is already on screen, so it never flashes.
 *  - Scroll-velocity RGB split → riso misregistration: burgundy + orange-lt plates slip up to ±10px with scroll
 *    velocity (gsap.quickTo) and snap back into register at rest.
 *  - Object that outruns the scroll + timed swap → ByteScene (R3F), mounted after requestIdleCallback.
 *  - Hero footer row: dots glyph left, down-arrow centre (Lenis scroll to the reel).
 *
 * Reduced motion / motion toggle off: no intro, no plates, no WebGL; a static SVG byte sits in the object slot.
 */

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, FileDown, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VideoModal } from "@/components/riot/video";
import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { Wordmark } from "./wordmark";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ByteScene = dynamic(() => import("./byte-scene"), { ssr: false });

const FILM = "/movie/bnb-movie.mp4";
const noopSubscribe = () => () => {};

/** Sync preference read for the first frame (the provider's motionEnabled is false until its effect resolves). */
function motionAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return window.localStorage.getItem("bnb-immersive-motion") !== "off"; // ExperienceProvider's toggle key
  } catch {
    return true;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static byte for reduced motion / no WebGL: the same 2×2×2 cluster, drawn isometric with ink key lines. */
function StaticByte({ className }: { className?: string }) {
  return (
    <svg viewBox="-96 -172 192 278" aria-hidden className={className}>
      <g stroke="var(--ink)" strokeWidth="3" strokeLinejoin="miter">
        <path d="M0 -100 86.6 -50 0 0 -86.6 -50Z" fill="var(--cream)" />
        <path d="M-86.6 -50 0 0 0 100 -86.6 50Z" fill="var(--burgundy-dk)" />
        <path d="M0 0 86.6 -50 86.6 50 0 100Z" fill="var(--burgundy)" />
        <path
          d="M43.3 -75 -43.3 -25M-43.3 -75 43.3 -25M-43.3 -25V75M-86.6 0 0 50M43.3 -25V75M0 50 86.6 0"
          fill="none"
        />
        <path
          d="M50 0C53 31 69 47 100 50C69 53 53 69 50 100C47 69 31 53 0 50C31 47 47 31 50 0Z"
          transform="translate(-27 -167) scale(0.54)"
          vectorEffect="non-scaling-stroke"
          fill="var(--cream)"
        />
      </g>
      <text
        transform="matrix(0.866 0.5 0 1 -86.6 -50)"
        x="50"
        y="80"
        textAnchor="middle"
        fontSize="78"
        fontWeight="900"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="3"
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-archivo), Arial, sans-serif", fontStretch: "125%" }}
      >
        B
      </text>
    </svg>
  );
}

/** Eight squares = one byte (0x62, "b"). Decorative. */
function ByteDots() {
  return (
    <span aria-hidden className="flex gap-1">
      {[0, 1, 1, 0, 0, 0, 1, 0].map((bit, i) => (
        <span key={i} className={cn("size-2.5 border-2 border-ink", bit && "bg-ink")} />
      ))}
    </span>
  );
}

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { motionEnabled: motionOn, lenis } = useExperience();
  const [objectCue, setObjectCue] = useState(false);
  const [sceneOn, setSceneOn] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  // true only during hydration: the SSR wordmark may already be on screen.
  const hydrating = useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true,
  );
  const fromServer = useRef(hydrating);

  // Intro choreography: wordmark → object → caption → actions. Runs once, at mount.
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;
      const html = document.documentElement;
      // Hide-then-rise only while nothing has shown the wordmark yet: a client-side route mount (hidden before
      // first paint), or the first-visit loader curtain (html[data-loader="on"], set during HTML parse; its CSS
      // failsafe drops the curtain at 2.4s).
      const covered = !fromServer.current || (html.dataset.loader === "on" && performance.now() < 2400);
      if (!motionAllowed() || !covered) {
        setObjectCue(true);
        return;
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      // DOM order is burgundy plate, orange plate, ink: the plates lead by 35ms, a misregistered print pass.
      hero.querySelectorAll<HTMLElement>("[data-wm-layer]").forEach((layer, i) => {
        const at = i * 0.035;
        tl.fromTo(
          layer.querySelectorAll("[data-wm-char]"),
          { yPercent: 110, clipPath: "inset(-20% -20% 120% -20%)" },
          {
            yPercent: 0,
            clipPath: "inset(-20% -20% -20% -20%)",
            duration: 0.9,
            stagger: 0.045,
            clearProps: "transform,clipPath",
          },
          at,
        )
          .fromTo(
            layer.querySelector("[data-wm-script]"),
            { clipPath: "inset(-40% 100% -40% -10%)" },
            { clipPath: "inset(-40% -10% -40% -10%)", duration: 0.75, ease: "power3.inOut", clearProps: "clipPath" },
            0.4 + at,
          )
          .fromTo(
            layer.querySelector("[data-wm-tm]"),
            { opacity: 0 },
            { opacity: 1, duration: 0.25, clearProps: "opacity" },
            0.95 + at,
          );
      });
      const ui = { y: 12, opacity: 0 };
      const uiTo = { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, clearProps: "transform,opacity" };
      tl.call(() => setObjectCue(true), [], 0.75)
        .fromTo(hero.querySelectorAll("[data-hero-caption]"), ui, uiTo, 1.0)
        .fromTo(hero.querySelectorAll("[data-hero-actions]"), ui, uiTo, 1.12);

      const play = () => tl.play();
      if (html.dataset.loaded === "true") {
        play();
        return;
      }
      window.addEventListener("bnb:ready", play, { once: true });
      const fallback = window.setTimeout(play, 1200);
      return () => {
        window.removeEventListener("bnb:ready", play);
        window.clearTimeout(fallback);
      };
    },
    { scope: heroRef },
  );

  // Scroll: progress for the byte + riso plates driven by scroll velocity.
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!motionOn || !hero) return;
      const [a, b] = hero.querySelectorAll<HTMLElement>("[data-plate]");
      const to = (el: HTMLElement, prop: "x" | "y") => gsap.quickTo(el, prop, { duration: 0.4, ease: "power3" });
      const ax = to(a, "x");
      const ay = to(a, "y");
      const bx = to(b, "x");
      const by = to(b, "y");
      const shift = (d: number) => {
        ax(d);
        ay(d * 0.5);
        bx(-d);
        by(-d * 0.5);
      };
      let settle: gsap.core.Tween | undefined;
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onRefresh: (self) => {
          progress.current = self.progress;
        },
        onUpdate: (self) => {
          progress.current = self.progress;
          shift(gsap.utils.clamp(-10, 10, self.getVelocity() * 0.004));
          settle?.kill();
          settle = gsap.delayedCall(0.12, () => shift(0));
        },
      });
      return () => settle?.kill();
    },
    { scope: heroRef, dependencies: [motionOn], revertOnUpdate: true },
  );

  // Mount the 3D byte at its beat, once the main thread is idle (never competes with the LCP).
  useEffect(() => {
    if (!motionOn || !objectCue || sceneOn) return;
    if (!hasWebGL()) {
      setWebgl(false);
      return;
    }
    const mount = () => setSceneOn(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(mount, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(mount, 200);
    return () => clearTimeout(id);
  }, [motionOn, objectCue, sceneOn]);

  const toReel = (event: MouseEvent<HTMLButtonElement>) => {
    const target = document.getElementById("film") ?? heroRef.current?.nextElementSibling;
    if (!(target instanceof HTMLElement)) return;
    const instant = event.detail === 0 || !motionOn; // keyboard-initiated: no animation
    if (lenis) lenis.scrollTo(target, { immediate: instant });
    else target.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
  };

  return (
    <section
      ref={heroRef}
      data-tour="page-hero"
      data-surface="orange"
      data-cinematic-section=""
      data-cinematic-title="the byte"
      className="tone-orange relative isolate flex min-h-[100svh] flex-col"
    >
      {motionOn && sceneOn ? <ByteScene progress={progress} anchor={slotRef} /> : null}

      <div className="relative flex flex-1 flex-col px-[4vw] pb-[clamp(18px,3vw,44px)] pt-[clamp(84px,9vw,132px)]">
        {/* Wordmark: ink copy in the h1 on top, two riso plates behind it. */}
        <div className="relative text-[clamp(64px,22vw,340px)]">
          <Wordmark plate data-plate="" className="absolute inset-0 text-burgundy" />
          <Wordmark plate data-plate="" className="absolute inset-0 text-orange-lt" />
          <h1 className="relative">
            <span className="sr-only">bits&amp;bytes™ — India&apos;s boldest builder network</span>
            <Wordmark />
          </h1>
        </div>

        <p
          data-hero-caption=""
          className="mt-[clamp(16px,1.6vw,24px)] pl-[0.4vw] sm:max-w-[48%] font-mono text-[11px] font-bold uppercase leading-[1.5] tracking-[0.16em] sm:text-xs"
        >
          <span className="block">India&apos;s boldest builder network.</span>
          <span className="block">innovate &bull; collaborate &bull; hack</span>
        </p>

        {/* Object slot: the byte (or its static print) centres here and overlaps the type a little. */}
        <div ref={slotRef} className="relative my-[clamp(12px,2vw,28px)] min-h-[28svh] flex-1">
          <StaticByte
            className={cn(
              "absolute left-1/2 top-1/2 hidden h-[118%] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 motion-reduce:block motion-off:block",
              webgl === false && "block",
            )}
          />
        </div>

        <div className="relative z-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-hero-caption="" className="max-w-[34ch] font-serif text-[clamp(16px,1.3vw,19px)] leading-snug">
            <p>Hackathons, build guilds, launches, and communities.</p>
            <p>Fully student-led. Fully independent.</p>
            <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">No adults in the room.</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div data-hero-actions="" className="flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/join">
                  Join the crew
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              </Button>
              <VideoModal src={FILM} title="bits&bytes™ movie">
                <Button variant="outline" size="sm" data-cursor-label="WATCH FILM">
                  <Play aria-hidden className="size-3 fill-current" />
                  Watch film
                </Button>
              </VideoModal>
            </div>
            <Link
              data-hero-actions=""
              href="/prospectus?download=1"
              data-tour="prospectus"
              aria-label="Download the bits&bytes partnership prospectus"
              className="group flex w-full max-w-xs items-center gap-3 border-l-3 border-ink py-1 pl-3 font-mono text-ink transition-colors duration-150 hover:bg-ink/5"
            >
              <FileDown
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-150 ease-riot group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em]">building a partnership?</span>
                <span className="block text-xs font-bold uppercase tracking-[0.08em]">download the 2026 prospectus</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]">pdf</span>
            </Link>
          </div>
        </div>

        {/* Hero footer row (buttermax): dots left, arrow centre, coordinates right. */}
        <div className="relative z-20 mt-[clamp(18px,2.4vw,36px)] grid grid-cols-[1fr_auto_1fr] items-center">
          <span data-hero-actions="">
            <ByteDots />
          </span>
          <button
            data-hero-actions=""
            type="button"
            onClick={toReel}
            aria-label="Scroll to the film"
            className="grid size-11 cursor-pointer place-items-center border-2 border-ink transition-colors duration-150 hover:bg-ink hover:text-orange"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5">
              <path d="M12 3v17M5 13l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </button>
          <span
            data-hero-actions=""
            className="justify-self-end font-mono text-[10px] font-bold uppercase tracking-[0.16em] max-sm:hidden"
          >
            26.8467° N, 80.9462° E
          </span>
        </div>
      </div>

      {/* Riso grain over everything, very quiet. */}
      <span aria-hidden className="halftone pointer-events-none absolute inset-0 z-30 opacity-[0.06] mix-blend-multiply" />
    </section>
  );
}
