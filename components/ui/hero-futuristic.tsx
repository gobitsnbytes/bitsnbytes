"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import dynamic from "next/dynamic";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-purple)]/20 to-[var(--brand-pink)]/20" />
    ),
  },
);
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";

const stats = [
  { value: "200+", label: "Active members" },
  { value: "15+", label: "Projects shipped" },
  { value: "10+", label: "Partner schools" },
];

const heroEvents = [
  {
    image: "/images/github-copilot-hero-desktop.png",
    imageMobile: "/images/github-copilot-hero-mobile.png",
    alt: "GitHub Copilot Dev Days | Lucknow",
    badge: "Upcoming Event",
    status: "upcoming",
    title: "GitHub Copilot Dev Days",
    subtitle: "19 Apr 2026 · Lucknow",
    href: "/events",
  },
  {
    image: "/event_pictures/HEe923uagAATqvy.jpg",
    imageMobile: "/event_pictures/HEe923uagAATqvy.jpg",
    alt: "India Innovates 2026 archive",
    badge: "Archived Event",
    status: "archived",
    title: "India Innovates 2026 Archive",
    subtitle: "28 Mar 2026 · New Delhi",
    href: "/events",
  },
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-20 sm:pt-20 lg:pt-24">
        <AnnouncementBanner
          imageUrl="/banners/cohorts_banner.png"
          imageAlt="Introducing Bits&Bytes Cohorts"
          ctaText="Apply now"
          ctaLink="https://www.gobitsnbytes.org/join-cohort"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 md:px-6 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10 lg:flex-row lg:items-stretch lg:gap-16 box-border">
        {/* Left content card */}
        <div className="flex-[1.2] min-w-0">
          <GlassContainer
            className="p-5 sm:p-6 md:p-8 lg:p-12"
            containerClassName="h-full"
          >
            <div className="flex flex-col h-full gap-6 sm:gap-8 md:gap-10">
              {/* Teen-led badge */}
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/80 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3 w-3 text-(--brand-pink)" />
                TEEN-LED
              </span>

              {/* Main content */}
              <div className="space-y-6">
                <h1 id="home-hero-title" className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter drop-shadow-2xl">
                  India&apos;s boldest <br className="hidden sm:block" />builders club
                </h1>
                <p className="text-sm text-white/80 sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed">
                  We host premium hackathons, design/dev squads, and real-world
                  launches—run entirely by students who want to ship things that
                  matter.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row w-full mt-2">
                <Button
                  asChild
                  className="w-full sm:flex-1 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-(--brand-pink) text-sm sm:text-base font-bold text-white shadow-[0_0_30px_rgba(228,90,146,0.5)] hover:shadow-[0_0_50px_rgba(228,90,146,0.7)] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                >
                  <Link href="/join" className="flex items-center justify-center gap-2">
                    Join the crew
                    <ArrowRight className="h-5 w-5 shrink-0" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:flex-1 h-12 sm:h-14 px-6 sm:px-8 rounded-full border-white/20 bg-white/5 text-sm sm:text-base font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                >
                  <Link href="/impact" className="flex items-center justify-center">See what we&apos;ve built</Link>
                </Button>
              </div>

              {/* Stats Grid */}
              <GlassContainer className="mt-auto p-4 sm:p-6" glowColor="none" animated={false}>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="text-lg sm:text-xl md:text-3xl font-black text-white">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white/60 font-bold">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassContainer>
            </div>
          </GlassContainer>
        </div>

        {/* Right — Event Slideshow */}
        <Link
          href={heroEvents[activeSlide].href}
          className="relative flex-1 min-w-0 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 rounded-[1.75rem]"
          aria-label={`View details for ${heroEvents[activeSlide].title}`}
        >
          <GlassContainer
            className="h-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto transition-transform duration-500 group-hover:scale-[1.02]"
            containerClassName="h-full"
            glowColor="pink"
          >
            <div className="relative h-full w-full overflow-hidden">
              {heroEvents.map((event, idx) => (
                <div
                  key={event.title}
                  className={`absolute inset-0 bg-[#0a0a0d] transition-opacity duration-700 ease-in-out ${idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                  <Image
                    src={event.image}
                    alt={event.alt}
                    fill
                    className={`hidden sm:block object-cover transition-all duration-700 ${idx === 0 ? "object-center scale-[1.05]" : "object-center"}`}
                    priority={idx === 0}
                  />
                  <Image
                    src={event.imageMobile ?? event.image}
                    alt={event.alt}
                    fill
                    className={`block sm:hidden object-cover transition-all duration-700 ${idx === 0 ? "object-center scale-[1.02]" : "object-center"}`}
                    priority={idx === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 z-20" />

              <div className="absolute bottom-8 left-8 right-8 space-y-2 z-30">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest ${heroEvents[activeSlide].status === "upcoming"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-white/10 border border-white/20 text-white/80"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${heroEvents[activeSlide].status === "upcoming"
                      ? "bg-emerald-500 animate-pulse"
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
                  <p className="text-white/60 text-sm font-medium mt-1">{heroEvents[activeSlide].subtitle}</p>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center gap-2 pt-2" role="tablist" aria-label="Hero event slides">
                  {heroEvents.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveSlide(idx); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlide ? "w-6 bg-(--brand-pink)" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
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
