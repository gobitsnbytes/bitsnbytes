"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

      <PageSection
        align="center"
        eyebrow="Join us"
        title="Ready to build the next flagship movement?"
        description="Whether you’re a first-time tinkerer or already leading launches, we’ll plug you into squads, mentors, and events worthy of your ambition."
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[32px] border border-white/20 bg-gradient-to-br from-white/70 to-white/30 p-10 text-center shadow-[var(--shadow-card)] backdrop-blur-3xl dark:from-white/10 dark:to-white/0">
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-white/30 px-4 py-2 uppercase tracking-[0.35em] text-xs text-foreground">
              Workshops
            </span>
            <span className="rounded-full border border-white/30 px-4 py-2 uppercase tracking-[0.35em] text-xs text-foreground">
              Hackathons
            </span>
            <span className="rounded-full border border-white/30 px-4 py-2 uppercase tracking-[0.35em] text-xs text-foreground">
              Studio Pods
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] text-base shadow-[var(--glow-strong)]"
            >
              <Link href="/join">
                Join the club
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-full border border-white/30 bg-white/10 text-base text-foreground hover:border-white/50"
            >
              <Link href="/contact">Pitch a partnership</Link>
            </Button>
          </div>
        </div>
      </PageSection>
    </div>
  )
}
