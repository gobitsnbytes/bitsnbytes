"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { EDITION_GUTTER } from "@/components/edition";
import { useExperience } from "@/components/experience-provider";
import { Button, ScrambleText, Tag, Window } from "@/components/riot";
import { regionalSeriesEvent as event } from "@/lib/events-data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Every line of copy in this chapter is a trailer caption, verbatim.
const [HOOK, PITCH, HEADED, DATES, CLOSER] = event.trailerLines;
const CUT = CLOSER.lastIndexOf(" ") + 1;

// Monitor at rest (the 16:9 video box). At xl it clears the fixed chapter index (left 24px + 220px).
const STAGE_VARS =
  "[--sw:min(calc(100vw_-_32px),1100px,calc((100svh_-_220px)*16/9))] md:[--sw:min(72vw,1100px,calc((100svh_-_220px)*16/9))] xl:[--sw:min(calc(100vw_-_560px),1100px,calc((100svh_-_220px)*16/9))] [--sh:calc(var(--sw)*9/16)]";
// SSR / motion-off: the screen is clipped to the monitor. GSAP takes over with px insets.
const SCREEN_CLIP: CSSProperties = { clipPath: "inset(calc(50% - var(--sh) / 2) calc(50% - var(--sw) / 2))" };
// Global chrome that fades out while the theatre is open: nav + chapter index (desktop and compact).
const CHROME = '[data-tour="navigation"], nav[aria-label="Chapters"], nav[aria-label="Chapters"] ~ button';
const chrome = () => document.querySelectorAll<HTMLElement>(CHROME);

type Inset = [number, number, number, number];
const toClip = ([t, r, b, l]: Inset) => `inset(${t}px ${r}px ${b}px ${l}px)`;

// bfcm attract mode: square bulbs clockwise from the top-left corner, so a stagger reads as a chase.
const ROW = 22;
const COL = 8;
const at = (x: number, y: number): CSSProperties => ({
  left: `calc(${x} * (100% - 10px))`,
  top: `calc(${y} * (100% - 10px))`,
});
const BULBS = [
  ...Array.from({ length: ROW }, (_, i) => at(i / (ROW - 1), 0)),
  ...Array.from({ length: COL - 2 }, (_, i) => at(1, (i + 1) / (COL - 1))),
  ...Array.from({ length: ROW }, (_, i) => at(1 - i / (ROW - 1), 1)),
  ...Array.from({ length: COL - 2 }, (_, i) => at(0, 1 - (i + 1) / (COL - 1))),
];

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  );
}

/**
 * /events ch.01. revelatio CRT zoom: a riot Window "monitor" in a sticky 100svh stage (inside a 250svh
 * track) whose screen opens to full-bleed on scroll (clip-path inset + scale only), playing muted while
 * in view. Click / Enter = bfcm theatre mode: a fixed ink layer grows from the screen rect, the chrome
 * fades and goes inert, the trailer restarts with sound + native controls; Esc / "Go back" reverses.
 * Motion off: static monitor with the poster, theatre opens instantly.
 */
