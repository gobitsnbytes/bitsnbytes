'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { WebGLShader } from '@/components/ui/web-gl-shader'
import { Button } from '@/components/ui/button'
import { LiquidGlassBackdrop } from '@/components/ui/liquid-glass-effect'

const stats = [
  { value: '80+', label: 'Active members' },
  { value: '50+', label: 'Projects shipped' },
  { value: '10', label: 'Partner schools' },
]

export const HeroFuturistic = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[3.5rem] text-white">
      <WebGLShader />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-28 sm:px-6 lg:flex-row lg:items-stretch lg:gap-16">
        <div className="flex-1">
          <div className="relative isolate flex h-full flex-col gap-8 rounded-[32px] border border-white/30 bg-white/70 p-8 text-foreground shadow-xl dark:border-white/10 dark:bg-white/10 dark:text-white">
            <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
            <span className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-foreground/70 dark:text-white/80">
              <Sparkles className="h-3 w-3" />
              TEEN-LED
            </span>
            <div className="relative z-10 space-y-6">
              <h1 className="font-display text-4xl leading-tight text-foreground dark:text-white md:text-6xl">
                Lucknow&apos;s boldest builders club for ambitious teens
              </h1>
              <p className="text-lg text-foreground/80 dark:text-white/70 md:text-xl">
                We host premium hackathons, design/dev squads, and real-world launches—run entirely by students who want to
                ship things that matter.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-[var(--brand-pink)] text-base font-semibold text-white shadow-[var(--glow-strong)]"
              >
                <Link href="/join">
                  Join the crew
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/40 bg-white/10 text-base text-foreground hover:bg-white/20 dark:text-white"
              >
                <Link href="/impact">See what we&apos;ve built</Link>
              </Button>
            </div>

            <div className="relative z-10 grid gap-6 rounded-3xl border border-white/30 bg-white/30 p-6 text-foreground shadow-lg backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:text-white sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-semibold text-foreground dark:text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-foreground/60 dark:text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative isolate overflow-hidden rounded-[32px] border border-white/30 shadow-xl backdrop-blur-2xl dark:border-white/20">
            <Image
              src="/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg"
              alt="Scrapyard Lucknow teens building together"
              width={900}
              height={1000}
              className="h-[420px] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[var(--brand-purple)]/30" />
            <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/40 bg-white/80 px-5 py-4 shadow-2xl backdrop-blur-2xl dark:border-white/30 dark:bg-white/20">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--brand-purple)] dark:text-white">Archive highlight</p>
                <p className="font-display text-base font-bold text-foreground dark:text-white">Scrapyard Lucknow · 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroFuturistic
