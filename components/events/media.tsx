"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const FINE = "(hover: hover) and (pointer: fine)";
// Only one hover clip plays at a time across the page.
let playingClip: HTMLVideoElement | null = null;

/**
 * inkfish card media: the still (and optional clip) sits in an oversized layer inside the mask and
 * moves against the pointer ((centre − pointer) × 0.15, quickTo 1s expo.out). Clips load on the first
 * hover/focus of the closest [data-card], play muted and fade in once playing; leave pauses and rewinds
 * after 220ms. Touch, reduced motion and the motion toggle get the still only.
 */
export function ParallaxMedia({
  still,
  video,
  className,
}: {
  /** Fills the box (e.g. a fill next/image). */
  still: ReactNode;
  video?: string;
  className?: string;
}) {
  const { motionEnabled: motion } = useExperience();
  const boxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const box = boxRef.current;
      const layer = layerRef.current;
      const card = box?.closest<HTMLElement>("[data-card]") ?? box;
      if (!motion || !box || !layer || !card) return;
      const fine = window.matchMedia(FINE).matches;
      const x = gsap.quickTo(layer, "x", { duration: 1, ease: "expo.out" });
      const y = gsap.quickTo(layer, "y", { duration: 1, ease: "expo.out" });
      let rewind = 0;

      const start = () => {
        const clip = videoRef.current;
        if (!clip || !video) return;
        window.clearTimeout(rewind);
        if (!clip.getAttribute("src")) clip.src = video;
        if (playingClip && playingClip !== clip) playingClip.pause();
        playingClip = clip;
        clip
          .play()
          .then(() => (clip.style.opacity = "1"))
          .catch(() => {});
      };
      const stop = () => {
        const clip = videoRef.current;
        x(0);
        y(0);
        if (!clip) return;
        clip.pause();
        clip.style.opacity = "0";
        rewind = window.setTimeout(() => (clip.currentTime = 0), 220);
      };
      const move = (event: PointerEvent) => {
        const r = box.getBoundingClientRect();
        x((r.left + r.width / 2 - event.clientX) * 0.15);
        y((r.top + r.height / 2 - event.clientY) * 0.15);
      };
      const enter = (event: PointerEvent) => event.pointerType !== "touch" && start();
      const focusIn = (event: FocusEvent) => (event.target as HTMLElement).matches(":focus-visible") && start();
      const focusOut = () => !card.matches(":hover") && stop();
      const leave = () => !card.contains(document.activeElement) && stop();

      card.addEventListener("focusin", focusIn);
      card.addEventListener("focusout", focusOut);
      if (fine) {
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
      }
      return () => {
        window.clearTimeout(rewind);
        videoRef.current?.pause();
        card.removeEventListener("focusin", focusIn);
        card.removeEventListener("focusout", focusOut);
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [motion, video], revertOnUpdate: true },
  );

  return (
    <div ref={boxRef} className={cn("relative overflow-hidden bg-ink", className)}>
      {/* Oversized by 10% each side so the ±7.5% drift never shows an edge. */}
      <div ref={layerRef} className="absolute -inset-[10%] motion-reduce:inset-0 motion-off:inset-0">
        {still}
        {video && motion ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-200 ease-linear"
          />
        ) : null}
      </div>
    </div>
  );
}
