"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Breadcrumbs } from "@/components/breadcrumb";
import { WIDE } from "@/components/chrome/wordmark";
import { pad } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { Window } from "@/components/riot";
import { eventsReel as CLIPS } from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { Barcode, WipeArrow, WipeCell, wipe } from "./barcode";
import { ReelPlayer } from "./player";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HIGHLIGHTS = ["High Agency Shipping", "IIT Kanpur & Delhi Summits", "National Scale Partners"];
/** S.01 "View trailer" (and anything else) opens the player with: detail { index, from }. */
export const WATCH_EVENT = "bnb:events-watch";
export type WatchDetail = { index: number; from: HTMLElement | null };

const PIP_DPR = 1.75;
const FRAME_MS = 1000 / 30;

/*
 * /events hero: inkfish "playlist reel" (tmp/research-full.json → inkfish "Home hero: playlist reel").
 * 100svh ink header; the current clip plays full-bleed in a plain <video> (muted, playsInline, preload
 * metadata for the current item only) with a transform-only 0.5× scroll parallax, and auto-advances on
 * ended. Top: the mono playlist (cols 3–6) — event | 12-stripe barcode | [0N] title →; the now-playing
 * row's stripes fill with playback progress (scale per stripe); a triangle collapses the list to it.
 * Bottom-left: the PiP "monitor", a 340×191 canvas fed by the same <video> (one decode, dpr ≤ 1.75,
 * ≤ 30fps, only while playing), which opens the fullscreen player. Text sits on explicit ink scrim bands.
 * Motion off / reduced motion: posters only, no autoplay, no parallax, no loop.
 */
