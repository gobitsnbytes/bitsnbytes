"use client";

/*
 * HomeHero — buttermax.net's hero, 1:1 in our brand (DESIGN.md "Homepage" 1; tmp/research-full.json → buttermax).
 *
 * Reference moves:
 *  - Full-bleed campaign-colour first viewport (brand burgundy → orange ramp for their #FFD600) with a giant wordmark and
 *    a script accent, a tiny uppercase caption under its left side, and a 3D object floating in front.
 *  - Wordmark draw-on → here: letters rise from a clip mask (45ms stagger), the script "&bytes" wipes in after,
 *    then object → caption → actions. Starts on the loader's "bnb:ready" (or at once if html[data-loaded]) via
 *    whenReady (safety net 3800ms while the intro covers the page, else 1200ms). Skipped when the wordmark is
 *    already on screen, so it never flashes.
 *  - Scroll-velocity RGB split → riso misregistration: ink + orange plates slip up to ±10px with scroll
 *    velocity (gsap.quickTo) and snap back into register at rest.
 *  - Object that outruns the scroll + timed swap → LogoCubeScene (R3F): the cube mark (public/logo.svg) as a real
 *    3D cube, mounted after requestIdleCallback.
 *  - Hero footer row: dots glyph left, down-arrow centre (Lenis scroll to the reel).
 *
 * Reduced motion / motion toggle off: no intro, no plates, no WebGL; the logo mark on a burgundy tile sits in the
 * object slot.
 */

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, FileDown, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FilmPlayer } from "./film-player";
import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { CubeMark } from "@/components/chrome/wordmark";
import { introCovering, whenReady } from "@/components/edition/shared";
import { Wordmark } from "./wordmark";
import { Character } from "@/components/character/character";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LogoCubeScene = dynamic(() => import("./logo-cube-scene"), { ssr: false });

const FILM = "/movie/bnb-trailer.mp4";
const FILM_POSTER = "/movie/bnb-trailer-poster.jpg";
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

