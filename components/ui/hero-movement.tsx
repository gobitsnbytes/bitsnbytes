"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Play, Volume2, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Custom movement easing curve (Emil's ease-out)
const EASE_MOVEMENT = [0.23, 1, 0.32, 1];

// Pool of real community images from the event_pictures directory
const COLLAGE_IMAGES = [
  "/event_pictures/h4g/h4g2.jpeg",
  "/event_pictures/bd1.jpg",
  "/event_pictures/devday.jpeg",
  "/event_pictures/HEe923uagAATqvy.jpg"
];

// Reusable Sub-components for Clean Engineering Architecture

// 1. HeroBadge
interface HeroBadgeProps {
  label: string;
}
export const HeroBadge: React.FC<HeroBadgeProps> = ({ label }) => {
  return (
    <div className="inline-flex items-center gap-2 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] px-2.5 py-1.5 text-[9px] font-mono tracking-widest text-[#120f0a] dark:text-[#faf8f5] select-none">
      <span className="h-1.5 w-1.5 bg-[#97192c] block animate-pulse" />
      {label}
    </div>
  );
};

// 2. HeroHeadline (Tailored scaling for typical laptop screen heights)
interface HeroHeadlineProps {
  emphasis: "italic" | "burgundy-bg";
}
export const HeroHeadline: React.FC<HeroHeadlineProps> = ({ emphasis }) => {
  return (
    <div className="flex flex-col space-y-1 sm:space-y-1.5 font-accent-sans text-4xl sm:text-5xl md:text-6xl lg:text-[2.85rem] xl:text-[4.2rem] 2xl:text-7.5xl tracking-tight leading-[0.85] text-[#120f0a] dark:text-[#faf8f5] uppercase font-normal select-none w-full">
      <div className="flex items-center gap-4">
        <span>India's</span>
        <span className="text-[9px] font-mono tracking-widest text-[#120f0a]/40 dark:text-[#faf8f5]/40 font-normal hidden sm:inline-block">
          [REF: 05/N]
        </span>
      </div>
      <div>
        {emphasis === "italic" ? (
          <span className="font-serif-brand italic text-[#97192c] normal-case pr-4 font-normal block leading-[0.9] tracking-normal">
            BOLDEST
          </span>
        ) : (
          <span className="bg-[#97192c] text-[#faf8f5] dark:text-[#faf8f5] px-4 py-1 inline-block font-bold">
            BOLDEST
          </span>
        )}
      </div>
      <div>builder</div>
      <div className="flex items-baseline gap-2 sm:gap-4">
        <span>network</span>
        <span className="h-1 w-12 sm:w-20 bg-[#120f0a] dark:bg-[#faf8f5] mb-2 inline-block" />
      </div>
    </div>
  );
};

// 3. StatCard
interface StatCardProps {
  value: string;
  label: string;
  coord?: string;
}
export const StatCard: React.FC<StatCardProps> = ({ value, label, coord }) => {
  return (
    <div className="relative border-l border-[#120f0a]/20 dark:border-[#faf8f5]/20 pl-3 py-1 flex flex-col justify-between h-full group hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-colors duration-200">
      <div>
        <div className="font-accent-sans text-2xl sm:text-3xl lg:text-2.5xl xl:text-3.5xl 2xl:text-5xl text-[#120f0a] dark:text-[#faf8f5] leading-none tracking-tight">
          {value}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#120f0a]/60 dark:text-[#faf8f5]/60 mt-1 font-bold leading-tight">
          {label}
        </div>
      </div>
      {coord && (
        <div className="font-mono text-[6px] text-[#120f0a]/30 dark:text-[#faf8f5]/30 mt-2.5 tracking-wider select-none">
          {coord}
        </div>
      )}
    </div>
  );
};

// 4. FloatingAnnotation
interface FloatingAnnotationProps {
  label: string;
  className?: string;
}
export const FloatingAnnotation: React.FC<FloatingAnnotationProps> = ({ label, className }) => {
  return (
    <span
      className={cn(
        "absolute text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-[#120f0a]/50 dark:text-[#faf8f5]/50 select-none pointer-events-none bg-[#faf8f5] dark:bg-[#120f0a] px-1.5 py-0.5 border border-[#120f0a]/10 dark:border-[#faf8f5]/10",
        className
      )}
    >
      {label}
    </span>
  );
};

