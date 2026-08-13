"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Play, Sparkles, Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import { heroEvents } from "@/lib/events-data";
import { Button } from "@/components/ui/button";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

const stats = [
  { value: "1400+", label: "Active Members" },
  { value: "5+ Forks", label: "Local Hubs" },
  { value: "4+ Events", label: "Nationwide" },
  { value: "16.5 Yrs", label: "Mean Team Age" },
];

export const HeroFuturistic = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroEvents.length);
  }, []);

  const playMovie = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    const nextIndex = (activeSlide + 1) % heroEvents.length;
    const nextEvent = heroEvents[nextIndex];
    const sources = [nextEvent.image, nextEvent.imageMobile].filter(Boolean);

    sources.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src as string;
    });
  }, [activeSlide]);

  useEffect(() => {
    if (!isMovieOpen) {
      return;
    }

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

  const shadowColor = isMounted && theme === "dark" ? "#fc920d" : "#97192c";

  return (
    <section
      className="relative text-foreground w-full max-w-full pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12 overflow-hidden"
      aria-labelledby="home-hero-title"
    >
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full fill-[#120f0a]/5 stroke-[#120f0a]/5 dark:fill-[#fee9cf]/5 dark:stroke-[#fee9cf]/5"
        )}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 lg:flex-row lg:items-stretch box-border">
        {/* Left content card */}
        <div className="flex-1 min-w-0">
          <div className="h-full bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-5 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="flex flex-col h-full gap-6 sm:gap-8">
              {/* Teen-led badge */}
              <span className="inline-flex w-fit items-center gap-2 border-2 border-border bg-[#fc920d] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[3px_3px_0px_0px_var(--border)]">
                <Sparkles className="h-4 w-4 fill-current" />
                TEEN-LED
              </span>

              {/* Main content */}
              <div className="space-y-4">
                <h1
                  id="home-hero-title"
                  className="font-display text-[2.25rem] sm:text-5xl md:text-6xl xl:text-7xl font-black leading-none text-foreground tracking-tight uppercase"
                >
                  India&apos;s{" "}
                  <LineShadowText className="italic" shadowColor={shadowColor}>
                    boldest
                  </LineShadowText>{" "}
                  <br className="hidden sm:block" />
                  builder network
                </h1>
                <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] text-[#97192c] dark:text-[#fc920d]">
                  innovate. collaborate. hack.
                </p>
                <p className="text-sm sm:text-base md:text-lg xl:text-xl text-foreground max-w-xl leading-relaxed font-semibold">
                  Hackathons, dev squads, and launches. Fully student-led, fully
                  independent. No adults in the room.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row w-full mt-1 sm:mt-2">
                <Button
                  asChild
                  className="w-full sm:flex-1 h-12 sm:h-14 rounded-none bg-[#97192c] text-sm font-black uppercase tracking-wider text-white border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Link
                    href="/join"
                    className="flex items-center justify-center gap-2"
                  >
                    Join the crew
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:flex-1 h-12 sm:h-14 rounded-none bg-card text-sm font-black uppercase tracking-wider text-foreground border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  onClick={openMovie}
                  aria-haspopup="dialog"
                  aria-expanded={isMovieOpen}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Play className="h-4 w-4 shrink-0 fill-current" />
                    Watch movie
                  </span>
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row w-full">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 h-11 rounded-none bg-transparent text-[11px] font-black uppercase tracking-[0.22em] text-foreground border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Link href="/prospectus" className="flex items-center justify-center gap-2">
                    View prospectus
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 h-11 rounded-none bg-[#fda83d] text-[11px] font-black uppercase tracking-[0.22em] text-[#120f0a] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Link href="/prospectus?download=1" download className="flex items-center justify-center gap-2">
                    Download PDF
                    <Sparkles className="h-3.5 w-3.5 shrink-0 fill-current" />
                  </Link>
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="mt-auto border-t-4 border-border pt-4 sm:pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((stat, idx) => {
                    const isFork = stat.value === "5+ Forks";
                    return (
                      <motion.div
                        key={stat.label}
                        className="text-center sm:text-left"
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-none uppercase">
                          {isFork ? (
                            <Link href="/fork" className="hover:text-[#fc920d] transition-colors underline decoration-border decoration-2">
                              5+ Forks
                            </Link>
                          ) : (
                            stat.value
                          )}
                        </p>
                        <p className="text-[9px] sm:text-[10px] md:text-[11px] font-mono uppercase tracking-[0.08em] sm:tracking-[0.1em] text-foreground/80 font-black mt-1 sm:mt-1.5">
                          {stat.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Event Slideshow */}
        <Link
          href={heroEvents[activeSlide].href}
          className="relative flex-1 min-w-0 block group focus-visible:outline-none rounded-none transition-transform duration-300 active:scale-[0.99]"
          aria-label={`View details for ${heroEvents[activeSlide].title}`}
        >
          <div className="h-full aspect-[4/3] xs:aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto min-h-[260px] sm:min-h-[340px] border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--border)] relative overflow-hidden transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[10px_10px_0px_0px_var(--border)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-background"
              >
                <Image
                  src={heroEvents[activeSlide].image}
                  alt={heroEvents[activeSlide].alt}
                  fill
                  sizes="(max-width: 639px) 0px, (max-width: 1023px) 100vw, 42vw"
                  className={`hidden sm:block object-cover transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    loadedSlides[activeSlide] ? "opacity-100" : "opacity-0"
                  }`}
                  priority={activeSlide === 0}
                  onLoad={() =>
                    setLoadedSlides((slides) => ({ ...slides, [activeSlide]: true }))
                  }
                />
                <Image
                  src={heroEvents[activeSlide].imageMobile ?? heroEvents[activeSlide].image}
                  alt={heroEvents[activeSlide].alt}
                  fill
                  sizes="100vw"
                  className={`block sm:hidden object-cover transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    loadedSlides[activeSlide] ? "opacity-100" : "opacity-0"
                  }`}
                  priority={activeSlide === 0}
                  onLoad={() =>
                    setLoadedSlides((slides) => ({ ...slides, [activeSlide]: true }))
                  }
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            {/* Sticker / Card Info Box Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-card border-3 border-border p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)] z-20 space-y-2 sm:space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 border-border text-[10px] font-mono font-bold uppercase tracking-widest ${
                  heroEvents[activeSlide].status === "upcoming"
                    ? "bg-[#fda83d] text-[#120f0a]"
                    : "bg-[#d0cfce] text-[#120f0a]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    heroEvents[activeSlide].status === "upcoming"
                      ? "bg-[#97192c] animate-pulse"
                      : "bg-[#120f0a]"
                  }`}
                />
                {heroEvents[activeSlide].badge}
              </span>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2 leading-none">
                  {heroEvents[activeSlide].title}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-foreground/80 text-sm font-semibold mt-1">
                  {heroEvents[activeSlide].subtitle}
                </p>
              </div>

              {/* Dot indicators */}
              <div
                className="flex items-center gap-2 pt-1"
                role="tablist"
                aria-label="Hero event slides"
              >
                {heroEvents.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveSlide(idx);
                    }}
                    className={`h-2.5 rounded-none border border-border transition-all duration-200 ${idx === activeSlide ? "w-6 bg-[#97192c]" : "w-2.5 bg-muted hover:bg-card"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={idx === activeSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {isMounted &&
        createPortal(
          <motion.div
            className={`fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(18,15,10,0.86)] px-3 py-5 backdrop-blur-md sm:px-6 ${
              isMovieOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isMovieOpen}
            aria-label="bits&bytes movie"
            initial={false}
            animate={{ opacity: isMovieOpen ? 1 : 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            onClick={closeMovie}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={false}
              animate={{
                opacity: isMovieOpen ? 1 : 0,
                y: isMovieOpen ? 0 : 18,
                scale: isMovieOpen ? 1 : 0.98,
                filter: isMovieOpen ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute -inset-2 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(151,25,44,0.9),rgba(252,146,13,0.78),rgba(30,5,9,0.9))] opacity-90 blur-sm" />
              <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(254,233,207,0.24)] bg-[var(--bb-neutral-100)] p-2 shadow-[0_28px_90px_rgba(18,15,10,0.7)] sm:p-3">
                <div className="pointer-events-none absolute inset-0 bg-dither-brand opacity-20" />
                <div className="relative overflow-hidden rounded-[1rem] bg-black">
                  <video
                    ref={videoRef}
                    src="/movie/bnb-movie.mp4"
                    className="block aspect-video max-h-[78vh] w-full object-contain"
                    playsInline
                    controls={false}
                    muted={false}
                    preload="metadata"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-3 py-3 sm:px-4">
                    <span className="inline-flex items-center gap-2 rounded-none border-2 border-white/20 bg-black/35 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      <Volume2 className="h-3.5 w-3.5 text-[var(--brand-coral)]" />
                      Audio on
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-none border-2 border-white/20 bg-black/55 text-white transition-[background-color,transform] duration-100 ease-out hover:bg-black/75 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  onClick={closeMovie}
                  aria-label="Close movie"
                  tabIndex={isMovieOpen ? 0 : -1}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </section>
  );
};

export default HeroFuturistic;
