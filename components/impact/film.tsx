"use client";

/*
 * ImpactFilm — /impact's opener plays cool-video.mp4 in place, Netflix style, and the film's black end card morphs
 * back into the opener. Rendered inside EditionOpener's sticky stage: above the duotone art, under the construction
 * lines, frame and title, so the opener's own drawing can land on the film's picture.
 *
 * Billboard: the opener as it is, plus a "▶ Play trailer · 0:19" chip under the frame whose ring fills while the
 * visitor stays still at the very top of the page (useDwell, 2 s, once per session). The chip always plays it.
 * Theatre (in place, the scroll is never locked):
 *   open   the title, frame border and lines step back, a black layer fills the frame and opens to full-bleed
 *          (0.7 s, the art's own --fw/--fh clip), the ident ("ta-dum"), then the film from 0, sound ramping in.
 *   leave  scroll intent / Esc / Exit: the sound fades (400 ms), the layer closes back into the frame and fades,
 *          the opener comes back exactly as it was (the drawn lines stay drawn) and the scroll scrub carries on.
 * Morph, frame-accurate on the film's media time (watchFrames; cue sheet below):
 *   15.42   the white cube slams in: the opener's construction lines, scaled onto the film's cube, draw out of it
 *           group by group (impact, then shimmer); the controls leave for the rest of the film.
 *   16.42   the cube fades out of the film: the lines stay, framing the empty hexagon.
 *   16.75   "BITS&BYTES" wipes on; the frame's top and bottom rules draw out from the centre with it (its sides
 *           wait for the end, so they never cut through the letters).
 *   18.875  the end: the film dissolves, the frame closes its sides, the lines ease back to the opener's scale,
 *           the title rises into the frame letter by letter (land), the chapters settle in (resolve).
 * Motion off / reduced motion: no dwell, ident or morph; the chip opens a plain full-screen player with native
 * controls.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type RefObject,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import { playIdent } from "@/components/cinema/ident";
import {
  fadeVolume,
  filmRect,
  hasSeen,
  markSeen,
  playWithSound,
  setTheatre,
  useDwell,
  watchFrames,
} from "@/components/cinema/theatre";
import { play } from "@/components/chrome/sound/engine";
import { WIDE } from "@/components/chrome/wordmark";
import { useExperience } from "@/components/experience-provider";
import { Button } from "@/components/riot";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, SplitText);

const FILM = "/movie/cool-video.mp4";
const POSTER = "/movie/cool-video-poster.jpg";

// cool-video.mp4 cue points (24 fps, 18.875 s), measured from its frames (tmp/films/cool_*.jpg). Re-measure if the
// edit changes timing.
const CUBE_IN = 15.42; // the cube slams in (overshoots ~1.2× at 15.5, settled by 15.67)
const WORD_IN = 16.75; // "BITS&BYTES" starts its left → right wipe…
const WORD_DONE = 18.5; // …and is complete
const END = 18.875;
// The settled cube inside the frame: hexagon centre and height as fractions of the frame.
const CUBE = { cx: 0.5016, cy: 0.5042, h: 0.6009 };
// GROUPS draw order out of the cube: hexagon, Y, rhombi (on the cube itself), then rings, diagonals, lattice.
// Every stroke-dash tween / set says autoRound: false: GSAP rounds px CSS values, which snaps a pathLength=1 stroke
// from hidden to drawn at the halfway mark instead of drawing it.
const DRAW = [2, 3, 4, 0, 1, 5];

// The black layer's window, from the same variables as the opener's ART_CLIP: --q 0 = the frame, 1 = full-bleed.
// --q falls back to 0 so a cleared (or reverted) inline value leaves the layer closed, never unclipped.
const LAYER_CLIP = {
  clipPath: "inset(calc((50% - var(--fh) / 2) * (1 - var(--q, 0))) calc((50% - var(--fw) / 2) * (1 - var(--q, 0))))",
} as CSSProperties;

const CTRL =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-2 border-2 border-paper bg-black/60 px-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper transition-colors duration-150 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink";

// The encode carries a 36px (of 1920×1080) red rim on every edge, plus 2px of chroma bleed and 2px of margin for the
// browser's scaling filter. We fit the picture inside it and clip the rim away, so the black end card really is
// black edge to edge. Set 0 if the rim ever goes.
const RIM = 40;

/**
 * Where the full 1920×1080 frame paints inside the stage `box` (px, relative to it): the picture inside the rim covers
 * landscape stages and is letterboxed on portrait ones (filmRect's call), and `rim` is the px to clip on each edge.
 */
