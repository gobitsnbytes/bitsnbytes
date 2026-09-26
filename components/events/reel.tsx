"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Breadcrumbs } from "@/components/breadcrumb";
import { WIDE } from "@/components/chrome/wordmark";
import { pad, whenReady } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { eventsReel as CLIPS } from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { Barcode, WipeArrow, WipeCell, wipe } from "./barcode";
import { GRADIENT, ReelPlayer } from "./player";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HIGHLIGHTS = ["Workshops inside hackathons", "Next finale: IIT Bombay", "Backing global online hacks"];
/** S.01 "View trailer" (and anything else) opens the player with: detail { index, from, start? }. */
export const WATCH_EVENT = "bnb:events-watch";
export type WatchDetail = { index: number; from: HTMLElement | null; start?: number };

const FRAME_MS = 1000 / 30;
const DWELL_MS = 1000;
const HOVER_MS = 600;
/** No scroll input for this long while the reel is on screen: the preview's sound fades in, in place. */
const IDLE_MS = 2000;
const FADE_IN_MS = 1500;
const FADE_OUT_MS = 400;
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);
/** off: muted preview · hint: sound needs a gesture ("Tap for sound") · on: listening · muted: the visitor said no. */
type Sound = "off" | "hint" | "on" | "muted";
/** Chrome dims / returns gently. */
const EASE = "transition-opacity duration-700 ease-in-out motion-reduce:transition-none motion-off:transition-none";
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

/*
 * /events hero: inkfish "playlist reel" (tmp/research-full.json → inkfish "Home hero: playlist reel").
 * 100svh ink header; the current clip sits full-bleed in a plain <video> (muted, playsInline, preload
 * metadata for the current item only, poster first) with a transform-only 0.5× scroll parallax, and
 * auto-advances on ended. The muted preview starts once the visitor stays: ~1s in view or ~600ms of
 * mouse hover. The whole reel is the play button: it opens the fullscreen player with sound, from the
 * preview's current time. Top: the mono playlist (cols 3–6) — event | 12-stripe barcode | [0N] title →;
 * the now-playing row's stripes fill with playback progress; a triangle collapses the list to it.
 * Text sits on explicit ink scrim bands. Motion off / reduced motion: posters only, no autoplay,
 * no parallax, no loop; click still plays.
 * Listening (Netflix billboard): once the intro loader is done, if the visitor gives no scroll input (wheel, touch,
 * scroll keys, any scroll incl. Lenis) for IDLE_MS while the reel fills most of the screen, the tab is visible and no
 * dialog is open, the SAME preview keeps playing and its sound fades in (volume 0 → 1, rAF), the chrome dims and a
 * speaker toggle appears. Any scroll input fades it back out (never blocking the scroll); still again re-arms, unless
 * the toggle muted it. No gesture on the page yet: the toggle shows "Tap for sound" and the first tap/key enters.
 * Gradient clips (the documentary) morph in place into a framed video on the brand gradient while listening.
 */