/** Static cube for reduced motion / no WebGL: the real mark (public/logo.svg) in paper on a burgundy tile. */
function StaticCube({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("aspect-square place-items-center border-2 border-ink bg-burgundy shadow-riot", className)}
    >
      <CubeMark className="size-[70%] text-paper" />
    </span>
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

  // Intro choreography: wordmark → object → caption → actions. Runs once at mount, and again when the film's
  // end-card handoff (FilmPlayer) opens its iris onto the hero ("bnb:hero-replay").
  useGSAP(
    (_, contextSafe) => {
      const hero = heroRef.current;
      if (!hero || !contextSafe) return;
      const replay = contextSafe(() => {
        if (motionAllowed()) introTimeline(hero).play();
      });
      window.addEventListener("bnb:hero-replay", replay);
      const unlisten = () => window.removeEventListener("bnb:hero-replay", replay);

      // Hide-then-rise only while nothing has shown the wordmark yet: a client-side route mount (hidden before
      // first paint), or the first-visit intro (html[data-loader="on"], set during HTML parse; its CSS failsafe
      // drops the panel at 3.7s).
      const covered = !fromServer.current || (introCovering() && performance.now() < 3700);
      if (!motionAllowed() || !covered) {
        setObjectCue(true);
        return unlisten;
      }

      const tl = introTimeline(hero);
      const cancel = whenReady(() => tl.play());
      return () => {
        unlisten();
        cancel?.();
      };
    },
    { scope: heroRef },
  );

  function introTimeline(hero: HTMLElement) {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      // DOM order is ink plate, orange plate, cream copy: the plates lead by 35ms, a misregistered print pass.
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
      return tl;
  }

  // Scroll: progress for the cube + riso plates driven by scroll velocity.
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

  // Mount the 3D cube at its beat, once the main thread is idle (never competes with the LCP).
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
      data-surface="burgundy"
      data-cinematic-section=""
      data-cinematic-title="the byte"
      className="relative isolate flex min-h-[100svh] flex-col bg-burgundy text-cream"
    >
      {motionOn && sceneOn ? <LogoCubeScene progress={progress} anchor={slotRef} /> : null}

      {/* Brand ramp (AGENTS.md: burgundy into orange warmth for hero surfaces): burgundy under the wordmark, the
          gradient only behind the object slot (never under text), orange under the copy and actions. Every size is
          height-aware so the whole first screen fits short laptop viewports (1280×650 up). */}
      <div className="relative flex flex-1 flex-col">
        <div className="px-[4vw] pt-[clamp(84px,min(9vw,14svh),132px)]">
          {/* Wordmark: the h1 is the text alone (sr-only); the visual is three aria-hidden sibling copies, two riso
              plates behind the cream copy, so the h1's text reads the name once. Knockout = the burgundy surface. */}
          <div className="relative text-[clamp(64px,min(22vw,36svh),340px)] [--wm-knockout:var(--burgundy)]">
            <h1 className="sr-only">bits&amp;bytes™, a teen-led builder network across India</h1>
            <Wordmark plate data-plate="" className="absolute inset-0 text-ink" />
            <Wordmark plate data-plate="" className="absolute inset-0 text-orange" />
            <Wordmark className="relative" />
          </div>

          <p
            data-hero-caption=""
            className="mt-[clamp(12px,min(1.6vw,2svh),24px)] pl-[0.4vw] max-sm:mt-7 sm:max-w-[48%] font-mono text-[11px] font-bold uppercase leading-[1.5] tracking-[0.16em] sm:text-xs"
          >
            <span className="block">A teen-led builder network across India.</span>
            <span className="block">run by teenagers, built to ship</span>
          </p>
        </div>

        {/* Object slot: the cube (or its static mark) centres here, floating over the ramp. */}
        <div
          ref={slotRef}
          className="relative mt-[clamp(8px,2svh,28px)] min-h-[14svh] flex-1 bg-[linear-gradient(to_bottom,var(--burgundy),var(--warm)_58%,var(--orange))]"
        >
          <StaticCube
            className={cn(
              "absolute left-1/2 top-1/2 hidden h-[88%] max-h-[320px] -translate-x-1/2 -translate-y-1/2 motion-reduce:grid motion-off:grid",
              webgl === false && "grid",
            )}
          />
        </div>

        <div
          data-surface="orange"
          className="tone-orange px-[4vw] pb-[clamp(14px,min(3vw,3svh),44px)] pt-[clamp(8px,1.5svh,20px)]"
        >
          {/* The band's orange paints under the cube canvas (z-10); only its content rises above it. */}
          <div className="relative z-20 flex flex-col gap-[clamp(12px,2.4svh,24px)] md:flex-row md:items-end md:justify-between">
            <div data-hero-caption="" className="max-w-[34ch] font-serif text-[clamp(16px,1.3vw,19px)] leading-snug">
              <p>We run hackathons, workshops and launches.</p>
              <p>Student-led, and independent on purpose.</p>
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">No uncs in the room.</p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <div data-hero-actions="" className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href="/join">
                    Join the crew
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </Link>
                </Button>
                <FilmPlayer src={FILM} poster={FILM_POSTER} title="bits&bytes™ movie">
                  <Button variant="outline" size="sm" data-cursor-label="WATCH FILM" data-film-home="">
                    <Play aria-hidden className="size-3 fill-current" />
                    Watch film
                  </Button>
                </FilmPlayer>
              </div>
              <Link
                data-hero-actions=""
                href="/prospectus?download=1"
                aria-label="Download the bits&bytes™ partnership prospectus"
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
          <div className="relative z-20 mt-[clamp(10px,min(2.4vw,2.4svh),36px)] grid grid-cols-[1fr_auto_1fr] items-center">
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
              20.5937° N, 78.9629° E
            </span>
            {/* Points at the scroll arrow from the gap between the cube and the CTAs (both sized by min(vw, svh)). */}
            <Character
              pose="point-down"
              priority
              sizes="(min-width: 1024px) 100px, 0px"
              className="absolute bottom-0 left-[calc(50%+min(21vw,21svh))] hidden w-[min(7vw,13svh)] lg:block"
            />
          </div>
        </div>
      </div>

      {/* Riso grain over everything, very quiet. */}
      <span aria-hidden className="halftone pointer-events-none absolute inset-0 z-30 opacity-[0.06] mix-blend-multiply" />
    </section>
  );
}
