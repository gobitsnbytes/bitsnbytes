"use client";

/*
 * JoinBillboard: /join's hero as a Netflix title page for "Episode 1" (public/movie/goated.mp4), in Print Riot.
 *
 * Billboard: the poster (the LCP) under a muted preview loop that starts once the loader is done and the billboard
 * has been in view ~1s; ink scrims left + bottom; kicker, h1, meta, synopsis, [Play] [Apply now] [Join Discord].
 * Theatre, in place (no dialog): 2s of stillness on the billboard (useDwell, once per session) or Play:
 *   1. step aside (0 → 0.6s): the UI sinks and fades, the scrims lift, the preview fades to black, the stage fades in.
 *   2. ident (0.65s): our ta-dum; the film starts from 0 under its zoom-through (playWithSound, or Tap for sound).
 *   3. film: title card, Exit [Esc], mute, a thin progress line; they fade after 2.5s without the pointer moving.
 *      Scroll intent, Esc or Exit: the sound fades out (400ms), the stage fades, the UI comes back. Scroll is never
 *      locked, so the billboard can only leave the viewport through a scroll, which already exits.
 * The morph: the film ends on black with a red serif "To be continued....", which becomes the page (watchFrames):
 *   49.0  BLACK: the controls go so the black is pure; whoosh.
 *   53.8  a DOM copy of the line fades in exactly over the film's own (filmRect + LINE geometry).
 *   END   the film fades out under the copy, which keeps scrambling (the film's own device) into "Join the crew";
 *         each h1 line then FLIPs from the copy's line onto its home (red → paper) as the copy fades, the rest of
 *         the UI rises, the riot shadows pop, the scrims and preview come back slowly and the theatre lifts.
 * Motion off / reduced motion: poster only, no preview, no dwell, no ident; Play opens a plain player (native controls).
 */

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { playIdent } from "@/components/cinema/ident";
import { fadeVolume, filmRect, hasSeen, markSeen, playWithSound, setTheatre, useDwell, watchFrames } from "@/components/cinema/theatre";
import { isShortcut } from "@/components/chrome/hotkeys/shortcuts";
import { play } from "@/components/chrome/sound/engine";
import { CubeMark, WIDE } from "@/components/chrome/wordmark";
import { whenReady } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { LabLink } from "@/components/lab";
import { Button } from "@/components/riot";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const FILM = "/movie/goated.mp4";
const PREVIEW = "/movie/goated-preview.mp4";
const POSTER = "/movie/goated-poster.jpg";
const TITLE = "Join the crew";

// goated.mp4 cue sheet (29.97fps), measured from its frames (tmp/films/goated_*.jpg). Re-measure if the edit changes.
const BLACK = 49.0; // hard cut to black: "Code your sorrows away..."
const LINE_IN = 53.8; // "To be continued...." resolved at 53.5 and holds to the end
const END = 54.19;
// The held line as fractions of the 16:9 frame: ink centre, ink width, ink height (ascender top to baseline).
const LINE = { text: "To be continued....", cx: 0.4986, cy: 0.5058, w: 0.4659, h: 0.0838 };
// The film's face is Times-like. Size is fitted to the line's ink height and tracking to its ink width at runtime
// (canvas metrics), so a fallback serif still lands on the film's line; TRACK bounds the tracking fit.
const SERIF = '"Times New Roman", Times, "Liberation Serif", Tinos, serif';
const TRACK = { min: -0.06, max: 0.04 }; // em
const RED = "rgb(228, 0, 0)"; // the film line measures ~222 median, ~251 on its scanline highlights
// The film's line is soft and a touch heavy (CRT bloom): a hairline stroke + a soft halo match its weight.
const BLOOM = { WebkitTextStroke: "0.012em currentColor", textShadow: "0 0 1px currentColor, 0 0 0.14em rgb(217 0 0 / 0.45)" };
// The film's scramble: random alphanumerics resolving left to right.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SCRAMBLE = 0.9;
const IDLE_MS = 2500;
const PREVIEW_AFTER_MS = 1000;

const CTRL =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-2 border-2 border-paper bg-ink/70 px-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper transition-colors duration-150 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink";

let metrics: CanvasRenderingContext2D | null = null;

