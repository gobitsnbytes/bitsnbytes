"use client"

import Link from "next/link"
import { ArrowRight, Code2, Users, Rocket, Lightbulb, Trophy, Sparkles } from "lucide-react"

import { HeroFuturistic } from "@/components/ui/hero-futuristic"
import { PageSection } from "@/components/page-section"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import GlassIcons from "@/components/GlassIcons"

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
    title: "Community Lead",
  },
  {
    quote:
      "We pair first-time coders with experienced mentors, so everyone ships something real. The confidence boost is unreal.",
    name: "Yash",
    title: "Co-founder & Lead Dev",
  },
  {
    quote:
      "Bits&Bytes gave me my first stage to teach design systems. Now I help younger designers craft bold visuals for events.",
    name: "Saksham",
    title: "Design Lead",
  },
]

const focusAreas = [
  { icon: <Trophy className="w-full h-full" />, color: "purple", label: "Hackathons" },
  { icon: <Lightbulb className="w-full h-full" />, color: "orange", label: "Workshops" },
  { icon: <Code2 className="w-full h-full" />, color: "blue", label: "Projects" },
  { icon: <Users className="w-full h-full" />, color: "green", label: "Community" },
  { icon: <Rocket className="w-full h-full" />, color: "red", label: "Innovation" },
  { icon: <Sparkles className="w-full h-full" />, color: "indigo", label: "Mentorship" },
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
              className="glass-card relative isolate overflow-hidden p-6 text-foreground shadow-xl hover:shadow-[var(--glow-strong)] dark:text-white"
            >
              <CardContent className="relative z-10 p-0">
                <p className="text-4xl font-bold text-[var(--brand-pink)]">{stat.value}</p>
                <CardTitle className="mt-2 text-lg text-foreground dark:text-white">{stat.label}</CardTitle>
                <CardDescription className="text-base text-foreground/70 dark:text-white/70">{stat.detail}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="What We Do"
        title="Our Focus Areas"
        description="Explore the different ways we help teens build, learn, and grow in tech"
        align="center"
      >
        <div className="relative mx-auto" style={{ height: '500px' }}>
          <GlassIcons items={focusAreas} className="max-w-4xl" />
        </div>
      </PageSection>

      <PageSection eyebrow="Stories" title="Voices from the crew" align="center">
        <InfiniteMovingCards
          items={stories}
          direction="right"
          speed="slow"
        />
      </PageSection>
    </div>
  )
}
