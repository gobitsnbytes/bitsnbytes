"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroEvents.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] md:rounded-b-[3rem] lg:rounded-b-[3.5rem] text-white w-full max-w-full"
      aria-labelledby="home-hero-title"
    >
      <WebGLShader />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-16 md:px-6 md:pb-12 md:pt-20 lg:pb-16 lg:pt-24 lg:flex-row lg:items-stretch lg:gap-10 box-border">
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
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 h-10 sm:h-12 px-5 sm:px-6 rounded-full border-white/20 bg-white/5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-transform transition-colors transition-opacity hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                >
                  <Link
                    href="/impact"
                    className="flex items-center justify-center"
                  >
                    See what we&apos;ve built
                  </Link>
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
                  initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#0a0a0d]"
                >
                  <Image
                    src={heroEvents[activeSlide].image}
                    alt={heroEvents[activeSlide].alt}
                    fill
                    sizes="(max-width: 639px) 0px, (max-width: 1023px) 100vw, 42vw"
                    className="hidden sm:block object-cover"
                    priority
                  />
                  <Image
                    src={heroEvents[activeSlide].imageMobile ?? heroEvents[activeSlide].image}
                    alt={heroEvents[activeSlide].alt}
                    fill
                    sizes="100vw"
                    className="block sm:hidden object-cover"
                    priority
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
    </section>
  );
};

export default HeroFuturistic;
