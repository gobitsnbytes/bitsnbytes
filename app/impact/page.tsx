"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { Users, Award, ShieldAlert, Sparkles, Globe } from "lucide-react";

import { GlassContainer } from "@/components/ui/glass-container";
import { LoadingInline } from "@/components/loading-wrapper";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
  GlowingCardNumber,
} from "@/components/ui/glowing-card";

// Lazy load heavy components
const TeamGlobe = dynamic(() => import("@/components/team-globe"), {
  loading: () => <LoadingInline />,
  ssr: false,
});

const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

const highlightStats = [
  {
    value: "1,400+",
    label: "Active Community Members",
    description: "Teen builders active nationwide across India",
    timeframe: "Scale",
  },
  {
    value: "5+ Forks",
    label: "Local Hubs",
    description: (
      <span>
        City chapters under upstream governance —{" "}
        <Link
          href="/fork"
          className="text-[var(--brand-coral)] underline hover:text-white transition-colors"
        >
          gobitsnbytes.org/fork
        </Link>
      </span>
    ),
    timeframe: "Distribution",
  },
  {
    value: "4+ Events",
    label: "Nationwide Events",
    description: "Hackathons, hardware meetups, and developer workshops",
    timeframe: "Track Record",
  },
  {
    value: "16.5 Years",
    label: "Mean Team Age",
    description: "100% youth-led engineering and operations team",
    timeframe: "Mean Age",
  },
];

const culturePillars = [
  {
    title: "Ship or dip",
    copy: "Talking about your idea is easy. We'd rather have a working prototype by Sunday than a perfect slide deck by next month.",
  },
  {
    title: "Your squad keeps you honest",
    copy: "Mentors, pods, and the kind of peer pressure that makes you actually finish things. Nobody ghosts a project when their team is waiting on their code.",
  },
  {
    title: "Built for users, not grades",
    copy: "School operations, civic tech, accessibility tools. The things we ship get used by real people, not just submitted for a rubric.",
  },
];

export default function Impact() {
  return (
    <>
      {/* Hero Section - Consistent with /press and /contact */}
      <section
        className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="impact-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                Community Impact
              </span>
              <h1
                id="impact-hero-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl"
              >
                Beyond the Venue Walls
              </h1>
              <p className="max-w-2xl text-white/80 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                From first-time hackathons to squads inside local schools, we build experiences that get teens building, and we ship the results publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Matching max-w-5xl and padding of /press */}
      <main className="relative z-10 bg-transparent pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section 1: Outcomes and Globe */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="pink">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                    <Globe className="h-6 w-6 text-[var(--brand-pink)]" />
                    Teen-led squads, shipped outcomes
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    Workshops and hackathons that give you hands-on practice, access to mentors, and a chance to deploy things people actually use.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
                {/* 3D Globe Visual */}
                <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <Suspense fallback={<LoadingInline />}>
                    <TeamGlobe />
                  </Suspense>
                </div>

                {/* Highlight Stats Column */}
                <div className="space-y-6">
                  {highlightStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, type: "spring", bounce: 0 }}
                      className="flex flex-col border-b border-white/10 pb-4 last:border-none last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          {stat.value}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-pink)]">
                          {stat.timeframe}
                        </span>
                      </div>
                      <p className="text-base font-bold text-white mt-1">
                        {stat.label}
                      </p>
                      <p className="text-xs text-white/60 font-medium mt-0.5">
                        {stat.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Section 2: Culture & Core Principles */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="coral">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                    <Award className="h-6 w-6 text-[var(--brand-coral)]" />
                    Culture & Core Principles
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    These aren't wall posters. This is how we actually operate every day.
                  </p>
                </div>
              </div>

              {/* Symmetric Culture Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {culturePillars.map((pillar, idx) => (
                  <GlowingCard key={pillar.title} animationDelay={idx * 0.1}>
                    <div className="space-y-3 p-1">
                      <GlowingCardNumber index={idx + 1} />
                      <GlowingCardTitle className="mt-2 text-lg">
                        {pillar.title}
                      </GlowingCardTitle>
                      <GlowingCardDescription className="text-xs">
                        {pillar.copy}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                ))}
              </div>
            </div>
          </GlassContainer>

        </div>
      </main>
    </>
  );
}