export function EventsReel() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useRef(true);
  const listId = useId();
  const [index, setIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState<WatchDetail | null>(null);
  const clip = CLIPS[index];

  // 0.5× parallax: the video drifts down half the scroll distance while the header leaves.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!motion || !root) return;
      gsap.to(mediaRef.current, {
        y: () => root.offsetHeight * 0.5,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    },
    { scope: rootRef, dependencies: [motion], revertOnUpdate: true },
  );

  // Muted reel plays only with motion on, in view, tab visible and the player closed.
  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;
    const sync = () => {
      if (motion && inView.current && !document.hidden && !player) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [motion, player, index]);

  // One loop while playing: the now-playing barcode fills with progress, the PiP canvas mirrors the frame.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!playing || !video) return;
    const stripes = Array.from(listRef.current?.querySelectorAll<HTMLElement>(`[data-row="${index}"] [data-stripe]`) ?? []);
    const ctx = canvas?.getContext("2d");
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      const p = video.duration ? (video.currentTime / video.duration) * stripes.length : 0;
      stripes.forEach((el, k) => (el.style.scale = `${Math.min(Math.max(p - k, 0), 1)} 1`));
      // The PiP is display:none below lg; skip drawing there.
      if (canvas && ctx && canvas.offsetParent && video.readyState >= 2) {
        const dpr = Math.min(window.devicePixelRatio || 1, PIP_DPR);
        const w = Math.round(canvas.clientWidth * dpr);
        const h = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        ctx.drawImage(video, 0, 0, w, h);
        canvas.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, index]);

  // Other sections open the player through a window event (S.01 "View trailer").
  useEffect(() => {
    const onWatch = (event: Event) => {
      const detail = (event as CustomEvent<WatchDetail>).detail;
      if (detail && CLIPS[detail.index]) setPlayer(detail);
    };
    window.addEventListener(WATCH_EVENT, onWatch);
    return () => window.removeEventListener(WATCH_EVENT, onWatch);
  }, []);

  const select = (i: number) => {
    if (canvasRef.current) canvasRef.current.style.opacity = "0";
    if (i === index && videoRef.current) videoRef.current.currentTime = 0;
    setIndex(i);
  };

  const watch = (event: MouseEvent<HTMLElement>) => setPlayer({ index, from: event.currentTarget });

  return (
    <section
      ref={rootRef}
      id="event-log"
      data-tour="page-hero"
      data-cinematic-section=""
      data-cinematic-title="the event log"
      data-surface="ink"
      className="tone-ink relative isolate flex min-h-[max(100svh,640px)] flex-col justify-between overflow-hidden"
    >
      <div ref={mediaRef} aria-hidden className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            if (motion) select((index + 1) % CLIPS.length);
          }}
          className="size-full bg-ink object-cover"
        />
      </div>

      {/* Top scrim band: nav clearance, path + kicker | playlist | lede. */}
      <div className="grid gap-x-5 gap-y-5 bg-[linear-gradient(to_bottom,rgb(18_15_10/0.92),rgb(18_15_10/0.82)_calc(100%-var(--fade)),transparent)] px-4 pb-(--fade) pt-24 [--fade:40px] md:px-5 md:pt-28 lg:grid-cols-8 lg:[--fade:72px]">
        <div className="lg:col-span-2">
          <Breadcrumbs items={[{ name: "Events", href: "/events" }]} className="mb-3" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper/85">
            <span className="text-orange">Event Log</span> · GOBITSNBYTES FOUNDATION
          </p>
        </div>

        <div className="relative hidden lg:col-span-4 lg:col-start-3 lg:block">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={listId}
            aria-label={collapsed ? "Show the playlist" : "Collapse the playlist"}
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -left-7 top-0 grid size-6 cursor-pointer place-items-center text-paper"
          >
            <svg
              viewBox="0 0 10 10"
              aria-hidden
              className={cn(
                "size-2.5 fill-current transition-transform duration-300 ease-[cubic-bezier(.25,1,.5,1)] motion-reduce:transition-none motion-off:transition-none",
                collapsed && "-rotate-90",
              )}
            >
              <path d="M0 2h10L5 9z" />
            </svg>
          </button>
          <ol ref={listRef} id={listId} aria-label="Playlist" className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] xl:text-xs">
            {CLIPS.map((item, i) => {
              const current = i === index;
              return (
                <li
                  key={item.src}
                  data-row={i}
                  className={cn("group/row", collapsed && !current && "hidden")}
                  {...wipe}
                >
                  <button
                    type="button"
                    aria-current={current ? "true" : undefined}
                    onClick={() => select(i)}
                    className="grid h-6 w-full cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,1.8fr)] items-stretch gap-x-3 text-left text-paper"
                  >
                    <WipeCell delay={0} duration={200} pad="truncate px-1.5 leading-6">
                      {item.event}
                    </WipeCell>
                    <Barcode progress={current} className="py-1.5" />
                    <WipeCell delay={200} duration={500} pad="flex items-center justify-between gap-2 px-1.5 leading-6">
                      <span className="truncate">
                        <span className={current ? "text-orange group-data-[wipe=in]/row:text-inherit" : undefined}>
                          [{pad(i + 1)}]
                        </span>{" "}
                        {item.title}
                      </span>
                      <WipeArrow shown={current} />
                    </WipeCell>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-2 lg:col-start-7">
          <p
            data-speakable="true"
            data-citation="true"
            className="max-w-[40ch] font-serif text-base leading-snug text-paper md:text-[17px]"
          >
            Hackathons, summits, and workshops where teen builders actually ship things across India.
          </p>
          <ul className="mt-3 font-mono text-[11px] font-bold uppercase leading-[1.8] tracking-[0.08em] text-paper/85">
            {HIGHLIGHTS.map((highlight, i) => (
              <li key={highlight}>
                <span className="text-orange">[{pad(i + 1)}]</span> {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom scrim band: PiP monitor | h1 | Scroll. */}
      <div className="grid items-end gap-5 bg-linear-to-t from-ink via-ink/90 to-transparent px-4 pb-5 pt-16 md:px-5 lg:grid-cols-[340px_minmax(0,1fr)_auto] lg:pt-28">
        <Window
          title={
            <>
              [{pad(index + 1)}] {clip.event}
            </>
          }
          bar="orange"
          bodyClassName="p-0"
          className="hidden w-[340px] shadow-[6px_6px_0_0_var(--shadow-color)] lg:block"
        >
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={watch}
            data-cursor-label={clip.cta}
            className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-ink"
          >
            <Image key={clip.poster} src={clip.poster} alt="" fill sizes="340px" loading="eager" className="object-cover" />
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full opacity-0" />
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 border-2 border-paper bg-ink px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-paper transition-colors duration-150 group-hover:bg-paper group-hover:text-ink group-focus-visible:bg-paper group-focus-visible:text-ink">
              <span aria-hidden>▶</span> {clip.cta}
              <span className="sr-only">
                : {clip.event} — {clip.title}
              </span>
            </span>
          </button>
        </Window>

        <h1
          data-speakable="true"
          className={cn(WIDE, "text-[clamp(32px,3.6vw,72px)] uppercase leading-[0.88] text-paper lg:pb-1")}
        >
          Where code meets <span className="block text-orange">the real world</span>
        </h1>

        <div className="flex items-end justify-between gap-6 lg:justify-end">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={watch}
            className="inline-flex min-h-10 max-w-[70%] cursor-pointer items-center gap-2 border-2 border-paper bg-ink px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-paper lg:hidden"
          >
            <span aria-hidden>▶</span>
            <span>
              {clip.cta}
              <span className="block text-paper/80">
                [{pad(index + 1)}] {clip.event}
              </span>
            </span>
          </button>
          {/* Raised clear of the site-wide Ask button (fixed bottom-right). */}
          <a href="#regional-series" className="group mb-[76px] inline-flex items-end gap-3 text-paper sm:mb-[84px] md:gap-4">
            <span className={cn(WIDE, "text-[28px] leading-none md:text-[40px]")}>Scroll</span>
            <svg viewBox="0 0 12 28" aria-hidden className="h-7 w-3 fill-none stroke-current stroke-2">
              <path d="M6 0v26M1 21l5 5 5-5" />
            </svg>
          </a>
        </div>
      </div>

      <ReelPlayer
        clip={CLIPS[player?.index ?? index]}
        number={(player?.index ?? index) + 1}
        open={player !== null}
        from={player?.from ?? null}
        onClose={() => setPlayer(null)}
      />
    </section>
  );
}