export function EventsReel() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const inView = useRef(true);
  const armed = useRef(false);
  const listId = useId();
  const [index, setIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState<WatchDetail | null>(null);
  const [ready, setReady] = useState(false);
  const [sound, setSoundState] = useState<Sound>("off");
  const soundRef = useRef<Sound>("off");
  const ramp = useRef(0);
  const clip = CLIPS[index];

  useEffect(() => whenReady(() => setReady(true)), []);

  const setSound = (next: Sound) => {
    soundRef.current = next;
    setSoundState(next);
  };
  // Eases video.volume to `to` over `ms` (rAF), then runs `done`. A newer ramp cancels the old one.
  const fade = (video: HTMLVideoElement, to: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(ramp.current);
    const from = video.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      video.volume = from + (to - from) * easeInOut(p);
      if (p < 1) ramp.current = requestAnimationFrame(step);
      else done?.();
    };
    ramp.current = requestAnimationFrame(step);
  };
  // Sound in, in place: volume 0 before unmuting so nothing pops. iOS ignores volume: plain unmute there.
  const listen = () => {
    const video = videoRef.current;
    if (!video) return;
    setSound("on");
    if (video.muted) {
      video.volume = 0;
      video.muted = false;
      if (video.volume !== 0) return;
    }
    fade(video, 1, FADE_IN_MS);
  };
  // Back to the muted preview. A visitor's own mute ("muted") survives scrolls and re-arms.
  const hush = (ms: number, next: Sound = "off") => {
    const video = videoRef.current;
    setSound(soundRef.current === "muted" && next === "off" ? "muted" : next);
    cancelAnimationFrame(ramp.current);
    if (!video || video.muted) return;
    if (!ms) video.muted = true;
    else fade(video, 0, ms, () => (video.muted = true));
  };

  // Listening (see above). Every scroll input fades out and re-arms the timer; a failed check at fire time re-arms.
  useEffect(() => {
    if (!motion || !ready || player) return;
    let timer = 0;
    // Not a moment for sound: tab hidden, a dialog (console, menu, cookies) open, preview paused, reel mostly gone.
    const away = () => {
      const root = rootRef.current;
      const video = videoRef.current;
      if (!root || !video) return true;
      const r = root.getBoundingClientRect();
      const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      const covered = document.hidden || document.querySelector('[role="dialog"], [role="alertdialog"]');
      return Boolean(covered || video.paused || shown < Math.min(r.height, window.innerHeight) * 0.6);
    };
    const fire = () => {
      if (away()) return arm();
      if (soundRef.current === "muted") return;
      if (navigator.userActivation?.hasBeenActive === false) setSound("hint");
      else listen();
    };
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, IDLE_MS);
    };
    const stir = () => {
      arm();
      if (soundRef.current === "on" || soundRef.current === "hint") hush(FADE_OUT_MS);
    };
    // "Tap for sound": the first tap or key that isn't another control (or a scroll key) turns it on.
    const poke = (event: Event) => {
      if (soundRef.current !== "hint") return;
      if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea, [role='dialog']")) return;
      listen();
    };
    const key = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) stir();
      else if (event.key !== "Escape" && event.key !== "Tab") poke(event);
    };
    const visible = () => (document.hidden ? hush(0) : arm());
    const opts = { passive: true, capture: true };
    arm();
    // Listening watchdog: a dialog opening (or anything in away()) without scroll input also ends it.
    const watchdog = window.setInterval(() => soundRef.current === "on" && away() && stir(), 500);
    window.addEventListener("wheel", stir, opts);
    window.addEventListener("touchmove", stir, opts);
    window.addEventListener("scroll", stir, opts);
    window.addEventListener("keydown", key, true);
    window.addEventListener("pointerdown", poke, true);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(watchdog);
      window.removeEventListener("wheel", stir, opts);
      window.removeEventListener("touchmove", stir, opts);
      window.removeEventListener("scroll", stir, opts);
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("pointerdown", poke, true);
      document.removeEventListener("visibilitychange", visible);
      // Player opening, clip change, motion off: straight back to the muted preview.
      hush(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listen/hush only touch refs and state setters
  }, [motion, ready, player, index]);

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

  // Muted preview plays only with motion on, once armed (the visitor stayed), in view, tab visible and
  // the player closed. Armed after DWELL_MS in view (reset on leaving) or HOVER_MS of mouse hover.
  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;
    let dwell = 0;
    let hover = 0;
    const sync = () => {
      if (motion && armed.current && inView.current && !document.hidden && !player) video.play().catch(() => {});
      else video.pause();
    };
    const arm = () => {
      armed.current = true;
      sync();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      window.clearTimeout(dwell);
      if (!entry.isIntersecting) armed.current = false;
      else if (!armed.current) dwell = window.setTimeout(arm, DWELL_MS);
      sync();
    });
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !armed.current) hover = window.setTimeout(arm, HOVER_MS);
    };
    const leave = () => window.clearTimeout(hover);
    io.observe(root);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      window.clearTimeout(dwell);
      window.clearTimeout(hover);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [motion, player, index]);

  // Page-wide: one <video> at a time. Any play (reel, player, archive files) pauses every other video.
  useEffect(() => {
    const solo = (event: Event) =>
      document.querySelectorAll("video").forEach((video) => video !== event.target && video.pause());
    document.addEventListener("play", solo, true);
    return () => document.removeEventListener("play", solo, true);
  }, []);

  // While playing, the now-playing barcode fills with progress.
  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    const stripes = Array.from(listRef.current?.querySelectorAll<HTMLElement>(`[data-row="${index}"] [data-stripe]`) ?? []);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      const p = video.duration ? (video.currentTime / video.duration) * stripes.length : 0;
      stripes.forEach((el, k) => (el.style.scale = `${Math.min(Math.max(p - k, 0), 1)} 1`));
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

  // Picking a playlist row is intent: the preview starts at once (motion on).
  const select = (i: number) => {
    armed.current = true;
    const video = videoRef.current;
    if (i === index && video) {
      video.currentTime = 0;
      if (motion) video.play().catch(() => {});
    }
    setIndex(i);
  };

  // Full-screen with sound, continuing from where the preview is.
  const watch = (event: MouseEvent<HTMLElement>) =>
    setPlayer({ index, from: event.currentTarget, start: videoRef.current?.currentTime });

  const listening = sound === "on";
  const framed = listening && clip.mode === "gradient";
  const dim = listening && "opacity-50";

  return (
    <section
      ref={rootRef}
      id="event-log"
      data-tour="page-hero"
      data-cinematic-section=""
      data-cinematic-title="The event log"
      data-surface="ink"
      className="tone-ink relative isolate flex min-h-[max(100svh,640px)] flex-col justify-between overflow-hidden"
    >
      <div ref={mediaRef} aria-hidden className="absolute inset-0 -z-10">
        {clip.mode === "gradient" ? (
          <div className={cn("absolute inset-0 overflow-hidden bg-burgundy opacity-0", EASE, framed && "opacity-100")}>
            <div className="absolute -inset-1/4" style={GRADIENT} />
            <div className="halftone absolute inset-0 opacity-25 mix-blend-multiply" />
            <div className="dither absolute inset-0 opacity-60" />
          </div>
        ) : null}
        <div
          className={cn(
            "absolute inset-0 transition-[scale,box-shadow] duration-900 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none motion-off:transition-none",
            framed && "scale-[0.62] shadow-[16px_16px_0_0_var(--ink)]",
          )}
        >
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
      </div>

      {/* Top scrim band: nav clearance, path + kicker | playlist | lede. Controls sit above the play layer.
          While listening the band (its own layer, so the z-10 controls stay above the play button) and text dim. */}
      <div className="relative grid gap-x-5 gap-y-5 px-4 pb-(--fade) pt-24 [--fade:40px] md:px-5 md:pt-[clamp(88px,13svh,112px)] lg:grid-cols-8 lg:[--fade:72px]">
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(18_15_10/0.92),rgb(18_15_10/0.82)_calc(100%-var(--fade)),transparent)]",
            EASE,
            listening && "opacity-30",
          )}
        />
        <div className="lg:col-span-2">
          <Breadcrumbs items={[{ name: "Events", href: "/events" }]} className="relative z-10 mb-3" />
          <p className={cn("font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper/85", EASE, dim)}>
            <span className="text-orange">Event log</span> · bits&bytes™
          </p>
        </div>

        <div
          className={cn(
            "relative z-10 hidden lg:col-span-4 lg:col-start-3 lg:block",
            EASE,
            listening && "opacity-50 focus-within:opacity-100 hover:opacity-100",
          )}
        >
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

        <div className={cn("lg:col-span-2 lg:col-start-7", EASE, dim)}>
          <p
            data-speakable="true"
            data-citation="true"
            className="max-w-[40ch] font-serif text-base leading-snug text-paper md:text-[17px]"
          >
            Hackathons across India where teenagers ship real things, with the workshops run inside them.
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

      {/*
       * The reel itself is the play target: a transparent full-area button painted over the scrim bands
       * (positioned, so it stacks above them), under the z-10 controls. Clicks on the h1 / lede pass to it.
       */}
      <button
        ref={playRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={`Play ${clip.event}: ${clip.title}`}
        data-cursor-label="[Play]"
        onClick={watch}
        className="absolute inset-0 cursor-pointer focus-visible:outline-offset-[-6px]"
      />

      {/* Bottom scrim band: h1 | Scroll (the sound toggle sits just above Scroll). */}
      <div className="relative grid items-end gap-5 px-4 pb-5 pt-16 md:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-[clamp(40px,12svh,112px)]">
        <div
          aria-hidden
          className={cn("absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/90 to-transparent", EASE, listening && "opacity-40")}
        />
        <button
          type="button"
          aria-pressed={listening}
          onClick={() => (listening ? hush(FADE_OUT_MS, "muted") : listen())}
          className={cn(
            "absolute bottom-5 left-4 z-10 inline-flex lg:bottom-[88px] lg:left-auto lg:right-5 h-10 cursor-pointer items-center gap-2 border-2 border-paper bg-ink px-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper transition-[opacity,visibility,background-color,color] duration-500 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink aria-pressed:bg-orange aria-pressed:text-ink motion-reduce:transition-none motion-off:transition-none",
            sound === "off" && "invisible opacity-0",
            sound === "hint" && "opacity-80",
          )}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
            <path d="M3 9h4l5-4v14l-5-4H3z" />
            {listening ? (
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" className="fill-none stroke-current stroke-2" />
            ) : (
              <path d="M16 9l6 6M22 9l-6 6" className="fill-none stroke-current stroke-2" />
            )}
          </svg>
          {sound === "hint" ? "Tap for sound" : listening ? "Sound on" : "Sound off"}
        </button>
        <h1
          data-speakable="true"
          className={cn(WIDE, "text-[clamp(32px,3.6vw,72px)] uppercase leading-[0.88] text-paper lg:pb-1", EASE, dim)}
        >
          Hackathons we run <span className="block text-orange">and the ones we back</span>
        </h1>

        <a
          href="#regional-series"
          className="group relative z-10 inline-flex items-end gap-3 justify-self-end text-paper md:gap-4"
        >
          <span className={cn(WIDE, "text-[28px] leading-none md:text-[40px]")}>Scroll</span>
          <svg viewBox="0 0 12 28" aria-hidden className="h-7 w-3 fill-none stroke-current stroke-2">
            <path d="M6 0v26M1 21l5 5 5-5" />
          </svg>
        </a>
      </div>

      <ReelPlayer
        clip={CLIPS[player?.index ?? index]}
        number={(player?.index ?? index) + 1}
        open={player !== null}
        from={player?.from ?? null}
        start={player?.start}
        onClose={(time) => {
          // Back from fullscreen, the preview carries on from where the viewer stopped (same clip only).
          if (time !== undefined && player?.index === index && videoRef.current) videoRef.current.currentTime = time;
          setPlayer(null);
        }}
      />
    </section>
  );
}
