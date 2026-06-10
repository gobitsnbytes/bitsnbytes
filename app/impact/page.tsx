"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { Users, Award, ShieldAlert, Sparkles, Globe, ArrowUpRight } from "lucide-react";
import { LoadingInline } from "@/components/loading-wrapper";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

// Starburst icon for Neobrutalist decoration
const Starburst = ({ className = "text-[#97192c]", size = 32 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 0 L58 28 L85 15 L70 39 L97 50 L70 61 L85 85 L58 72 L50 100 L42 72 L15 85 L30 61 L3 50 L30 39 L15 15 L42 28 Z" />
  </svg>
);

// Lazy load heavy 3D globe component
const TeamGlobe = dynamic(() => import("@/components/team-globe"), {
  loading: () => <LoadingInline />,
  ssr: false,
});

const highlightStats = [
  {
    value: "1,400+",
    label: "Active Community Members",
    description: "Teen builders active nationwide across India",
    timeframe: "Scale",
    bgColor: "bg-[#fee9cf]", // Orange light tint
  },
  {
    value: "5+ Forks",
    label: "Local Hubs",
    description: (
      <span>
        City chapters under upstream governance —{" "}
        <Link
          href="/fork"
          className="text-[#97192c] underline hover:text-[#fc920d] transition-colors font-bold"
        >
          gobitsnbytes.org/fork
        </Link>
      </span>
    ),
    timeframe: "Distribution",
    bgColor: "bg-[#f4d9d1]", // Warm accent tint
  },
  {
    value: "4+ Events",
    label: "Nationwide Events",
    description: "Hackathons, hardware meetups, and developer workshops",
    timeframe: "Track Record",
    bgColor: "bg-[#fee9cf]", // Orange light tint
  },
  {
    value: "16.5 Years",
    label: "Mean Team Age",
    description: "100% youth-led engineering and operations team",
    timeframe: "Mean Age",
    bgColor: "bg-[#f4d9d1]", // Warm accent tint
  },
];

const culturePillars = [
  {
    title: "Ship or dip",
    copy: "Talking about your idea is easy. We'd rather have a working prototype by Sunday than a perfect slide deck by next month.",
    bgColor: "bg-[#fee9cf]",
  },
  {
    title: "Your squad keeps you honest",
    copy: "Mentors, pods, and the kind of peer pressure that makes you actually finish things. Nobody ghosts a project when their team is waiting on their code.",
    bgColor: "bg-[#f4d9d1]",
  },
  {
    title: "Built for users, not grades",
    copy: "School operations, civic tech, accessibility tools. The things we ship get used by real people, not just submitted for a rubric.",
    bgColor: "bg-[#fee9cf]",
  },
];

export default function Impact() {
  return (
    <div className="w-full min-h-screen bg-[#eae8e4] text-[#120f0a] pt-28 pb-20 relative z-10 font-sans selection:bg-[#fc920d] selection:text-[#120f0a]">
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.06] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Banner Header */}
        <header className="mb-12 border-b-4 border-[#120f0a] pb-10 relative">
          <div className="absolute -right-6 -top-6 hidden md:block animate-spin-slow">
            <Starburst size={80} className="text-[#97192c]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#97192c] text-white border-2 border-[#120f0a] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <Sparkles className="h-3.5 w-3.5 text-[#fc920d]" />
              Impact Record
            </span>
            <span className="text-xs font-mono text-[#716f6c] font-semibold">
              GOBITSNBYTES FOUNDATION
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#120f0a] leading-none mb-6">
            Beyond the <br />
            <span className="bg-[#fc920d] px-2 py-0.5 border-[3px] border-[#120f0a] inline-block shadow-[4px_4px_0px_0px_#120f0a] -rotate-1">venue walls</span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-[#413f3b] max-w-[70ch] leading-relaxed">
            From first-time hackathons to squads inside local schools, we build experiences that get teens building, and we ship the results publicly.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="space-y-12">
          
          {/* Section 1: Outcomes and Globe */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#120f0a]/15 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider">
                    <Globe className="h-6 w-6 text-[#97192c]" />
                    Teen-led squads, shipped outcomes
                  </h2>
                  <p className="text-sm text-[#716f6c] font-medium mt-1">
                    Workshops and hackathons that give you hands-on practice, access to mentors, and a chance to deploy things people actually use.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
                {/* 3D Globe Visual */}
                <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px] rounded-none overflow-hidden border-3 border-[#120f0a] bg-[#f4d9d1]/20 shadow-[4px_4px_0px_0px_#120f0a]">
                  <Suspense fallback={<LoadingInline />}>
                    <TeamGlobe />
                  </Suspense>
                </div>

                {/* Highlight Stats Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlightStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                      className={cn(
                        "flex flex-col border-3 border-[#120f0a] p-5 shadow-[3px_3px_0px_0px_#120f0a] rounded-none",
                        stat.bgColor
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-3xl font-black text-[#120f0a] tracking-tighter">
                          {stat.value}
                        </span>
                        <span className="inline-flex items-center border border-[#120f0a] bg-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#97192c]">
                          {stat.timeframe}
                        </span>
                      </div>
                      <p className="text-sm font-black text-[#120f0a] mt-3 uppercase tracking-tight leading-tight">
                        {stat.label}
                      </p>
                      <p className="text-xs text-[#413f3b] font-medium mt-1 leading-snug">
                        {stat.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Culture & Core Principles */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#120f0a]/15 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider">
                    <Award className="h-6 w-6 text-[#fc920d]" />
                    Culture & Core Principles
                  </h2>
                  <p className="text-sm text-[#716f6c] font-medium mt-1">
                    These aren't wall posters. This is how we actually operate every day.
                  </p>
                </div>
              </div>

              {/* Culture Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {culturePillars.map((pillar, idx) => (
                  <div 
                    key={pillar.title}
                    className={cn(
                      "border-3 border-[#120f0a] p-5 shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none flex flex-col justify-between",
                      pillar.bgColor
                    )}
                  >
                    <div>
                      <span className="inline-block border-2 border-[#120f0a] bg-white text-[#120f0a] font-mono font-black text-xs px-2.5 py-1 mb-4 shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                        0{idx + 1}
                      </span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-[#120f0a] mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[#413f3b] leading-relaxed">
                        {pillar.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
