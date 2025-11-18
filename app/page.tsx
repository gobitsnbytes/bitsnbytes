"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { HeroFuturistic } from "@/components/ui/hero-futuristic"
import TechShapes from "@/components/tech-shapes"
import { PageSection } from "@/components/page-section"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const stats = [
  { value: "80+", label: "Active members", detail: "across Lucknow" },
  { value: "50+", label: "Projects shipped", detail: "from apps to AI" },
  { value: "10", label: "Partner schools", detail: "and growing" },
]

const stories = [
  {
    quote:
      "Scrapyard hackathon felt electric—40+ teens building, pitching, and cheering each other on. It proved students can run world-class events.",
    name: "Aadrika",
    role: "Community Lead",
  },
  {
    quote:
      "We pair first-time coders with experienced mentors, so everyone ships something real. The confidence boost is unreal.",
    name: "Yash",
    role: "Co-founder & Lead Dev",
  },
  {
    quote:
      "Bits&Bytes gave me my first stage to teach design systems. Now I help younger designers craft bold visuals for events.",
    name: "Saksham",
    role: "Design Lead",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroFuturistic />

      <PageSection
        eyebrow="Impact"
        title="Community-powered learning with real outcomes"
        description="We’re a teen-led code club where workshops, hackathons, and build nights lead directly to shipped projects and new opportunities."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-white/20 bg-white/80 p-6 shadow-[var(--shadow-card)] dark:border-white/5 dark:bg-white/5"
            >
              <CardContent className="p-0">
                <p className="text-4xl font-bold text-[var(--brand-pink)]">{stat.value}</p>
                <CardTitle className="mt-2 text-lg">{stat.label}</CardTitle>
                <CardDescription className="text-base">{stat.detail}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Ways We Build"
        title="Learn, collaborate, and hack with us"
        description="From weekly sessions to multi-day hackathons, we create premium spaces for experimentation, mentorship, and wild ideas."
      >
        <TechShapes />
      </PageSection>

      <PageSection eyebrow="Stories" title="Voices from the crew" align="center">
        <div className="relative">
          <Carousel opts={{ align: "start" }} className="pt-6">
            <CarouselContent>
              {stories.map((story) => (
                <CarouselItem key={story.name} className="md:basis-1/2 lg:basis-1/3">
                  <div className="card-surface h-full flex flex-col gap-4">
                    <p className="text-base text-foreground">“{story.quote}”</p>
                    <div>
                      <p className="font-semibold text-foreground">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        </div>
      </PageSection>

      <PageSection align="center" eyebrow="Join us">
        <div className="glass-panel mx-auto flex w-full max-w-4xl flex-col items-center gap-6 p-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-foreground">
            <Sparkles className="h-3 w-3" />
            Teen-led & premium
          </div>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Ready to host, hack, and mentor with us?
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Apply to join Bits&Bytes, collaborate on design/dev squads, or partner with us to run the next flagship event in Lucknow.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] text-base text-white shadow-[var(--glow-strong)]"
            >
              <Link href="/join">
                Join the Club <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/30 bg-white/40 text-base text-foreground backdrop-blur-xl dark:bg-white/5"
            >
              <Link href="/impact">See the impact</Link>
            </Button>
          </div>
        </div>
      </PageSection>
    </div>
  )
}