export function RegionalSeries() {
  const { motionEnabled: motion, lenis } = useExperience();
  const root = useRef<HTMLElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bezelRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const theatreVideoRef = useRef<HTMLVideoElement>(null);
  const origin = useRef<Inset>([0, 0, 0, 0]);
  const instant = useRef(false);
  const closing = useRef(false);
  const inView = useRef(false);
  const [theatre, setTheatre] = useState(false);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const bezel = bezelRef.current;
      const screen = screenRef.current;
      const video = videoRef.current;
      if (!motion || !stage || !bezel || !screen || !video) return;
      const q = gsap.utils.selector(root);

      q("[data-rise]").forEach((el) =>
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );

      // End state: cover on landscape screens; full width on portrait phones (keeps the captions in frame).
      const geo = () => {
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        const w = bezel.offsetWidth;
        const h = bezel.offsetHeight;
        return { W, H, w, h, k: W >= H ? Math.max(W / w, H / h) : W / w };
      };
      const rest = () => {
        const { W, H, w, h } = geo();
        return toClip([(H - h) / 2, (W - w) / 2, (H - h) / 2, (W - w) / 2]);
      };
      const full = () => {
        const { W, H, w, h, k } = geo();
        const y = Math.max(0, (H - h * k) / 2);
        const x = Math.max(0, (W - w * k) / 2);
        return toClip([y, x, y, x]);
      };

      gsap
        .timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: zoomRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(screen, { clipPath: rest }, { clipPath: full, duration: 1 }, 0)
        .fromTo([video, bezel], { scale: 1 }, { scale: () => geo().k, duration: 1 }, 0)
        .fromTo(bezel, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0.1)
        .to({}, { duration: 0.4 });

      // Light chase: opacity of each bulb's lit layer only, paused offscreen. Static lit when motion is off.
      gsap
        .timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: q("[data-bulbs]")[0],
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        })
        .fromTo(
          q("[data-lit]"),
          { opacity: 0.12 },
          { opacity: 1, duration: 0.16, ease: "none", stagger: { each: 0.04, yoyo: true, repeat: 1 } },
        );
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  // Muted preview plays only while the stage is on screen (and never with motion off).
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!motion || !video || !stage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !layerRef.current) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [motion]);

  const openTheatre = (e: MouseEvent<HTMLElement>) => {
    const screen = screenRef.current;
    const bezel = bezelRef.current;
    if (layerRef.current || !screen || !bezel) return;
    // Keyboard-initiated actions don't animate.
    instant.current = !motion || e.detail === 0;

    // Visible screen rect: the scrubbed px clip, or the monitor itself when GSAP isn't running.
    const s = screen.getBoundingClientRect();
    const px = screen.style.clipPath.match(/-?[\d.]+(?=px)/g)?.map(Number);
    const m = bezel.getBoundingClientRect();
    const [t, r, b, l] =
      px?.length === 4 ? px : [m.top - s.top, s.right - m.right, s.bottom - m.bottom, m.left - s.left];
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max);
    origin.current = [
      clamp(s.top + t, vh),
      clamp(vw - s.right + r, vw),
      clamp(vh - s.bottom + b, vh),
      clamp(s.left + l, vw),
    ];
    videoRef.current?.pause();
    setTheatre(true);
  };

  // Theatre open: grow the layer, fade + inert everything else, lock scroll, restart with sound.
  // Closing flips `theatre` off, which reverts this context (the close tweens live in it too, so the
  // chrome ends with no inline styles) and runs the cleanup (focus returns to Play).
  const { contextSafe } = useGSAP(
    () => {
      const layer = layerRef.current;
      const video = theatreVideoRef.current;
      if (!theatre || !layer || !video) return;
      const duration = instant.current ? 0 : 0.7;
      const html = document.documentElement;
      const overflow = html.style.overflow;
      const others = Array.from(document.body.children).filter(
        (el): el is HTMLElement => el instanceof HTMLElement && el !== layer && !el.inert,
      );
      others.forEach((el) => (el.inert = true));
      html.style.overflow = "hidden";
      lenis?.stop();

      gsap.fromTo(layer, { clipPath: toClip(origin.current) }, { clipPath: toClip([0, 0, 0, 0]), duration, ease: "power4.out" });
      gsap.to(chrome(), { autoAlpha: 0, duration: duration && 0.5 });

      // The click that opened the theatre is the user activation for sound.
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => {});
      video.focus({ preventScroll: true });

      return () => {
        others.forEach((el) => (el.inert = false));
        html.style.overflow = overflow;
        lenis?.start();
        playRef.current?.focus({ preventScroll: true });
        if (inView.current && motion) videoRef.current?.play().catch(() => {});
      };
    },
    { dependencies: [theatre], revertOnUpdate: true },
  );

  const closeTheatre = contextSafe((keyboard: boolean) => {
    const layer = layerRef.current;
    if (!layer || closing.current) return;
    theatreVideoRef.current?.pause();
    const done = () => {
      closing.current = false;
      setTheatre(false);
    };
    if (keyboard || !motion) return done();
    closing.current = true;
    gsap.to(chrome(), { autoAlpha: 1, duration: 0.4 });
    gsap.to(layer, { clipPath: toClip(origin.current), duration: 0.6, ease: "power3.inOut", onComplete: done });
  });

  useEffect(() => {
    if (!theatre) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closeTheatre(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [theatre, closeTheatre]);

  return (
    <section
      ref={root}
      id={event.id}
      data-cinematic-section=""
      data-cinematic-title={event.title}
      data-chapter-number="01"
      data-surface="ink"
      className="tone-ink relative overflow-x-clip"
    >
      <div className={cn("px-4 pb-12 pt-24 md:px-8 md:pb-20 md:pt-32", EDITION_GUTTER)}>
        <div className="flex flex-wrap items-center gap-3">
          <ScrambleText
            as="p"
            text="§01 — Trailer"
            className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange"
          />
          <Tag tone="orange">{event.statusLabel}</Tag>
        </div>
        <h2
          data-rise
          className={cn(WIDE, "mt-5 break-words text-[clamp(40px,10.5vw,176px)] uppercase leading-[0.85] text-cream")}
        >
          {event.title}
        </h2>
        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
          <p data-rise className="font-serif text-[clamp(28px,3.8vw,60px)] italic leading-[1.05] tracking-[-0.02em] text-cream">
            {HOOK}
          </p>
          <p data-rise className="max-w-[38ch] font-serif text-lg text-cream/85 md:text-xl">
            {PITCH}
          </p>
        </div>
      </div>

      <div ref={zoomRef} className="relative h-[250svh] motion-reduce:h-auto motion-off:h-auto">
        <div
          ref={stageRef}
          className={cn(
            "sticky top-0 h-svh min-h-[480px] overflow-clip motion-reduce:relative motion-off:relative",
            STAGE_VARS,
          )}
        >
          <div ref={bezelRef} aria-hidden className="pointer-events-none absolute inset-0 m-auto h-(--sh) w-(--sw)">
            <Window
              title={`${event.title} — Trailer`}
              bar="orange"
              className="absolute -inset-x-[3px] -bottom-[3px] bg-transparent"
              bodyClassName="h-(--sh) p-0"
            />
          </div>

          {/* Pointer shortcut for the Play button below; clip-path limits hits to the visible screen. */}
          <div
            ref={screenRef}
            data-cursor-label="PLAY TRAILER"
            onClick={openTheatre}
            className="absolute inset-0 cursor-pointer"
            style={SCREEN_CLIP}
          >
            <video
              ref={videoRef}
              src={event.trailerSrc}
              poster={event.posterSrc}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 m-auto h-(--sh) w-(--sw) max-w-none bg-ink object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(18_15_10/0.22)_0_1px,transparent_1px_4px)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-[340px] bg-linear-to-r from-ink/80 to-transparent xl:block"
            />
          </div>

          <Button
            ref={playRef}
            variant="orange"
            aria-haspopup="dialog"
            onClick={openTheatre}
            className="absolute bottom-5 right-4 md:bottom-8 md:right-8"
          >
            <PlayGlyph />
            Play trailer
          </Button>
        </div>
      </div>

      <div className={cn("px-4 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28", EDITION_GUTTER)}>
        <p data-rise className={cn(WIDE, "break-words text-[clamp(40px,8.4vw,144px)] uppercase leading-[0.86] text-cream")}>
          {CLOSER.slice(0, CUT)}
          <span className="text-orange">{CLOSER.slice(CUT)}</span>
        </p>

        <div data-bulbs className="relative mt-14 max-w-[1100px] p-[18px] md:mt-20">
          <div aria-hidden className="pointer-events-none absolute inset-[4px]">
            {BULBS.map((style, i) => (
              <span key={i} className="absolute size-2.5 border-2 border-ink bg-burgundy-dk" style={style}>
                <span data-lit className="absolute inset-0 bg-orange" />
              </span>
            ))}
          </div>
          <div className="relative border-3 border-cream p-6 md:p-12">
            <Tag tone="orange">{event.statusLabel}</Tag>
            <h3 className="mt-6 font-display text-[clamp(56px,10vw,168px)] uppercase leading-[0.84] text-cream">
              {event.finaleVenueLabel} <span className="text-orange">·</span> {event.finaleDateLabel}
            </h3>
            <div className="mt-8 grid gap-4 font-serif text-lg text-cream md:grid-cols-2 md:gap-10 md:text-xl">
              <p>{HEADED}</p>
              <p>{DATES}</p>
            </div>
            <Button asChild variant="orange" size="lg" className="mt-10">
              <Link href="/join">Join the crew</Link>
            </Button>
          </div>
        </div>
      </div>

      {theatre
        ? createPortal(
            <div
              ref={layerRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${event.title} trailer`}
              data-lenis-prevent
              className="tone-ink fixed inset-0 z-[300] flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
                  §01 — {event.title}
                </p>
                <Tag tone="orange">{event.statusLabel}</Tag>
              </div>
              <div className="relative min-h-0 flex-1 px-4 md:px-8">
                <video
                  ref={theatreVideoRef}
                  src={event.trailerSrc}
                  poster={event.posterSrc}
                  controls
                  playsInline
                  preload="auto"
                  className="size-full bg-ink object-contain"
                />
              </div>
              <div className="flex justify-center px-4 pb-10 pt-6">
                <Button variant="acid" onClick={(e) => closeTheatre(e.detail === 0)}>
                  Go back (Esc)
                </Button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