// 5. ImageCollage (Supports dynamic image rotation + responsive bounds)
export const ImageCollage: React.FC = () => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % COLLAGE_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentImage = COLLAGE_IMAGES[imageIndex];

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-square flex items-center justify-center p-4 max-w-xs sm:max-w-md lg:max-w-[400px] xl:max-w-none mx-auto select-none">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 border border-[#120f0a]/10 dark:border-[#faf8f5]/10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-[20%] border-l border-dashed border-[#120f0a]/5 dark:border-[#faf8f5]/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-[80%] border-l border-dashed border-[#120f0a]/5 dark:border-[#faf8f5]/5 pointer-events-none" />
      <div className="absolute left-0 right-0 top-[30%] border-t border-dashed border-[#120f0a]/5 dark:border-[#faf8f5]/5 pointer-events-none" />
      <div className="absolute left-0 right-0 top-[70%] border-t border-dashed border-[#120f0a]/5 dark:border-[#faf8f5]/5 pointer-events-none" />

      {/* Outer 1px Dimension Box */}
      <div className="absolute inset-4 sm:inset-8 border border-[#120f0a]/20 dark:border-[#faf8f5]/20 blueprint-tick-x blueprint-tick-y text-[#120f0a]/30 dark:text-[#faf8f5]/30 pointer-events-none" />

      {/* Layer 1: Solid Burgundy Offset Block */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 w-[65%] h-[65%] bg-[#97192c] transition-transform duration-300 hover:translate-x-1 hover:translate-y-1 ease-[cubic-bezier(0.23,1,0.32,1)]" />

      {/* Layer 2: Halftone Dot Grid Pattern */}
      <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 w-[55%] h-[55%] blueprint-dot-grid border border-[#120f0a]/10 dark:border-[#faf8f5]/10 pointer-events-none" />

      {/* Layer 3: Solid Black/White Offset Block */}
      <div className="absolute top-[25%] right-[8%] sm:right-[10%] w-[35%] h-[40%] bg-[#120f0a] dark:bg-[#faf8f5] transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 ease-[cubic-bezier(0.23,1,0.32,1)]" />

      {/* Layer 4: Main Photograph Frame with premium crossfade */}
      <div className="absolute inset-[15%] border-2 border-[#120f0a] dark:border-[#faf8f5] bg-[#d0cfce] dark:bg-[#413f3b] overflow-hidden shadow-[4px_4px_0px_0px_#120f0a] dark:shadow-[4px_4px_0px_0px_#faf8f5] hover:shadow-[6px_6px_0px_0px_#120f0a] dark:hover:shadow-[6px_6px_0px_0px_#faf8f5] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.3, ease: EASE_MOVEMENT }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentImage}
              alt="bits&bytes™ movement snapshots"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Architectural Labels & Annotations */}
      <FloatingAnnotation label="EST. 2025" className="top-6 left-6 sm:top-10 sm:left-10" />
      <FloatingAnnotation label="BUILT IN INDIA" className="bottom-6 right-6 sm:bottom-10 sm:right-10" />
      <FloatingAnnotation label="26.8467° N, 80.9462° E" className="bottom-6 left-6 sm:bottom-10 sm:left-10" />
      <FloatingAnnotation label="NO ADULTS IN THE ROOM" className="top-6 right-6 sm:top-10 sm:right-10 text-[#97192c] font-bold" />
      
      {/* Corner dimensions markers */}
      <span className="absolute top-2 left-2 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">SYS_REF: A4</span>
      <span className="absolute bottom-2 right-2 text-[7px] font-mono text-[#120f0a]/30 dark:text-[#faf8f5]/30">SCALE 1:1 // 0.088mm</span>
    </div>
  );
};

// 6. SectionDivider
export const SectionDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative w-full my-8 flex items-center">
      <div className="flex-1 h-[1px] bg-[#120f0a]/15 dark:bg-[#faf8f5]/15" />
      {label && (
        <span className="px-4 text-[8px] font-mono tracking-widest text-[#120f0a]/45 dark:text-[#faf8f5]/45 uppercase select-none">
          {label}
        </span>
      )}
      <div className="flex-1 h-[1px] bg-[#120f0a]/15 dark:bg-[#faf8f5]/15" />
    </div>
  );
};

// Main HeroMovement Component

