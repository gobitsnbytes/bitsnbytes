"use client";

/*
 * HomeReel — buttermax.net's curtain reel (DESIGN.md "Homepage" 2; tmp/research-full.json → buttermax
 * "Curtain reel: a fixed video uncovered by the scrolling sections above and below it").
 *
 * The section is a 100svh window with clip-path: inset(0); its media layer is position: fixed, so the clip moves
 * with the page while the picture stays put: the orange hero rises off it, and the next chapter (TornEdge top)
 * slides over it. Needs no transform/filter on any ancestor (template.tsx and SiteChrome keep none).
 *
 * Media: /movie/bnb-movie.mp4 once, muted/looping, preload="none", playing only while the window is on screen.
 * Their darker full-bleed copy of the footage is our dither screen: each video frame is drawn into a 128×72 canvas,
 * ordered-dithered (4×4 Bayer) into ink / burgundy-dk / burgundy / orange and scaled up pixelated, so there is
 * one decode and one download. The same clip plays clean in an inset riot Window (≈75% wide) that scrubs
 * scale .92→1 as the curtain lifts, while the full-bleed copy counter-drifts (transform only).
 * "[ WATCH FILM ]" (the whole window is the hit area) opens the VideoModal with sound.
 *
 * Reduced motion / motion toggle off: no video, no scrubs; the frame shows a still (bnb-movie-poster.jpg) over a halftone field.
 * Media only loads after the curtain starts to lift, so nothing here competes with the hero LCP.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { Window } from "@/components/riot/window";
import { VideoModal } from "@/components/riot/video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FILM = "/movie/bnb-movie.mp4";
const STILL = "/movie/bnb-movie-poster.jpg";
const TITLE = "bits&bytes™ movie";

const W = 128;
const H = 72;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// ink, burgundy-dk, burgundy, orange: dark to light
const INKS = [
  [0x12, 0x0f, 0x0a],
  [0x79, 0x14, 0x23],
  [0x97, 0x19, 0x2c],
  [0xfc, 0x92, 0x0d],
];

function dither(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  ctx.drawImage(video, 0, 0, W, H);
  const frame = ctx.getImageData(0, 0, W, H);
  const d = frame.data;
  const top = INKS.length - 1;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const v = ((d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255) * top;
    const lo = Math.floor(v);
    const threshold = (BAYER[(Math.floor(p / W) & 3) * 4 + ((p % W) & 3)] + 0.5) / 16;
    const ink = INKS[Math.min(top, lo + (v - lo > threshold ? 1 : 0))];
    d[i] = ink[0];
    d[i + 1] = ink[1];
    d[i + 2] = ink[2];
  }
  ctx.putImageData(frame, 0, 0);
}

export function HomeReel() {
  const motionOn = useMotionEnabled();
  const sectionRef = useRef<HTMLElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lifted, setLifted] = useState(false);

  // Load media once the curtain has started to lift (i.e. after the first scroll, when LCP is already final).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLifted(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play only while the window is open; mirror each presented frame into the dither canvas.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!motionOn || !lifted || !section || !video || !ctx) return;

    let raf = 0;
    let vfc = 0;
    const draw = () => {
      if (video.readyState >= 2) dither(ctx, video);
      schedule();
    };
    const schedule = () => {
      if ("requestVideoFrameCallback" in video) vfc = video.requestVideoFrameCallback(draw);
      else raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      if (vfc) video.cancelVideoFrameCallback(vfc);
      raf = vfc = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      stop();
      if (entry.isIntersecting) {
        video.play().catch(() => {});
        schedule();
      } else {
        video.pause();
      }
    });
    io.observe(section);
    return () => {
      io.disconnect();
      stop();
      video.pause();
    };
  }, [motionOn, lifted]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!motionOn || !section) return;
      gsap.fromTo(
        frameRef.current,
        { scale: 0.92 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true } },
      );
      gsap.fromTo(
        bleedRef.current,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: sectionRef, dependencies: [motionOn], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      id="film"
      aria-label={TITLE}
      data-surface="ink"
      data-cinematic-section=""
      data-cinematic-title="the film"
      className="tone-ink relative h-[100svh] [clip-path:inset(0)]"
    >
      {/* The fixed picture this section windows onto. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div ref={bleedRef} className="absolute inset-x-0 -inset-y-[8%] bg-ink">
          <span className="halftone-orange absolute inset-0 opacity-25" />
          {motionOn ? (
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="absolute inset-0 size-full object-cover [image-rendering:pixelated]"
            />
          ) : null}
          <span className="halftone absolute inset-0 opacity-40 mix-blend-multiply" />
        </div>

        <div className="absolute inset-0 grid place-items-center p-4">
          <div
            ref={frameRef}
            className="w-[min(88vw,calc((100svh-9rem)*16/9))] md:w-[min(75vw,calc((100svh-12rem)*16/9))]"
          >
            <Window title={TITLE} bar="orange" bodyClassName="p-0">
              <div className="relative aspect-video bg-ink">
                {lifted ? (
                  <Image src={STILL} alt="" fill sizes="(min-width: 768px) 75vw, 88vw" className="object-cover" />
                ) : null}
                {motionOn && lifted ? (
                  <video
                    ref={videoRef}
                    src={FILM}
                    muted
                    playsInline
                    loop
                    preload="none"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : null}
              </div>
            </Window>
          </div>
        </div>
      </div>

      <VideoModal src={FILM} title={TITLE}>
        <button
          type="button"
          aria-label="Watch film"
          data-cursor-label="WATCH FILM"
          className="group absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-[clamp(20px,5svh,56px)] outline-none"
        >
          <span className="border-2 border-line bg-ink px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[3px_3px_0_0_var(--orange)] transition-[transform,box-shadow] duration-150 ease-riot group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0_0_var(--orange)] group-focus-visible:outline-3 group-focus-visible:outline-solid group-focus-visible:outline-offset-3 group-focus-visible:outline-(color:--focus-ring) motion-reduce:transition-none">
            [ WATCH FILM ]
          </span>
        </button>
      </VideoModal>
    </section>
  );
}