function framing(box: DOMRect) {
  const k = (filmRect(box).cover ? Math.max : Math.min)(box.width / (1920 - 2 * RIM), box.height / (1080 - 2 * RIM));
  const width = 1920 * k;
  const height = 1080 * k;
  return { left: (box.width - width) / 2, top: (box.height - height) / 2, width, height, rim: RIM * k };
}

/** px per viewBox unit of the opener's lines (viewBox -800 -500 1600 1000, slice). */
const unitOf = (box: DOMRect) => Math.max(box.width / 1600, box.height / 1000);

/** The [data-lines] transform that lays the opener's R = 300 drawing on the film's cube. */
function onCube(box: DOMRect) {
  const film = framing(box);
  return {
    scale: (CUBE.h * film.height) / (600 * unitOf(box)),
    x: film.left + CUBE.cx * film.width - box.width / 2,
    y: film.top + CUBE.cy * film.height - box.height / 2,
  };
}

/**
 * Dash length that spans a whole line at `scale`. Chrome sizes pathLength=1 dashes in user units but strokes
 * non-scaling-stroke paths in screen px, so past 1px per unit the opener's dasharray of 1 stops short of the path's
 * end (and "hidden" leaks its tail). Ours reaches, and eases back to 1 as the lines settle.
 */
const reach = (box: DOMRect, scale = 1) => Math.max(1, unitOf(box) * Math.max(1, scale));

type Phase = "idle" | "opening" | "film" | "morph" | "closing";
const noop = () => () => {};

