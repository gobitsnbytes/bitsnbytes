"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { PageSection } from "@/components/page-section";
import { GlassContainer } from "@/components/ui/glass-container";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
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
    value: "1,500+",
    label: "Active Community Members",
    description: "Teen builders across India",
    timeframe: "Growing fast ↑",
  },
  {
    value: "2,700",
    label: "Submissions Evaluated",
    description: "Reviewed by the bits&bytes™ team in a 3-day sprint",
    timeframe: "3 days ↑",
  },
  {
    value: "900/day",
    label: "Evaluation Throughput",
    description: "Reviewing projects fast with a small team.",
    timeframe: "Execution benchmark ↑",
  },
  {
    value: "100%",
    label: "Student-led",
    description: "Community built for teens",
    timeframe: "Always will be",
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
      <section
        className="relative min-h-[72vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="impact-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto w-full max-w-[860px] min-h-[460px] md:min-h-[500px] px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--brand-pink) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--brand-pink)" />
                </span>
                Impact
              </span>
              <h1
                id="impact-hero-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold text-white tracking-tighter drop-shadow-2xl"
              >
                Our impact hits <br className="hidden sm:block" /> beyond the
                venue walls
              </h1>
              <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/85 font-medium leading-relaxed">
                From first-time hackathons to squads inside local schools, we
                build experiences that get teens building, and we ship the
                results publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-transparent">
        <PageSection
          title="Teen-led squads, shipped outcomes"
          description="Workshops and hackathons that give you hands-on practice, access to mentors, and a chance to deploy things people actually use."
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="order-2 w-full justify-self-center lg:order-1">
              <GlassContainer
                className="h-[300px] sm:h-[400px] lg:h-[500px]"
                animated={false}
              >
                <Suspense fallback={<LoadingInline />}>
                  <TeamGlobe />
                </Suspense>
              </GlassContainer>
            </div>
            <div className="order-1 lg:order-2">
              <GlassContainer className="p-8 h-full" glowColor="pink" interactive>
                <div className="space-y-6">
                  {highlightStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring", bounce: 0 }}
                      className="flex flex-col border-b border-white/10 pb-5 last:border-none last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-black text-white">
                          {stat.value}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-(--brand-pink)">
                          {stat.timeframe}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-white mt-1">
                        {stat.label}
                      </p>
                      <p className="text-sm text-white/60 font-medium">
                        {stat.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassContainer>
            </div>
          </div>
        </PageSection>



        <PageSection
          align="center"
          eyebrow="Culture"
          title="What we stand for"
          description="These aren't wall posters. This is how we actually operate."
        >
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
            {culturePillars.map((pillar, idx) => {
              // Define grid areas for 3-column layout
              const gridAreas = [
                "md:[grid-area:1/1/2/5]",
                "md:[grid-area:1/5/2/9]",
                "md:[grid-area:1/9/2/13]",
              ];
              return (
                <li key={pillar.title} className={gridAreas[idx]}>
                  <GlowingCard animationDelay={idx * 0.12}>
                    <div className="space-y-3">
                      <GlowingCardNumber index={idx + 1} />
                      <GlowingCardTitle className="mt-3">
                        {pillar.title}
                      </GlowingCardTitle>
                      <GlowingCardDescription>
                        {pillar.copy}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                </li>
              );
            })}
          </ul>
        </PageSection>
      </main>
    </>
  );
}
