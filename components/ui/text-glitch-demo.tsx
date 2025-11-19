import { TextGlitch } from "@/components/ui/text-glitch-effect"

export default function TextGlitchDemo() {
  return (
    <main className="min-h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-20">
        <div className="space-y-16">
          {/* Example 1: Basic Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              Basic Text Effect
            </h2>
            <TextGlitch text="BITS&BYTES" delay={0} />
          </div>

          {/* Example 2: With Hover Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              Hover to Reveal Text
            </h2>
            <TextGlitch text="HOVER ME" hoverText="INNOVATE" delay={0.2} />
          </div>

          {/* Example 3: With Link */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              Interactive Link
            </h2>
            <TextGlitch 
              text="VISIT US" 
              hoverText="LUCKNOW.CODES" 
              href="https://www.lucknow.codes/" 
              delay={0.4} 
            />
          </div>

          {/* Example 4: Custom Styled */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              Custom Brand Colors
            </h2>
            <TextGlitch 
              text="COLLABORATE" 
              hoverText="BUILD TOGETHER" 
              className="!bg-[var(--brand-purple)] !border-b-[#ffacac]/50"
              delay={0.6} 
            />
          </div>
        </div>
      </div>
    </main>
  )
}

