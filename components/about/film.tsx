"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { EDITION_GUTTER } from "@/components/edition";

// Clip opens and closes on pure black: `lighten` turns that black into the ink surface colour and the
// edge mask feathers the frame, so the first/last frames are indistinguishable from the page.
const FADE =
  "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)";

export function AboutFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const motion = useMotionEnabled();
  const [muted, setMuted] = useState(true);

  // Play only while on screen; nothing loads until it is near the viewport.
  useEffect(() => {
    const v = ref.current;
    if (!v || !motion) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [motion]);

  return (
    <section data-surface="ink" aria-label="Film" className="tone-ink relative py-16 md:py-24">
      <div className={cn("relative mx-auto max-w-[1600px] px-4 md:px-8", EDITION_GUTTER)}>
        <video
          ref={ref}
          className="aspect-[23/12.5] w-full bg-transparent object-cover"
          style={{ maskImage: FADE, WebkitMaskImage: FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in", mixBlendMode: "lighten" }}
          muted={muted}
          loop
          playsInline
          preload="none"
          controls={!motion}
          aria-label="Short film from the bits&bytes™ community"
        >
          <source src="/video/ash-no-cash-960.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/video/ash-no-cash.mp4" type="video/mp4" />
        </video>
        {motion ? (
          <button
            type="button"
            onClick={() => {
              setMuted((m) => !m);
              ref.current?.play().catch(() => {});
            }}
            className="absolute bottom-2 right-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper/70 hover:text-signal md:right-8"
          >
            [{muted ? "Sound on" : "Sound off"}]
          </button>
        ) : null}
      </div>
    </section>
  );
}
