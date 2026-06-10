"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Play, Sparkles, Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import { heroEvents } from "@/lib/events-data";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0908] via-[#2f0a13] to-[#8f2d0c]" />
    ),
  },
);
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";

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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  return (
    <section
      className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[3.5rem] text-white w-full max-w-full"
      aria-labelledby="home-hero-title"
    >
      <WebGLShader />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 pb-6 pt-[7.75rem] sm:px-6 sm:pb-8 sm:pt-[8.25rem] md:px-6 md:pb-12 md:pt-[8.75rem] lg:pb-16 lg:pt-[9rem] lg:flex-row lg:items-stretch lg:gap-10 box-border">
        {/* Left content card */}
        <div className="flex-1 min-w-0">
          <GlassContainer
            className="p-4 sm:p-5 md:p-6 lg:p-8"
            containerClassName="h-full"
          >
            <div className="flex flex-col h-full gap-4 sm:gap-5 md:gap-6">
              {/* Teen-led badge */}
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/80 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 text-(--brand-pink)" />
                TEEN-LED
              </span>

              {/* Main content */}
              <div className="space-y-4">
                <h1
                  id="home-hero-title"
                  className="font-display text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tighter drop-shadow-2xl"
                >
                  India&apos;s boldest <br className="hidden sm:block" />
                  builder network
                </h1>
                <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-(--brand-pink)">
                  innovate. collaborate. hack.
                </p>
                <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xl leading-relaxed">
                  Hackathons, dev squads, and launches. Fully student-led, fully
                  independent. No adults in the room.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row w-full mt-1">
                <Button
                  asChild
                  className="w-full sm:flex-1 h-10 sm:h-12 px-5 sm:px-6 rounded-full bg-(--brand-pink) text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(228,90,146,0.4)] hover:shadow-[0_0_35px_rgba(228,90,146,0.6)] transition-transform transition-colors transition-opacity hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
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
                  className="w-full sm:flex-1 h-10 sm:h-12 px-5 sm:px-6 rounded-full border-white/20 bg-white/5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-transform transition-colors transition-opacity hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
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

              {/* Stats Grid */}
              <GlassContainer
                className="mt-auto p-3 sm:p-4"
                glowColor="none"
                animated={false}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((stat, idx) => {
                    const isFork = stat.value === "5+ Forks";
                    return (
                      <motion.div 
                        key={stat.label} 
                        className="text-center sm:text-left"
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                      >
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-white leading-tight">
                          {isFork ? (
                            <Link href="/fork" className="hover:text-[var(--brand-coral)] transition-colors underline decoration-white/20">
                              5+ Forks
                            </Link>
                          ) : (
                            stat.value
                          )}
                        </p>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/60 font-bold mt-1">
                          {stat.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassContainer>
            </div>
          </GlassContainer>
        </div>

        {/* Right — Event Slideshow */}
        <Link
          href={heroEvents[activeSlide].href}
          className="relative flex-1 min-w-0 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 rounded-[1.75rem] transition-transform duration-300 active:scale-[0.98]"
          aria-label={`View details for ${heroEvents[activeSlide].title}`}
        >
          <GlassContainer
            className="h-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto transition-transform duration-500 group-hover:scale-[1.02]"
            containerClassName="h-full"
            glowColor="pink"
          >
            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 16, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 bg-[#0a0a0d]"
                >
                  <div className="absolute inset-0 bg-dither-brand opacity-70" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 z-20" />

              <div className="absolute bottom-8 left-8 right-8 space-y-2 z-30">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest ${
                    heroEvents[activeSlide].status === "upcoming"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : heroEvents[activeSlide].status === "closed"
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                        : "bg-white/10 border border-white/20 text-white/80"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      heroEvents[activeSlide].status === "upcoming"
                        ? "bg-emerald-500 animate-pulse"
                        : heroEvents[activeSlide].status === "closed"
                          ? "bg-amber-300"
                          : "bg-white/70"
                    }`}
                  />
                  {heroEvents[activeSlide].badge}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-black text-white flex items-center gap-2">
                    {heroEvents[activeSlide].title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </h3>
                  <p className="text-white/60 text-sm font-medium mt-1">
                    {heroEvents[activeSlide].subtitle}
                  </p>
                </div>

                {/* Dot indicators */}
                <div
                  className="flex items-center gap-2 pt-2"
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
                      className={`h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${idx === activeSlide ? "w-6 bg-(--brand-pink)" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                      aria-current={idx === activeSlide}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlassContainer>
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
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                      <Volume2 className="h-3.5 w-3.5 text-[var(--brand-coral)]" />
                      Audio on
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-black/75 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
