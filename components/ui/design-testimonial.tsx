"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Most cities don't have a student tech scene. It's not a lack of talent, it's just a lack of people around you who are also building. We got tired of waiting for someone else to fix that, so we built bits&bytes™. It's just us doing the unglamorous work, showing up, and giving people a place to finally ship their chaotic, half-baked ideas together.",
    author: "Aadrika Maurya",
    role: "Chief Creative Officer & COO",
    company: "bits&bytes™",
  },
  {
    quote:
      "There's a difference between building and shipping, and most people never cross that line. We don't have VC money or fancy decks. We just have a ridiculous amount of conviction that high schoolers should be pushing real projects to real users. Ship first. Panic later. That's the bar.",
    author: "Yash Vardhan Singh",
    role: "Chief Executive Officer",
    company: "bits&bytes™",
  },
  {
    quote:
      "bits&bytes™ started as a cope because my school said no to a CS club. Now, we run hackathons where teenagers actually ship code instead of pitching slide decks. You don't need institutional approval or a five-year plan to build something cool. You just need to ignore the gatekeepers and write the code.",
    author: "Akshat Kushwaha",
    role: "Chief Technology Officer",
    company: "bits&bytes™",
  },
];

export function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  useEffect(() => {
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[activeIndex];

  return (
    <div className="flex items-center justify-center py-6 md:py-12 overflow-hidden px-4 sm:px-6">
      <div className="relative w-full max-w-5xl bg-card border-4 border-border shadow-[8px_8px_0px_0px_var(--border)] p-6 sm:p-10 md:p-14 overflow-hidden">
        {/* Dither grain overlay */}
        <div className="bb-dither pointer-events-none" aria-hidden="true" />
        {/* Halftone accent — top right corner */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bb-halftone opacity-10 pointer-events-none" aria-hidden="true" />

        {/* Main content - asymmetric layout */}
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Left column - vertical text */}
          <div className="hidden md:flex flex-col items-center justify-center pr-10 border-r-2 border-border/20">
            <span
              className="text-xs font-mono font-black text-foreground/50 tracking-widest uppercase"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              Testimonials
            </span>

            {/* Vertical progress line */}
            <div className="relative h-24 w-1 bg-border mt-6">
              <motion.div
                className="absolute top-0 left-0 w-full bg-primary"
                style={{ transformOrigin: "top" }}
                animate={{
                  height: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Center - main content */}
          <div className="flex-1">
            {/* Company badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 text-xs font-mono text-foreground bg-accent border-2 border-border px-3 py-1 shadow-[2px_2px_0px_0px_var(--border)] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {current.company}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Quote */}
            <div className="relative mb-6 md:mb-10 min-h-[160px] sm:min-h-[140px] md:min-h-[120px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-relaxed tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  &ldquo;{current.quote}&rdquo;
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t-2 border-border/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-1 bg-primary" />
                  <div>
                    <p className="text-base font-black text-foreground uppercase tracking-tight">
                      {current.author}
                    </p>
                    <p className="text-xs font-mono font-bold text-[#716f6c] dark:text-[#a09f9d] uppercase tracking-wider">
                      {current.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goPrev}
                  className="w-11 h-11 rounded-none border-2 border-border bg-card text-foreground shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#fc920d] hover:text-[#120f0a] hover:border-border transition-all cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-current">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Progress indicator */}
                <div className="flex items-center gap-1 text-xs font-mono text-[#716f6c] dark:text-[#a09f9d] font-black">
                  <span className="text-foreground">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span>/</span>
                  <span>{String(testimonials.length).padStart(2, "0")}</span>
                </div>

                <button
                  onClick={goNext}
                  className="w-11 h-11 rounded-none border-2 border-border bg-card text-foreground shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#fc920d] hover:text-[#120f0a] hover:border-border transition-all cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-current">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
