"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const testimonials = [
  {
    quote:
      "Most cities don't have a student tech scene. It’s not a lack of talent, it’s just a lack of people around you who are also building. We got tired of waiting for someone else to fix that, so we built bits&bytes™. It's just us doing the unglamorous work, showing up, and giving people a place to finally ship their chaotic, half-baked ideas together.",
    author: "Aadrika Maurya",
    role: "Chief Creative Officer & Chief Operating Officer",
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform for parallax on the large number
  const numberX = useTransform(x, [-200, 200], [-20, 20]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[activeIndex];

  return (
    <div className="flex items-center justify-center py-12 md:py-20 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl px-4 md:px-8"
        onMouseMove={handleMouseMove}
      >
        {/* Oversized index number - positioned to bleed off left edge */}
        <motion.div
          className="absolute -left-8 top-1/2 -translate-y-1/2 text-[12rem] md:text-[28rem] font-bold text-foreground/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          style={{ x: numberX, y: numberY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{
                opacity: 0,
                transform: "scale(0.8)",
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                transform: "scale(1)",
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                transform: "scale(1.1)",
                filter: "blur(10px)",
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Main content - asymmetric layout */}
        <div className="relative flex flex-col md:flex-row">
          {/* Left column - vertical text */}
          <div className="hidden md:flex flex-col items-center justify-center pr-16 border-r border-border">
            <motion.span
              className="text-xs font-mono text-muted-foreground tracking-widest uppercase"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Testimonials
            </motion.span>

            {/* Vertical progress line */}
            <div className="relative h-32 w-px bg-border mt-8">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-foreground"
                style={{ transformOrigin: "top" }}
                animate={{
                  transform: `scaleY(${(activeIndex + 1) / testimonials.length})`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Center - main content */}
          <div className="flex-1 md:pl-16 py-8 md:py-12">
            {/* Company badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, transform: "translateX(-20px)" }}
                animate={{ opacity: 1, transform: "translateX(0px)" }}
                exit={{ opacity: 0, transform: "translateX(20px)" }}
                transition={{ duration: 0.4 }}
                className="mb-6 md:mb-8"
              >
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-pink)]" />
                  {current.company}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Quote with character reveal */}
            <div className="relative mb-8 md:mb-12 min-h-[120px] md:min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.15] tracking-tight"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {current.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: {
                            duration: 0.5,
                            delay: i * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2, delay: i * 0.02 },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0, transform: "translateY(-20px)" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* Animated line before name */}
                  <motion.div
                    className="w-8 h-px bg-[var(--brand-pink)]"
                    initial={{ transform: "scaleX(0)" }}
                    animate={{ transform: "scaleX(1)" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                  <div>
                    <p className="text-base font-medium text-foreground">
                      {current.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {current.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={goPrev}
                  className="group relative w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden hover:border-[var(--brand-pink)] transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous testimonial"
                >
                  <motion.div
                    className="absolute inset-0 bg-foreground"
                    initial={{ x: "-100%" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="relative z-10 text-foreground group-hover:text-[var(--brand-pink)] transition-colors"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>

                {/* Progress indicator */}
                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                  <span className="text-foreground font-medium">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span>/</span>
                  <span>{String(testimonials.length).padStart(2, "0")}</span>
                </div>

                <motion.button
                  onClick={goNext}
                  className="group relative w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden hover:border-[var(--brand-pink)] transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next testimonial"
                >
                  <motion.div
                    className="absolute inset-0 bg-foreground"
                    initial={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="relative z-10 text-foreground group-hover:text-[var(--brand-pink)] transition-colors"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker - subtle repeating company names */}
        <div className="absolute -bottom-16 left-0 right-0 overflow-hidden opacity-[0.08] pointer-events-none">
          <motion.div
            className="flex whitespace-nowrap text-4xl md:text-6xl font-bold tracking-tight"
            animate={{ transform: ["translateX(0px)", "translateX(-1000px)"] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8">
                {testimonials.map((t) => t.company).join(" • ")} •
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