/** Font size, tracking and box position that put LINE.text's ink exactly on the film's line inside `frame`. */
function fitLine(frame: { left: number; top: number; width: number; height: number }) {
  metrics ??= document.createElement("canvas").getContext("2d");
  if (!metrics) return null;
  metrics.font = `1000px ${SERIF}`;
  const m = metrics.measureText(LINE.text);
  const size = (LINE.h * frame.height) / (m.actualBoundingBoxAscent / 1000);
  const k = size / 1000;
  const n = LINE.text.length;
  const ink = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) * k;
  const track = Math.min(Math.max((LINE.w * frame.width - ink) / (n - 1), TRACK.min * size), TRACK.max * size);
  // Letter-spacing trails every glyph, the last one too: the ink sits off the box centre by this much.
  const box = m.width * k + n * track;
  const inkMid = ((m.actualBoundingBoxRight - m.actualBoundingBoxLeft) * k + (n - 1) * track) / 2;
  // Baseline inside a line-height:1 box: half-leading + ascent.
  const baseline = (size + (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) * k) / 2;
  return {
    size,
    track,
    x: frame.left + LINE.cx * frame.width - (inkMid - box / 2), // box centre (the element is xPercent -50)
    y: frame.top + (LINE.cy + LINE.h / 2) * frame.height - baseline,
  };
}