export const HeroMovement: React.FC = () => {
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playMovie = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  }, []);

  const openMovie = useCallback(() => {
    setIsMovieOpen(true);
    playMovie();
  }, [playMovie]);

  const closeMovie = useCallback(() => {
    setIsMovieOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMovieOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(playMovie, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMovie();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMovie, isMovieOpen, playMovie]);

  return (
    <section className="relative w-full bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] pt-24 pb-12 sm:pt-28 lg:pt-32 xl:pt-36 sm:pb-12 lg:pb-16 transition-colors duration-300 overflow-hidden">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 blueprint-dot-grid pointer-events-none" />

      {/* Main Structural Asymmetrical Layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6 lg:gap-8 xl:gap-16 items-center">
        
        {/* LEFT COLUMN (60% / 7 Columns) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 sm:gap-6 lg:gap-5 xl:gap-6 justify-between">
          <div className="flex flex-col items-start gap-3 sm:gap-4">
            <HeroBadge label="TEEN-LED" />
            <HeroHeadline emphasis="italic" />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Innovate Bullet Line */}
            <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#97192c] uppercase font-bold select-none">
              innovate &bull; collaborate &bull; hack
            </div>

            {/* Supporting Editorial Copy */}
            <div className="font-serif-brand text-base sm:text-lg md:text-xl text-[#120f0a]/85 dark:text-[#faf8f5]/85 max-w-xl leading-relaxed space-y-1.5">
              <p>Hackathons, build guilds, launches, and communities.</p>
              <p>
                Fully student-led. Fully independent.{" "}
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#120f0a]/60 dark:text-[#faf8f5]/60 block sm:inline">
                  No adults in the room.
                </span>
              </p>
            </div>
          </div>

          {/* CTA Buttons - Print & Swiss Aesthetic (Fully Dark Mode Adaptive) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md pt-1.5">
            <Button
              asChild
              className="w-full sm:flex-1 h-12 rounded-none bg-[#97192c] hover:bg-[#791423] text-xs font-black uppercase tracking-wider text-white border border-[#120f0a] dark:border-[#faf8f5] shadow-[4px_4px_0px_0px_#120f0a] dark:shadow-[4px_4px_0px_0px_#faf8f5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] dark:hover:shadow-[6px_6px_0px_0px_#faf8f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-movement cursor-pointer"
            >
              <Link href="/join" className="flex items-center justify-center gap-2">
                Join the crew
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-12 rounded-none bg-[#faf8f5] dark:bg-[#120f0a] hover:bg-[#faf8f5]/80 dark:hover:bg-[#120f0a]/80 text-xs font-black uppercase tracking-wider text-[#120f0a] dark:text-[#faf8f5] border border-[#120f0a] dark:border-[#faf8f5] shadow-[4px_4px_0px_0px_#120f0a] dark:shadow-[4px_4px_0px_0px_#faf8f5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] dark:hover:shadow-[6px_6px_0px_0px_#faf8f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-movement cursor-pointer"
              onClick={openMovie}
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="h-3.5 w-3.5 shrink-0 fill-current" />
                Watch film
              </span>
            </Button>
          </div>

          {/* Metrics / Stats Grid Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#120f0a]/15 mt-3 lg:mt-2 xl:mt-3">
            <StatCard value="1400+" label="Active Members" coord="[LAT.26.8]" />
            <StatCard value="5+" label="Forks" coord="[REF.LKO]" />
            <StatCard value="4+" label="Events" coord="[SYS.ACT]" />
            <StatCard value="16.5" label="Mean Age" coord="[AVG.TNS]" />
          </div>
        </div>

        {/* RIGHT COLUMN (40% / 5 Columns) */}
        <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:pl-4 xl:pl-6">
          <ImageCollage />
        </div>

      </div>

      {/* Editorial Section Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12">
        <SectionDivider label="bits&bytes™ // independent teen builder network" />
      </div>

      {/* Video Modal - Clean Architectural Styling with Dark Mode compatibility */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isMovieOpen && (
              <motion.div
                className="fixed inset-0 z-[80] flex items-center justify-center bg-[#120f0a]/90 px-4 py-6 backdrop-blur-sm pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-label="bits&bytes™ movie"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_MOVEMENT }}
                onClick={closeMovie}
              >
                <motion.div
                  className="relative w-full max-w-4xl bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a] dark:border-[#faf8f5] p-3 shadow-[8px_8px_0px_0px_#120f0a] dark:shadow-[8px_8px_0px_0px_#faf8f5] rounded-none"
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ duration: 0.25, ease: EASE_MOVEMENT }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="absolute top-2 left-4 text-[8px] font-mono text-[#120f0a]/40 dark:text-[#faf8f5]/40 uppercase tracking-widest pointer-events-none">
                    Documentary Film // ARCHIVE_2026
                  </div>
                  
                  <div className="relative mt-6 overflow-hidden border border-[#120f0a] dark:border-[#faf8f5] bg-black">
                    <video
                      ref={videoRef}
                      src="/movie/bnb-movie.mp4"
                      className="block aspect-video w-full object-contain"
                      playsInline
                      controls
                      muted={false}
                      preload="metadata"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-3 py-3">
                      <span className="inline-flex items-center gap-2 border border-white/20 bg-black/40 px-2 py-1 text-[8px] font-mono uppercase tracking-[0.2em] text-white">
                        <Volume2 className="h-3 w-3 text-[#fc920d]" />
                        Audio on
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="absolute right-3 top-2 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#120f0a] dark:text-[#faf8f5] hover:text-[#97192c] transition-colors focus-visible:outline-none"
                    onClick={closeMovie}
                    aria-label="Close movie"
                  >
                    Close <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};

export default HeroMovement;
