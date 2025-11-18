'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { ShaderAnimation } from '@/components/ui/shader-lines'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '80+', label: 'Active members' },
  { value: '50+', label: 'Projects shipped' },
  { value: '10', label: 'Partner schools' },
]

export const HeroFuturistic = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[3.5rem] bg-[#05020a] text-white">
      <div className="absolute inset-0 opacity-70">
        <ShaderAnimation />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05020a]/90 via-[#16072b]/85 to-[#080312]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-28 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/80">
            <Sparkles className="h-3 w-3" />
            Teen-Led
          </span>
          <div className="space-y-6">
            <h1 className="font-display text-4xl leading-tight md:text-6xl">
              Lucknow&apos;s boldest builders club for ambitious teens
            </h1>
            <p className="text-lg text-white/70 md:text-xl">
              We host premium hackathons, design/dev squads, and real-world launches—run entirely by students who want to
              ship things that matter.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] text-base font-semibold shadow-[var(--glow-strong)]"
            >
              <Link href="/join">
                Join the crew
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/10 text-base text-white hover:bg-white/20"
            >
              <Link href="/impact">See what we&apos;ve built</Link>
            </Button>
          </div>

          <div className="grid gap-6 rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-3xl sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[var(--glow-soft)] backdrop-blur-2xl">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
              alt="Teens building together"
              width={900}
              height={1000}
              className="h-[420px] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm backdrop-blur-lg">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/70">Next up</p>
                <p className="font-semibold">Club Studio Sprint · December 2025</p>
              </div>
              <span className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                Hybrid
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroFuturistic
