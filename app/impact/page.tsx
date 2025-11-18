"use client"

import dynamic from "next/dynamic"
import Image from "next/image"

import ImpactVisualization from "@/components/impact-visualization"
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

const NeonScene = dynamic(() => import("@/components/ui/neon-raymarcher").then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-[32px] bg-black/30" />,
})

export default function Impact() {
  return (
    <>
      <section className="relative min-h-[60vh] overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0">
          <NeonScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-[#05020a]" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center text-white sm:px-6">
          <span className="rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-[0.35em]">
            Impact
          </span>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">Our impact hits beyond the venue walls</h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            From first-high-schooler hackathons to squads embedded inside local schools, we design experiences that get
            teens building—and ship the outcomes publicly.
          </p>
        </div>
      </section>

      <main className="bg-transparent">
        <PageSection
          title="Building the future with teen-led squads"
          description="Workshops, hackathons, and labs unlock hands-on practice, industry mentorship, and opportunities to deploy solutions in schools and communities."
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="order-2 w-full justify-self-center lg:order-1">
              <ImpactVisualization />
            </div>
            <div className="order-1 space-y-6 rounded-3xl border border-white/10 bg-card/70 p-8 shadow-[var(--shadow-card)] backdrop-blur-3xl dark:bg-white/5 lg:order-2">
              {highlightStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex flex-col border-b border-white/10 pb-5 last:border-none last:pb-0"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
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
              <div
                key={card.title}
                className="card-surface overflow-hidden p-0"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
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
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/70 to-white/30 p-6 text-left shadow-[var(--shadow-card)] backdrop-blur-2xl dark:from-white/5 dark:to-white/0 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.12}s` }}
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
