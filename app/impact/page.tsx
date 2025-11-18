"use client"

import ImpactVisualization from "@/components/impact-visualization"
import Image from "next/image"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import { SlideTabs } from "@/components/ui/slide-tabs"
import { PageSection } from "@/components/page-section"

const highlightStats = [
  { value: "80+", label: "Students active", description: "From across Lucknow" },
  { value: "10", label: "Schools represented", description: "Cross-campus exchange" },
  { value: "50+", label: "Projects launched", description: "Products, apps, AI" },
  { value: "1st", label: "Student-led hackathon", description: "Scrapyard Lucknow 2024" },
]

const culturePillars = [
  {
    title: "Innovation first",
    copy: "Every prompt becomes a prototype. We encourage bold experiments and rapid iteration.",
  },
  {
    title: "Community power",
    copy: "Mentors, pods, and accountability partners keep everyone shipping and learning.",
  },
  {
    title: "Real-world impact",
    copy: "We solve for real audiences, from school ops to civic tech to accessibility.",
  },
]

export default function Impact() {
  return (
    <>
      {/* Hero section with shader animation */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ShaderAnimation />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-in-up">
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mb-4 drop-shadow-lg">
              Our Impact
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Transforming teen creativity into real-world impact
            </p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SlideTabs tabs={["Overview", "Stats", "Events", "Projects", "Community"]} defaultTab={0} />
          </div>
        </div>
      </section>

      <main className="bg-transparent">
        <PageSection
          title="Building the future with teen-led squads"
          description="Workshops, hackathons, and labs unlock hands-on practice, industry mentorship, and opportunities to deploy solutions in schools and communities."
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="order-2 w-full max-w-xl justify-self-center lg:order-1">
              <ImpactVisualization />
            </div>
            <div className="order-1 space-y-6 rounded-3xl border border-white/10 bg-card/70 p-8 shadow-[var(--shadow-card)] backdrop-blur-3xl dark:bg-white/5 lg:order-2">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="flex flex-col border-b border-white/10 pb-5 last:border-none last:pb-0">
                  <span className="text-4xl font-bold text-[var(--brand-pink)]">{stat.value}</span>
                  <p className="text-lg font-semibold text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Event highlight"
          title="Scrapyard Lucknow 2024"
          description="Our debut hackathon united 40+ coders, designers, filmmakers, and builders to tackle civic, education, and sustainability problems."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                image: "/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg",
                title: "Community United",
                copy: "40+ talented developers united for innovation",
              },
              {
                image: "/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg",
                title: "Creative Ideation",
                copy: "Brainstorming solutions to real-world problems",
              },
              {
                image: "/images/4c59e5bb-c1eb-4e4d-9b69-f29faa693002-1-105-c.jpeg",
                title: "Project Showcase",
                copy: "Presenting prototypes to judges and community",
              },
            ].map((card, idx) => (
              <div key={card.title} className="card-surface overflow-hidden p-0">
                <div className="relative h-60 w-full">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="font-display text-xl text-foreground">{card.title}</p>
                  <p className="text-sm text-muted-foreground">{card.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Culture"
          title="What we stand for"
          description="We’re intentional about the energy in every room—how we collaborate, how we support each other, how we chase impact."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {culturePillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/70 to-white/30 p-6 text-left shadow-[var(--shadow-card)] backdrop-blur-2xl dark:from-white/5 dark:to-white/0"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--brand-pink)]">0{idx + 1}</p>
                <h3 className="mt-3 font-display text-xl text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </PageSection>
      </main>
    </>
  )
}