const noise = (text: string, p: number) =>
  [...text]
    .map((ch, i) => (ch === " " || p >= 0.35 + 0.6 * (i / text.length) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
    .join("");

type Phase = "idle" | "film" | "morph" | "leaving";

export function JoinBillboard({ applyHref, discordHref }: { applyHref: string; discordHref: string }) {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const phase = useRef<Phase>("idle");
  const holdPreview = useRef(false);
  const syncPreview = useRef(() => {});
  const api = useRef({ enter: () => {}, leave: () => {}, morph: () => {} });
  const stillTimer = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [seen, setSeen] = useState(true);
  const [theatre, setTheatreOn] = useState(false);
  const [live, setLive] = useState(false); // the film is running (controls may show)
  const [black, setBlack] = useState(false); // past BLACK: no chrome over the film's black
  const [still, setStill] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [previewOn, setPreviewOn] = useState(false);
  const [plain, setPlain] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSeen(hasSeen(FILM));
  }, []);

  const poke = () => {
    setStill(false);
    window.clearTimeout(stillTimer.current);
    stillTimer.current = window.setTimeout(() => setStill(true), IDLE_MS);
  };
  useEffect(() => () => window.clearTimeout(stillTimer.current), []);

  // Muted preview: after the loader and ~1s in view, motion on only; paused off screen, in a hidden tab and while
  // the theatre holds it. preload="none" until then, so it never competes with the poster.
  useEffect(() => {
    const video = previewRef.current;
    const root = rootRef.current;
    if (!motion || !video || !root) return;
    let ready = false;
    let inView = false;
    let armed = false;
    let timer = 0;
    const sync = () => {
      if (armed && inView && !document.hidden && !holdPreview.current) video.play().catch(() => {});
      else video.pause();
    };
    const arm = () => {
      window.clearTimeout(timer);
      if (!armed && ready && inView)
        timer = window.setTimeout(() => {
          armed = true;
          video.preload = "auto";
          sync();
        }, PREVIEW_AFTER_MS);
      sync();
    };
    syncPreview.current = sync;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      arm();
    });
    const disposeReady = whenReady(() => {
      ready = true;
      arm();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposeReady();
      io.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", sync);
      syncPreview.current = () => {};
      video.pause();
    };
  }, [motion]);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!motion || !root || !contextSafe) return;
      const q = gsap.utils.selector(root);
      let session = 0;
      let ident: { kill: () => void } | null = null;
      let unwatch = () => {};
      let lineShown = false;
      let blackDone = false;
      let enterTl: gsap.core.Timeline | null = null;
      let morphTl: gsap.core.Timeline | null = null;

      // The film sits where filmRect paints it (cover on landscape, letterboxed on portrait); the line follows.
      const layout = () => {
        const stage = stageRef.current;
        const film = filmRef.current;
        if (!stage || !film) return;
        const box = stage.getBoundingClientRect();
        const r = filmRect(box);
        const frame = { left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height };
        Object.assign(film.style, { left: `${frame.left}px`, top: `${frame.top}px`, width: `${frame.width}px`, height: `${frame.height}px` });
        const fit = fitLine(frame);
        const line = lineRef.current;
        if (fit && line && lineShown) {
          Object.assign(line.style, { fontSize: `${fit.size}px`, letterSpacing: `${fit.track}px` });
          gsap.set(line, { x: fit.x, y: fit.y, xPercent: -50 });
        }
      };

      const showLine = contextSafe((instant = false) => {
        const line = lineRef.current;
        if (lineShown || !line) return;
        lineShown = true;
        line.textContent = LINE.text;
        layout();
        gsap.to(line, { opacity: 1, duration: instant ? 0 : 0.3, ease: "none" });
      });

      const cue = (t: number) => {
        const film = filmRef.current;
        if (progressRef.current && film?.duration) progressRef.current.style.scale = `${Math.min(t / film.duration, 1)} 1`;
        if (t >= BLACK && !blackDone) {
          blackDone = true;
          setBlack(true);
          play("whoosh", 0);
        }
        if (t >= LINE_IN) showLine();
        if (t >= END - 0.05) api.current.morph();
      };

      const startFilm = async (id: number) => {
        const film = filmRef.current;
        ident = null;
        if (!film || id !== session) return;
        film.currentTime = 0;
        unwatch = watchFrames(film, cue);
        setLive(true);
        poke();
        const audible = await playWithSound(film);
        if (id === session) setBlocked(!audible);
        else film.pause(); // left while play() was pending: its volume ramp would outlive the fade-out
      };

      // The UI is live again. Focus on the film's controls comes home to Play before the stage hides (a hidden
      // focused control would drop focus to <body>); focus anywhere else is left alone.
      const handBack = () => {
        if (uiRef.current) uiRef.current.inert = false;
        if (stageRef.current?.contains(document.activeElement)) playRef.current?.focus({ preventScroll: true });
      };

      // Everything the theatre touched goes back to the stylesheet and the stage hides.
      const settle = contextSafe(() => {
        const stage = stageRef.current;
        const film = filmRef.current;
        const line = lineRef.current;
        unwatch();
        film?.pause();
        handBack();
        gsap.set([...q("[data-ui], [data-h1-line], [data-scrim], [data-media], [data-cta]")], { clearProps: "all" });
        if (film) gsap.set(film, { clearProps: "opacity" });
        if (blackRef.current) gsap.set(blackRef.current, { clearProps: "opacity" });
        if (line) {
          gsap.set(line, { opacity: 0 });
          line.textContent = "";
        }
        if (stage) {
          gsap.set(stage, { autoAlpha: 0 });
          stage.style.pointerEvents = "";
        }
        phase.current = "idle";
        morphTl = null;
        holdPreview.current = false;
        syncPreview.current();
        setTheatre(false);
        setTheatreOn(false);
        setLive(false);
        setBlack(false);
        setBlocked(false);
      });

      const enter = contextSafe(() => {
        const stage = stageRef.current;
        const film = filmRef.current;
        if (phase.current !== "idle" || !stage || !film) return;
        phase.current = "film";
        const id = ++session;
        lineShown = false;
        blackDone = false;
        markSeen(FILM);
        setSeen(true);
        setTheatre(true);
        setTheatreOn(true);
        holdPreview.current = true;
        film.preload = "auto";
        film.load(); // fetch under the step-aside + ident (~1.8s of cover)
        layout();
        const focusInUi = uiRef.current?.contains(document.activeElement);
        enterTl = gsap
          .timeline()
          .to(q("[data-ui]"), { y: 28, opacity: 0, duration: 0.45, ease: "power2.in", stagger: 0.03 }, 0)
          .to(q("[data-scrim], [data-media]"), { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 0)
          .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power1.inOut" }, 0.3)
          .call(
            () => {
              // The UI is going away: a keyboard visitor lands on Exit, nobody else is moved.
              if (focusInUi) exitRef.current?.focus({ preventScroll: true });
              if (uiRef.current) uiRef.current.inert = true;
            },
            undefined,
            0.35,
          )
          .call(
            () => {
              if (id !== session) return;
              previewRef.current?.pause();
              const run = playIdent(stage);
              ident = run;
              void run.done.then(() => startFilm(id));
            },
            undefined,
            0.65,
          );
      });

      // Back to the billboard from anywhere in the film. The morph just lands, silently: progress(1) would fire every
      // cue it skips over at once (land + resolve, + scramble early on).
      const leave = contextSafe(() => {
        if (phase.current === "morph") {
          morphTl?.kill();
          settle();
          return;
        }
        if (phase.current !== "film") return;
        phase.current = "leaving";
        session++;
        enterTl?.kill();
        ident?.kill();
        unwatch();
        handBack();
        const film = filmRef.current;
        if (film && !film.paused && !film.muted) fadeVolume(film, 0, 400, () => film.pause());
        else film?.pause();
        setTheatre(false);
        play("whoosh", 1); // out
        holdPreview.current = false;
        gsap
          .timeline({ onComplete: settle })
          .to(stageRef.current, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, 0.1)
          .call(() => syncPreview.current(), undefined, 0.2)
          .to(q("[data-scrim], [data-media]"), { opacity: 1, duration: 0.8, ease: "power1.inOut" }, 0.2)
          .to(q("[data-ui]"), { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.04 }, 0.3);
      });

      const morph = contextSafe(() => {
        const stage = stageRef.current;
        const film = filmRef.current;
        const line = lineRef.current;
        const [h1] = q<HTMLElement>("[data-h1]");
        const lines = q<HTMLElement>("[data-h1-line]");
        if (phase.current !== "film" || !stage || !film || !line || !h1 || lines.length !== 2) return;
        showLine(true); // a seek past LINE_IN, or an early `ended`
        phase.current = "morph";
        unwatch();
        setBlack(true);
        stage.style.pointerEvents = "none"; // the page is live again underneath

        // Measure the whole morph up front: the copy as it will read ("Join the" + "crew") and the h1 at home.
        line.textContent = TITLE;
        const text = line.firstChild;
        const from = [
          [0, 8],
          [9, 13],
        ].map(([a, b]) => {
          const range = document.createRange();
          range.setStart(text as Node, a);
          range.setEnd(text as Node, b);
          return range.getBoundingClientRect();
        });
        line.textContent = LINE.text;
        gsap.set(h1, { y: 0, opacity: 1 });
        gsap.set(lines, { opacity: 0 });
        const flip = lines.map((el, i) => {
          const t = el.getBoundingClientRect();
          const s = from[i];
          const k = s.width / t.width;
          return {
            k,
            x: s.left + s.width / 2 - t.left - (k * t.width) / 2,
            y: s.top + s.height / 2 - t.top - (k * t.height) / 2,
          };
        });
        const paper = getComputedStyle(h1).color;
        const rest = q("[data-ui]:not([data-h1])");
        const ctas = q<HTMLElement>("[data-cta]");
        const shadows = ctas.map((el) => getComputedStyle(el).boxShadow);
        const scramble = { p: 0 };
        let step = -1;

        morphTl = gsap
          .timeline({ onComplete: settle })
          // the film goes; its line stays (the copy is on top of it, pixel for pixel)
          .to(film, { opacity: 0, duration: 0.25, ease: "none" }, 0)
          .call(() => play("scramble", SCRAMBLE), undefined, 0.2)
          .to(
            scramble,
            {
              p: 1,
              duration: SCRAMBLE,
              ease: "none",
              onUpdate: () => {
                const s = Math.floor(scramble.p * 20); // the film re-rolls about every other frame
                if (s === step) return;
                step = s;
                line.textContent = scramble.p >= 1 ? TITLE : noise(TITLE, scramble.p);
              },
            },
            0.2,
          )
          // black → the billboard's ink, the red title still hanging there
          .to(blackRef.current, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 1.1)
          // each line flies from the copy onto its home, red → paper, as the copy lets go
          .fromTo(
            lines,
            { x: (i) => flip[i].x, y: (i) => flip[i].y, scale: (i) => flip[i].k, transformOrigin: "0 0", color: RED },
            { x: 0, y: 0, scale: 1, color: paper, duration: 1, ease: "expo.inOut", stagger: 0.06 },
            1.5,
          )
          .to(lines, { opacity: 1, duration: 0.3, ease: "none", stagger: 0.06 }, 1.5)
          .to(line, { opacity: 0, duration: 0.3, ease: "none" }, 1.55)
          .call(() => play("land"), undefined, 2.5)
          .call(
            () => {
              setTheatre(false);
              handBack();
              holdPreview.current = false;
              syncPreview.current();
            },
            undefined,
            2.45,
          )
          .fromTo(rest, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07 }, 2.45)
          // riot shadows pop in under the buttons
          .fromTo(
            ctas,
            { boxShadow: (i) => shadows[i].replace(/-?\d*\.?\d+px/g, "0px") },
            { boxShadow: (i) => shadows[i], duration: 0.35, ease: "back.out(3)", stagger: 0.06 },
            2.85,
          )
          .to(q("[data-scrim], [data-media]"), { opacity: 1, duration: 1.2, ease: "power1.inOut" }, 2.5)
          .call(() => play("resolve"), undefined, 2.9);
      });

      api.current = { enter, leave, morph };
      const onResize = () => phase.current === "film" && layout();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        session++;
        ident?.kill();
        unwatch();
        filmRef.current?.pause();
        if (uiRef.current) uiRef.current.inert = false;
        if (phase.current !== "idle") setTheatre(false);
        phase.current = "idle";
        holdPreview.current = false;
        api.current = { enter: () => {}, leave: () => {}, morph: () => {} };
        setTheatreOn(false);
        setLive(false);
        setBlack(false);
        setBlocked(false);
      };
    },
    { scope: rootRef, dependencies: [motion] },
  );

  // 2s of stillness on the billboard plays it once per session. Kept on through the film for its scroll intent,
  // which steps the film aside; keys pressed on the film's own controls are not scrolling.
  useDwell(rootRef, {
    enabled: motion && (theatre || !seen),
    onDwell: () => {
      if (!hasSeen(FILM)) api.current.enter();
    },
    onStir: (event) => {
      if (event instanceof KeyboardEvent && event.target instanceof Node && stageRef.current?.contains(event.target)) return;
      api.current.leave();
    },
  });

  const toggleMute = () => {
    const film = filmRef.current;
    if (!film) return;
    if (film.muted) film.volume = 1;
    film.muted = !film.muted;
  };

  // Captured ahead of the ident's skip (Esc no longer starts the film for a frame on its way out) and of the site
  // hotkeys: M is Netflix's mute here, not the menu opening over a playing film.
  useEffect(() => {
    if (!theatre) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") api.current.leave();
      else if (event.key.toLowerCase() === "m" && isShortcut(event)) {
        event.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [theatre]);

  // Sound was blocked by the autoplay policy: the next tap or key anywhere (but the mute toggle) turns it on. On the
  // click, not pointerdown: a touch only activates the page on its release, and unmuting before that makes Chrome
  // (and Safari) pause the film instead.
  useEffect(() => {
    if (!blocked) return;
    const unmute = (event: Event) => {
      const film = filmRef.current;
      if (!film || (event.target instanceof Element && event.target.closest("[data-film-sound]"))) return;
      if (event instanceof KeyboardEvent && event.key === "Escape") return;
      film.volume = 0;
      film.muted = false;
      fadeVolume(film, 1, 600);
    };
    window.addEventListener("click", unmute, true);
    window.addEventListener("keydown", unmute, true);
    return () => {
      window.removeEventListener("click", unmute, true);
      window.removeEventListener("keydown", unmute, true);
    };
  }, [blocked]);

  const watch = () => (motion ? api.current.enter() : setPlain(true));
  const chrome = cn(
    "transition-opacity duration-500 ease-in-out motion-reduce:transition-none has-[:focus-visible]:opacity-100",
    (!live || black || (still && !blocked)) && "opacity-0",
    (!live || black) && "pointer-events-none",
  );

  return (
    <section
      ref={rootRef}
      data-cinematic-section=""
      data-cinematic-title="Join the crew"
      data-surface="ink"
      aria-labelledby="join-title"
      className="group/billboard tone-ink relative isolate flex min-h-[max(100svh,640px)] flex-col justify-end overflow-hidden"
    >
      <div data-media aria-hidden className="absolute inset-0 -z-10">
        <Image src={POSTER} alt="" fill priority sizes="100vw" className="object-cover" />
        {motion ? (
          <video
            ref={previewRef}
            src={PREVIEW}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            onPlaying={() => setPreviewOn(true)}
            className={cn(
              "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 ease-in-out",
              previewOn && "opacity-100",
            )}
          />
        ) : null}
      </div>
      {/* Netflix scrims: a 77° vignette from the left, the floor, and a little shade under the nav. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(77deg,rgb(18_15_10/0.92)_0%,rgb(18_15_10/0.6)_34%,transparent_68%)]"
      />
      {/* The floor is solid for its last ~16%: the preview's town shot carries a burned-in caption down there. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-[linear-gradient(to_top,var(--ink)_27%,rgb(18_15_10/0.6)_60%,transparent)]"
      />
      <div data-scrim aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-ink/70 to-transparent" />

      <div ref={uiRef} className="px-4 pb-[clamp(40px,9svh,96px)] pt-28 md:px-[4vw]">
        <p
          data-ui
          className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-paper md:text-xs"
        >
          <CubeMark className="size-6 text-orange" />
          <span>
            <span className="normal-case tracking-[0.04em]">bits&amp;bytes™</span> Original
          </span>
          <span className="border-2 border-paper px-2 py-0.5 leading-none tracking-[0.14em]">Episode 1</span>
        </p>
        <h1
          id="join-title"
          data-ui
          data-h1
          className={cn(WIDE, "mt-4 text-[clamp(44px,min(11vw,15svh),136px)] uppercase leading-[0.84] text-paper")}
        >
          <span data-h1-line className="block w-fit">
            Join the
          </span>{" "}
          <span data-h1-line className="block w-fit">
            crew
          </span>
        </h1>
        <p data-ui className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-paper/85 md:text-xs">
          Ages 13–19 <span className="text-orange">·</span> Free <span className="text-orange">·</span> Pan-India{" "}
          <span className="text-orange">·</span> On Discord
        </p>
        <p data-ui className="mt-3 max-w-[44ch] font-serif text-[17px] leading-snug text-paper/90 md:text-lg">
          Pick how you want to build with us. We&apos;ll match you with a squad and a mentor, on a project that ships.
        </p>
        <div data-ui className="mt-7 flex flex-wrap gap-x-4 gap-y-4">
          <Button
            ref={playRef}
            data-cta=""
            onClick={watch}
            aria-label="Play Episode 1"
            className="border-paper bg-paper text-ink [--shadow-color:var(--orange)]"
          >
            {/* Dwell ring: fills over the 2s stillness before the film takes the screen. */}
            <span aria-hidden className="relative -ml-1 grid size-7 place-items-center">
              <svg viewBox="0 0 28 28" className="absolute inset-0 size-full -rotate-90 fill-none">
                <circle cx="14" cy="14" r="12.5" className="stroke-ink/15" strokeWidth={1.5} />
                <circle
                  cx="14"
                  cy="14"
                  r="12.5"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1}
                  strokeWidth={2.5}
                  // Only while the dwell can still fire: through the theatre the hook stays on for scroll intent
                  // and re-arms on every key, so the ring would fill on the returning UI for nothing.
                  className={cn("stroke-burgundy", !seen && "group-data-[dwell=arming]/billboard:animate-dwell")}
                />
              </svg>
              <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5 fill-current">
                <path d="M6 4l14 8-14 8z" />
              </svg>
            </span>
            Play
          </Button>
          <Button asChild variant="burgundy" data-cta="">
            <LabLink href={applyHref} className="group">
              Apply now
              <Arrow />
            </LabLink>
          </Button>
          <Button asChild variant="outline" data-cta="">
            <LabLink href={discordHref} className="group">
              Join Discord
              <Arrow />
            </LabLink>
          </Button>
        </div>
      </div>
      {/* Netflix's maturity tag on the right edge. */}
      <p
        data-ui
        aria-hidden
        className="absolute bottom-[clamp(40px,9svh,96px)] right-0 border-l-3 border-orange bg-ink/50 py-2 pl-3 pr-[max(1rem,4vw)] font-mono text-xs font-bold tracking-[0.12em] text-paper max-sm:hidden"
      >
        13–19
      </p>

      {mounted && motion
        ? createPortal(
            <div
              ref={stageRef}
              role="region"
              aria-label="Episode 1, a bits&bytes™ film"
              onPointerMove={poke}
              onPointerDown={poke}
              onKeyDown={poke}
              className={cn(
                "invisible fixed inset-0 z-[65] overflow-hidden text-paper opacity-0 [--focus-ring:var(--marker)]",
                live && still && !blocked && "cursor-none",
              )}
            >
              <div ref={blackRef} aria-hidden className="absolute inset-0 bg-black" />
              <video
                ref={filmRef}
                src={FILM}
                playsInline
                preload="none"
                tabIndex={-1}
                aria-label="Episode 1"
                onEnded={() => api.current.morph()}
                onVolumeChange={(event) => {
                  setMuted(event.currentTarget.muted);
                  if (!event.currentTarget.muted) setBlocked(false);
                }}
                className="absolute max-w-none bg-black object-fill"
              />
              <p
                ref={lineRef}
                aria-hidden
                style={{ fontFamily: SERIF, color: RED, ...BLOOM }}
                className="pointer-events-none absolute left-0 top-0 whitespace-pre leading-none opacity-0"
              />

              {blocked && !black ? (
                <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
                  <Button
                    data-film-sound=""
                    variant="orange"
                    size="lg"
                    aria-label="Turn the sound on"
                    onClick={() => {
                      const film = filmRef.current;
                      if (!film) return;
                      film.volume = 0;
                      film.muted = false;
                      fadeVolume(film, 1, 600);
                    }}
                    className="pointer-events-auto"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-current">
                      <path d="M3 9h4l5-4v14l-5-4H3z" />
                      <path d="M16 8l6 8M22 8l-6 8" className="fill-none stroke-current stroke-[2.5]" />
                    </svg>
                    Tap for sound
                  </Button>
                </div>
              ) : null}

              <div
                className={cn(
                  "absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 bg-linear-to-b from-black/70 to-transparent px-4 pb-16 pt-4 md:px-[4vw] md:pt-6",
                  chrome,
                )}
              >
                <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.14em]">
                  <CubeMark className="size-5 text-orange" />
                  <span>
                    Episode 1 <span className="text-orange">·</span>{" "}
                    <span className="normal-case tracking-[0.04em]">bits&amp;bytes™</span>
                  </span>
                </p>
                <button ref={exitRef} type="button" onClick={() => api.current.leave()} className={CTRL}>
                  Exit <span className="text-orange">[Esc]</span>
                </button>
              </div>

              <div className={cn("absolute bottom-4 right-4 z-20 md:bottom-6 md:right-[4vw]", chrome)}>
                <button
                  type="button"
                  data-film-sound=""
                  aria-pressed={muted}
                  aria-keyshortcuts="M"
                  onClick={toggleMute}
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
              </div>

              {/* Thin progress line along the bottom edge; gone with the rest at BLACK. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 z-20 h-[3px] bg-paper/15 transition-opacity duration-500",
                  (!live || black) && "opacity-0",
                )}
              >
                <span ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-orange" />
              </span>
            </div>,
            document.body,
          )
        : null}

      <PlainPlayer open={plain} onOpenChange={setPlain} returnTo={playRef} />
    </section>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="transition-transform duration-200 ease-riot group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
    >
      →
    </span>
  );
}

/** Motion off / reduced motion: the film full screen with native controls, nothing choreographed. */
function PlainPlayer({
  open,
  onOpenChange,
  returnTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnTo: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          data-lenis-prevent
          aria-describedby={undefined}
          // No Dialog.Trigger (Play is shared with the theatre): hand focus back to it by hand.
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnTo.current?.focus({ preventScroll: true });
          }}
          className="fixed inset-0 z-[300] flex flex-col bg-black text-paper outline-none [--focus-ring:var(--marker)]"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-[4vw]">
            <Dialog.Title className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
              Episode 1 <span className="text-orange">·</span>{" "}
              <span className="normal-case tracking-[0.04em]">bits&amp;bytes™</span>
            </Dialog.Title>
            <Dialog.Close className={CTRL}>
              Close <span className="text-orange">[Esc]</span>
            </Dialog.Close>
          </div>
          <video
            src={FILM}
            poster={POSTER}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="min-h-0 w-full flex-1 bg-black object-contain"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
