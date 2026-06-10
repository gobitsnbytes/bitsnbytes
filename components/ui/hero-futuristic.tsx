"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { heroEvents } from "@/lib/events-data";
import { Button } from "@/components/ui/button";

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
      className="relative text-[#120f0a] w-full max-w-full py-8 md:py-12"
      aria-labelledby="home-hero-title"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8 lg:gap-10 px-4 pt-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-10 box-border">
        {/* Left content card */}
        <div className="flex-1 min-w-0">
          <div className="h-full bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col h-full gap-6 sm:gap-8">
              {/* Teen-led badge */}
              <span className="inline-flex w-fit items-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
                <Sparkles className="h-4 w-4 fill-current" />
                TEEN-LED
              </span>

              {/* Main content */}
              <div className="space-y-4">
                <h1
                  id="home-hero-title"
                  className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-none text-[#120f0a] tracking-tight uppercase"
                >
                  India&apos;s boldest <br className="hidden sm:block" />
                  builder network
                </h1>
                <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] text-[#97192c]">
                  innovate. collaborate. hack.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-[#413f3b] max-w-xl leading-relaxed font-semibold">
                  Hackathons, dev squads, and launches. Fully student-led, fully
                  independent. No adults in the room.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row w-full mt-2">
                <Button
                  asChild
                  className="w-full sm:flex-1 h-14 rounded-none bg-[#97192c] text-sm font-black uppercase tracking-wider text-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
                  className="w-full sm:flex-1 h-14 rounded-none bg-white text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
              <div className="mt-auto border-t-4 border-[#120f0a] pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <p className="text-2xl sm:text-3xl font-black text-[#120f0a] leading-none uppercase">
                          {isFork ? (
                            <Link href="/fork" className="hover:text-[#fc920d] transition-colors underline decoration-[#120f0a] decoration-2">
                              5+ Forks
                            </Link>
                          ) : (
                            stat.value
                          )}
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[#716f6c] font-black mt-1.5">
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
          <div className="h-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto border-4 border-[#120f0a] bg-white shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[10px_10px_0px_0px_#120f0a]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-[#eae8e4]"
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            {/* Sticker / Card Info Box Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white border-3 border-[#120f0a] p-5 shadow-[4px_4px_0px_0px_#120f0a] z-20 space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 border-[#120f0a] text-[10px] font-mono font-bold uppercase tracking-widest ${
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
                <h3 className="font-display text-2xl font-black text-[#120f0a] uppercase tracking-tight flex items-center gap-2 leading-none">
                  {heroEvents[activeSlide].title}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-[#413f3b] text-sm font-semibold mt-1">
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
                    className={`h-2.5 rounded-none border border-[#120f0a] transition-all duration-200 ${idx === activeSlide ? "w-6 bg-[#97192c]" : "w-2.5 bg-[#d0cfce] hover:bg-white"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={idx === activeSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HeroFuturistic;
