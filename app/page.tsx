"use client";

import Link from "next/link";
import {
  ArrowRight,
  CodeXml,
  Users,
  Rocket,
  Lightbulb,
  Trophy,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { HeroFuturistic } from "@/components/ui/hero-futuristic";
import { PageSection } from "@/components/page-section";
import { Features } from "@/components/ui/features-8";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingInline } from "@/components/loading-wrapper";
import { Partners } from "@/components/partners";

// Lazy load heavy components
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

const Testimonial = dynamic(
  () =>
    import("@/components/ui/design-testimonial").then((mod) => ({
      default: mod.Testimonial,
    })),
  {
    loading: () => <LoadingInline />,
    ssr: true,
  },
);

// GlassIcons removed in favor of Features bento grid

const stats = [
  { value: "200+", label: "Active members", detail: "across India" },
  { value: "15+", label: "Projects shipped", detail: "from apps to AI" },
  { value: "10+", label: "Partner schools", detail: "and growing" },
];


// Focus Areas are now handled within the Features component

import { GlassContainer } from "@/components/ui/glass-container";

export default function Home() {
  return (
    <>
      <WebGLShader />
      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        <HeroFuturistic />

        <PageSection
          eyebrow="Impact"
          title="Club-powered learning with real outcomes"
          description="We're a teen-led code club where workshops, hackathons, and build nights lead directly to shipped projects and new opportunities."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <GlassContainer
                key={stat.label}
                className="p-8"
                glowColor={stat.label === "Projects shipped" ? "pink" : "purple"}
              >
                <div className="space-y-4">
                  <p className="text-5xl font-black text-white tracking-tighter">
                    {stat.value}
                  </p>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                      {stat.label}
                    </h3>
                    <p className="text-base text-white/60 font-medium">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        <PageSection
          eyebrow="What We Do"
          title="Our Focus Areas"
          description="Explore the different ways we help teens build, learn, and grow in tech"
          align="center"
        >
          <Features />
        </PageSection>

        <Partners />

        <PageSection
          eyebrow="Stories"
          title="Voices from the crew"
          align="center"
        >
          <Suspense fallback={<LoadingInline />}>
            <Testimonial />
          </Suspense>
        </PageSection>
      </div>
    </>
  );
}