export function ImpactFilm() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const phase = useRef<Phase>("idle");
  const api = useRef({ enter: () => {}, exit: () => {}, ended: () => {} });
  const idleTimer = useRef(0);
  const refocus = useRef(false);
  const [theatre, setTheatreOn] = useState(false);
  // Controls stay out of the picture during the ident and the end card, whatever the pointer does.
  const [bare, setBare] = useState(true);
  const [idle, setIdle] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [plain, setPlain] = useState(false);
  const [atTop, setAtTop] = useState(true);
  // Server / first paint: treat it as seen (never arm before we can read the session).
  const seen = useSyncExternalStore(noop, () => hasSeen(FILM), () => true);

  const poke = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
  }, []);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const stage = root?.parentElement;
      const layer = layerRef.current;
      const video = videoRef.current;
      if (!motion || !contextSafe || !root || !stage || !layer || !video) return;
      const q = gsap.utils.selector(stage);
      const [pos] = q<HTMLElement>("[data-content-pos]");
      const [border] = q<HTMLElement>("[data-frame-border]");
      const [lines] = q<SVGSVGElement>("[data-lines]");
      const [h1] = q<HTMLElement>("[data-content] h1");
      const rows = q("[data-li]");
      const paths = q("[data-lines] path");
      const groups = q("[data-lines] [data-group]");
      const drawGroups = DRAW.map((g) => groups[g]?.querySelectorAll("path") ?? []);
      if (!pos || !border || !lines) return;

      let run: {
        tl?: gsap.core.Timeline;
        draw?: gsap.core.Timeline;
        rule?: gsap.core.Tween;
        ident?: { kill: () => void };
        frames?: () => void;
        split?: SplitText;
      } = {};
      let beats = { cube: false, word: false };

      const halt = () => {
        run.ident?.kill();
        run.frames?.();
        run.tl?.kill();
        run.draw?.kill();
        run.rule?.kill();
        run.split?.revert();
        run = {};
      };
      // Paint the frame where framing() says (cover / letterboxed, rim clipped), so the lines can find the cube.
      const fit = () => {
        const box = root.getBoundingClientRect();
        const { rim, ...rect } = framing(box);
        gsap.set(video, { ...rect, clipPath: `inset(${rim}px)` });
        if (beats.cube && phase.current === "film") gsap.set(lines, onCube(box));
      };
      const lightsUp = () => {
        setTheatre(false);
        setTheatreOn(false);
        setBlocked(false);
        window.removeEventListener("resize", fit);
        if (layer.contains(document.activeElement)) refocus.current = true;
      };

      // End: the film dissolves into the opener. Frame sides close, lines ease home, the title rises, rows settle.
      const morph = contextSafe(() => {
        if (phase.current !== "film") return;
        phase.current = "morph";
        run.frames?.();
        run.draw?.progress(1);
        run.split = h1 ? SplitText.create(h1, { type: "lines,chars", mask: "lines" }) : undefined;
        run.tl = gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              run.split?.revert();
              run = {};
              gsap.set([pos, ...rows], { clearProps: "opacity,visibility,transform" });
              gsap.set(border, { clearProps: "opacity,clipPath" });
              gsap.set(lines, { clearProps: "transform" });
              gsap.set(paths, { clearProps: "strokeDasharray" });
              gsap.set(layer, { clearProps: "opacity,visibility,--q" });
              video.pause();
              phase.current = "idle";
            },
          })
          .to(layer, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0)
          .to(border, { opacity: 1, clipPath: "inset(0px 0px 0px 0px)", duration: 0.3, overwrite: "auto" }, 0.1)
          .to(lines, { x: 0, y: 0, scale: 1, duration: 1.1, ease: "power3.inOut" }, 0)
          // (drawn already, unless the frame callbacks missed the cube: a hidden tab only hears "ended")
          .to(paths, { strokeDashoffset: 0, strokeDasharray: 1, duration: 1.1, ease: "power3.inOut", autoRound: false }, 0)
          .to(pos, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 0.2)
          .fromTo(rows, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 }, 0.75)
          // lights up before the last two cues, so they play unducked
          .call(lightsUp, undefined, 0.5)
          .call(() => play("land"), undefined, 0.6)
          .call(() => play("resolve"), undefined, 1.3);
        if (run.split) {
          run.tl.fromTo(
            run.split.chars,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.75, stagger: 0.022, ease: "expo.out" },
            0.2,
          );
        }
      });

      // 15.42: the lines land on the film's cube and draw out of it, group by group.
      const cube = contextSafe(() => {
        beats.cube = true;
        setBare(true);
        play("impact");
        const box = root.getBoundingClientRect();
        const fitted = onCube(box);
        const span = reach(box, fitted.scale);
        gsap.set(lines, fitted);
        gsap.set(paths, { strokeDasharray: span, strokeDashoffset: span, autoRound: false });
        run.draw = gsap.timeline().call(() => play("shimmer"), undefined, 0.2);
        drawGroups.forEach((group, i) =>
          run.draw?.fromTo(
            group,
            { strokeDashoffset: span },
            { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", overwrite: "auto", autoRound: false },
            i * 0.1,
          ),
        );
      });

      // 16.75: the frame's top and bottom rules draw out from the centre with the wordmark's wipe (px insets: GSAP
      // can't tween % into px).
      const word = contextSafe(() => {
        beats.word = true;
        const half = border.offsetWidth / 2;
        run.rule = gsap.fromTo(
          border,
          { opacity: 0, clipPath: `inset(0px ${half}px 0px ${half}px)` },
          { opacity: 1, clipPath: "inset(0px 1px 0px 1px)", duration: WORD_DONE - WORD_IN, ease: "sine.inOut" },
        );
      });

      const roll = () => {
        if (phase.current !== "opening") return;
        phase.current = "film";
        run.ident = undefined;
        setBare(false);
        beats = { cube: false, word: false };
        video.currentTime = 0;
        video.volume = 1; // a muted start keeps it: "Tap for sound" then unmutes at full level
        void playWithSound(video).then((audible) => phase.current === "film" && setBlocked(!audible));
        poke();
        run.frames = watchFrames(video, (time) => {
          if (barRef.current && video.duration) barRef.current.style.scale = `${Math.min(time / video.duration, 1)} 1`;
          if (!beats.cube && time >= CUBE_IN) cube();
          if (!beats.word && time >= WORD_IN) word();
          if (time >= END - 0.05) morph();
        });
      };

      const enter = contextSafe(() => {
        if (phase.current !== "idle") return;
        phase.current = "opening";
        markSeen(FILM);
        setTheatreOn(true);
        setBare(true);
        video.preload = "auto";
        fit();
        window.addEventListener("resize", fit);
        const focused = stage.contains(document.activeElement);
        play("whoosh");
        const span = reach(root.getBoundingClientRect());
        gsap.set(paths, { strokeDasharray: span, autoRound: false });
        gsap.set(layer, { "--q": 0, opacity: 0, visibility: "visible" });
        run.tl = gsap
          .timeline()
          .to(pos, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
          .to(border, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0)
          .to(
            paths,
            {
              strokeDashoffset: span,
              duration: 0.45,
              ease: "power2.in",
              stagger: { each: 0.01, from: "end" },
              overwrite: "auto",
              autoRound: false,
            },
            0,
          )
          .to(layer, { opacity: 1, duration: 0.2, ease: "none" }, 0)
          .to(layer, { "--q": 1, duration: 0.7, ease: "power3.inOut" }, 0.15)
          .call(() => setTheatre(true), undefined, 0.35)
          .call(
            () => {
              const ident = playIdent(layer);
              run.ident = ident;
              void ident.done.then(roll);
            },
            undefined,
            0.85,
          );
        if (focused) exitRef.current?.focus({ preventScroll: true });
      });

      const exit = contextSafe(() => {
        if (phase.current === "morph") return void run.tl?.progress(1);
        if (phase.current !== "opening" && phase.current !== "film") return;
        phase.current = "closing";
        halt();
        lightsUp();
        play("close");
        if (!video.paused) fadeVolume(video, 0, 400, () => video.pause());
        gsap.set(border, { clearProps: "clipPath" });
        run.tl = gsap
          .timeline({
            onComplete: () => {
              gsap.set(pos, { clearProps: "opacity,visibility" });
              gsap.set(border, { clearProps: "opacity" });
              gsap.set(lines, { clearProps: "transform" });
              gsap.set(paths, { clearProps: "strokeDasharray" });
              gsap.set(layer, { clearProps: "opacity,visibility,--q" });
              run = {};
              phase.current = "idle";
            },
          })
          .to(layer, { "--q": 0, duration: 0.5, ease: "power3.inOut" }, 0)
          .to(layer, { opacity: 0, duration: 0.25, ease: "power1.out" }, 0.4)
          .to(lines, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.inOut" }, 0)
          .to(
            paths,
            {
              strokeDashoffset: 0,
              strokeDasharray: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.01,
              overwrite: "auto",
              autoRound: false,
            },
            0.2,
          )
          .to(pos, { autoAlpha: 1, duration: 0.35 }, 0.35)
          .to(border, { opacity: 1, duration: 0.35 }, 0.35);
      });

      api.current = { enter, exit, ended: morph };
      return () => {
        api.current = { enter: () => {}, exit: () => {}, ended: () => {} };
        halt();
        window.removeEventListener("resize", fit);
        window.clearTimeout(idleTimer.current);
        video.pause();
        if (phase.current !== "idle") {
          setTheatre(false);
          setTheatreOn(false);
        }
        phase.current = "idle";
      };
    },
    { scope: rootRef, dependencies: [motion, poke], revertOnUpdate: true },
  );

  // Arm only at the very top of the opener (before its scrub moves anything).
  useEffect(() => {
    const section = rootRef.current?.closest("section");
    if (!section) return;
    const check = () => setAtTop(section.getBoundingClientRect().top > -24);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Stays enabled while the film runs so scroll intent can end it.
  useDwell(rootRef, {
    enabled: motion && (theatre || (atTop && !seen)),
    onDwell: () => api.current.enter(),
    onStir: (event) => {
      // Space / arrows on a focused control are that control's, not scroll intent.
      if (event instanceof KeyboardEvent && event.target instanceof Element && event.target.closest("button")) return;
      api.current.exit();
    },
  });

  useEffect(() => {
    if (!theatre) {
      if (refocus.current) chipRef.current?.focus({ preventScroll: true });
      refocus.current = false;
      return;
    }
    const key = (event: KeyboardEvent) => event.key === "Escape" && api.current.exit();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [theatre]);

  // Sound was blocked by the autoplay policy: the next tap or key anywhere (but our own controls, or Esc) turns it on.
  useEffect(() => {
    if (!blocked) return;
    const unmute = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") return;
      if (event.target instanceof Element && event.target.closest("[data-film-ctrl]")) return;
      if (videoRef.current) videoRef.current.muted = false;
    };
    window.addEventListener("pointerdown", unmute, true);
    window.addEventListener("keydown", unmute, true);
    return () => {
      window.removeEventListener("pointerdown", unmute, true);
      window.removeEventListener("keydown", unmute, true);
    };
  }, [blocked]);

  const hidden = bare || (idle && !blocked);
  const fade = cn(
    "transition-opacity duration-300 ease-linear has-[:focus-visible]:opacity-100",
    hidden && "opacity-0",
  );

  return (
    <div ref={rootRef} className="group pointer-events-none absolute inset-0">
      <div
        ref={layerRef}
        role="region"
        aria-label="Our impact trailer"
        onPointerMove={poke}
        onPointerDown={poke}
        onKeyDown={poke}
        style={LAYER_CLIP}
        className={cn(
          "pointer-events-auto invisible absolute inset-0 overflow-hidden bg-black opacity-0",
          theatre && hidden && "cursor-none",
        )}
      >
        <video
          ref={videoRef}
          src={FILM}
          preload="none"
          playsInline
          tabIndex={-1}
          aria-hidden
          // A late play() (the autoplay fallback) must not restart a film that was left.
          onPlay={(e) => phase.current !== "film" && e.currentTarget.pause()}
          onEnded={() => api.current.ended()}
          onError={() => api.current.exit()}
          onVolumeChange={(e) => {
            setMuted(e.currentTarget.muted);
            if (!e.currentTarget.muted) setBlocked(false);
          }}
          className="absolute left-0 top-0 size-full max-w-none bg-black object-fill"
        />

        {/* Steps aside for the end card (any tap still turns the sound on). */}
        {blocked ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-10 grid place-items-center transition-opacity duration-300",
              bare && "opacity-0",
            )}
          >
            <Button
              data-film-ctrl=""
              variant="orange"
              size="lg"
              aria-label="Turn the sound on"
              onClick={() => {
                if (videoRef.current) videoRef.current.muted = false;
              }}
              className={bare ? "pointer-events-none" : "pointer-events-auto"}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-current">
                <path d="M3 9h4l5-4v14l-5-4H3z" />
                <path d="M16 8l6 8M22 8l-6 8" className="fill-none stroke-current stroke-[2.5]" />
              </svg>
              Tap for sound
            </Button>
          </div>
        ) : null}

        <div className={cn("absolute inset-x-0 top-0 flex justify-end gap-2 bg-linear-to-b from-black/70 to-transparent px-4 pb-16 pt-4 md:px-5", fade)}>
          <button
            type="button"
            data-film-ctrl=""
            aria-pressed={muted}
            onClick={() => {
              const video = videoRef.current;
              if (video) video.muted = !video.muted;
            }}
            className={cn(CTRL, "aria-pressed:bg-orange aria-pressed:text-ink")}
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
              <path d="M3 9h4l5-4v14l-5-4H3z" />
              {muted ? (
                <path d="M16 9l6 6M22 9l-6 6" className="fill-none stroke-current stroke-2" />
              ) : (
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" className="fill-none stroke-current stroke-2" />
              )}
            </svg>
            Mute
          </button>
          <button ref={exitRef} type="button" data-film-ctrl="" onClick={() => api.current.exit()} className={CTRL}>
            Exit <span className="text-orange">[Esc]</span>
          </button>
        </div>

        {/* Netflix title card, bottom left, over a thin orange progress line. */}
        <div className={cn("absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent pt-24", fade)}>
          <div className="px-4 pb-5 md:px-8 md:pb-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">[S.00] A bits&bytes™ film</p>
            <p className={cn(WIDE, "mt-1.5 text-[clamp(28px,4vw,56px)] uppercase leading-[0.9] text-paper")}>Our impact</p>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper/80">Trailer · 0:19</p>
          </div>
          <span aria-hidden className="block h-0.5 bg-paper/15">
            <span ref={barRef} className="block h-full origin-left scale-x-0 bg-orange" />
          </span>
        </div>
      </div>

      {/* The billboard's play chip: under the frame, aligned to its left edge. Its ring fills with the dwell. */}
      <Button
        ref={chipRef}
        variant="orange"
        size="sm"
        aria-haspopup={motion ? undefined : "dialog"}
        onPointerEnter={() => {
          if (motion && videoRef.current) videoRef.current.preload = "auto"; // intent: start buffering
        }}
        onClick={() => (motion ? api.current.enter() : setPlain(true))}
        className={cn(
          "pointer-events-auto absolute left-[calc(50%-var(--fw)/2)] top-[calc(50%+var(--fh)/2+clamp(12px,3svh,28px))] z-10 h-11 gap-2.5 pl-1.5 pr-4 font-mono text-xs font-bold tracking-[0.14em] transition-[transform,translate,box-shadow,opacity] duration-200",
          // visibility only transitions on the way out (fades, then leaves the tab order); back in it's at once, so
          // focus can land on it
          motion && (theatre || !atTop) && "invisible opacity-0 transition-[transform,translate,box-shadow,opacity,visibility]",
        )}
      >
        <span className="relative grid size-8 place-items-center">
          <svg viewBox="0 0 32 32" aria-hidden className="absolute inset-0 size-full -rotate-90 fill-none">
            <circle cx="16" cy="16" r="14" strokeWidth={2} className="stroke-ink/25" />
            <circle
              cx="16"
              cy="16"
              r="14"
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              className="stroke-ink group-data-[dwell=arming]:animate-dwell"
            />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 translate-x-px fill-current">
            <path d="M6 4l14 8-14 8z" />
          </svg>
        </span>
        Play trailer <span aria-hidden>·</span> 0:19
      </Button>

      <PlainPlayer open={plain} onOpenChange={setPlain} from={chipRef} />
    </div>
  );
}

/** Motion off / reduced motion: the film in a plain full-screen dialog with native controls. */
function PlainPlayer({
  open,
  onOpenChange,
  from,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Gets focus back on close (there's no Dialog.Trigger to return to). */
  from: RefObject<HTMLElement | null>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          data-lenis-prevent
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            from.current?.focus({ preventScroll: true });
          }}
          className="fixed inset-0 z-[300] grid place-items-center bg-black p-4 pt-16 outline-none"
        >
          <Dialog.Title className="sr-only">Our impact · trailer</Dialog.Title>
          <video
            src={FILM}
            poster={POSTER}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="aspect-video max-h-full w-full max-w-[calc((100svh-6rem)*16/9)] bg-black"
          />
          <Dialog.Close className={cn(CTRL, "absolute right-4 top-4")}>
            Close <span className="text-orange">[Esc]</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
