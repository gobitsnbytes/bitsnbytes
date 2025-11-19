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
    title: "Co-Founder & Chief Creative Strategist",
  },
  {
    quote:
      "We pair first-time coders with experienced mentors, so everyone ships something real. The confidence boost is unreal.",
    name: "Yash",
    title: "Co-Founder & Lead Developer",
  },
  {
    quote:
      "Building this platform has been incredible. We're not just coding—we're creating opportunities for the next generation of Lucknow's tech talent.",
    name: "Akshat",
    title: "Co-Founder & Technical Lead",
  },
  {
    quote:
      "The backend work we do here isn't just about databases and APIs—it's about creating a stable foundation that allows every member to build boldly.",
    name: "Devansh",
    title: "Founding Member & Backend Lead",
  },
  {
    quote:
      "From brainstorming wild ideas to seeing them come alive at events, every moment here pushes us to think bigger and execute faster.",
    name: "Oviyaa",
    title: "Social Media & Promotions Head",
  },
]

const focusAreas = [
  { 
    icon: <Trophy className="w-full h-full" />, 
    color: "deep-purple", 
    label: "Hackathons",
    description: "Competitive coding events where creativity meets execution",
    content: [
      "40+ teens building together at Scrapyard Lucknow, our flagship hackathon",
      "24-hour sprints turning ideas into working prototypes",
      "Judging panels with industry mentors and startup founders",
      "Prizes, networking, and real opportunities for standout projects"
    ]
  },
  { 
    icon: <Lightbulb className="w-full h-full" />, 
    color: "vibrant-pink", 
    label: "Workshops",
    description: "Hands-on learning sessions covering modern tech stacks",
    content: [
      "Weekly workshops on web dev, AI/ML, mobile apps, and design systems",
      "Beginner-friendly sessions paired with advanced deep-dives",
      "Live coding, Q&A, and take-home projects",
      "Led by experienced teen developers and guest industry speakers"
    ]
  },
  { 
    icon: <Code2 className="w-full h-full" />, 
    color: "purple-pink", 
    label: "Projects",
    description: "Real-world builds that ship to production",
    content: [
      "50+ projects launched—from apps to AI tools",
      "Collaborate with design, dev, and club teams",
      "Portfolio-ready work with mentorship at every stage",
      "Open-source contributions and team project squads"
    ]
  },
  { 
    icon: <Users className="w-full h-full" />, 
    color: "rich-plum", 
    label: "Club",
    description: "A tight-knit crew of ambitious teen builders",
    content: [
      "80+ active members across Lucknow schools",
      "Discord workspace for daily code help and project collabs",
      "Study groups, pair programming sessions, and code reviews",
      "Safe, inclusive environment where everyone ships something real"
    ]
  },
  { 
    icon: <Rocket className="w-full h-full" />, 
    color: "plum-coral", 
    label: "Innovation",
    description: "Experimenting with cutting-edge tech and bold ideas",
    content: [
      "AI/ML experiments, blockchain prototypes, and creative tech art",
      "Pitch nights where anyone can propose their wildest ideas",
      "Access to beta tools, APIs, and sponsor resources",
      "Encouragement to fail fast, learn faster, and iterate boldly"
    ]
  },
  { 
    icon: <Sparkles className="w-full h-full" />, 
    color: "soft-coral", 
    label: "Mentorship",
    description: "Experienced teens guiding first-time builders",
    content: [
      "One-on-one pairing with mentors who've shipped projects",
      "Office hours for technical questions and career guidance",
      "Portfolio reviews, resume tips, and interview prep",
      "Alumni network connecting you to internships and opportunities"
    ]
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroFuturistic />

      <PageSection
        eyebrow="Impact"
        title="Club-powered learning with real outcomes"
        description="We're a teen-led code club where workshops, hackathons, and build nights lead directly to shipped projects and new opportunities."
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
