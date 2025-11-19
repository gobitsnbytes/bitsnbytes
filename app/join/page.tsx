"use client"

import { useEffect } from "react"
import { PageSection } from "@/components/page-section"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Join() {
  useEffect(() => {
    // Load Tally script for popup
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <WebGLShader />
      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="Apply"
          title="Join the crew"
          description="Tell us how you want to build with the Bits&Bytes club. We'll connect you with squads, mentors, and live projects."
        >
          <div className="mx-auto w-full max-w-3xl space-y-8">
            {/* Main CTA */}
            <div className="flex flex-col items-center gap-6">
              <Button
                data-tally-open="n02RGZ"
                data-tally-layout="modal"
                data-tally-width="700"
                data-tally-align-left="1"
                data-tally-hide-title="1"
                data-tally-overlay="1"
                className="group rounded-full bg-[var(--brand-pink)] px-12 py-7 text-lg font-semibold text-white shadow-[var(--glow-strong)] transition-all hover:scale-105 hover:shadow-[0_20px_80px_rgba(228,90,146,0.5)]"
              >
                Apply to Join
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Takes less than 2 minutes · We review applications weekly
              </p>
            </div>

            {/* Contact */}
            <p className="text-center text-sm text-muted-foreground">
              Questions? Reach us at{" "}
              <a 
                href="mailto:hello@gobitsnbytes.org" 
                className="text-[var(--brand-pink)] font-medium underline-offset-2 hover:underline"
              >
                hello@gobitsnbytes.org
              </a>
            </p>
          </div>
        </PageSection>
      </main>
    </>
  )
}
