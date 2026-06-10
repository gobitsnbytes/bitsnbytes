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
import { Button } from "@/components/ui/button";
import { LoadingInline } from "@/components/loading-wrapper";
import { Partners } from "@/components/partners";

// Lazy load heavy components
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
  { value: "1400+", label: "Community Members", detail: "active builders nationwide" },
  { 
    value: "5+ Forks", 
    label: "Local Hubs", 
    detail: (
      <span>
        city chapters — view at{" "}
        <a 
          href="/fork" 
          className="text-primary dark:text-accent underline hover:text-accent dark:hover:text-primary transition-colors font-bold"
        >
          gobitsnbytes.org/fork
        </a>
      </span>
    )
  },
  { value: "4+ Events", label: "Nationwide Events", detail: "hackathons and workshops" },
  { value: "16.5 Years", label: "Mean Team Age", detail: "average age of our team" },
];

// Focus Areas are now handled within the Features component

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        <HeroFuturistic />

        <PageSection
          eyebrow="Impact"
          title="Shipped, not just taught"
          description="A teen-led builders network. Workshops and hackathons that end with something shipped, not just something learned."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="bg-card border-4 border-border shadow-[6px_6px_0px_0px_var(--border)] p-8 transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_var(--border)] duration-200"
              >
                <div className="space-y-4 text-card-foreground">
                  <p className="text-4xl font-black text-foreground tracking-tight uppercase">
                    {stat.value}
                  </p>
                  <div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                      {stat.label}
                    </h3>
                    <div className="text-sm text-muted-foreground font-semibold mt-1">
                      {stat.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection
          eyebrow="What We Do"
          title="What we actually do"
          description="The stuff we run"
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
