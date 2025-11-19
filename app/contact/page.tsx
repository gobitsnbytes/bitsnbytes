"use client"

import { Mail, MapPin, Clock, Loader2, Github, Linkedin, Instagram } from "lucide-react"
import { useState, FormEvent } from "react"
import Link from "next/link"

import { PageSection } from "@/components/page-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactCard } from "@/components/ui/contact-card"
import { cn } from "@/lib/utils"
import { LiquidGlassBackdrop } from "@/components/ui/liquid-glass-effect"
import { WebGLShader } from "@/components/ui/web-gl-shader"

const fieldClass =
  "w-full rounded-2xl border border-white/20 bg-card/90 px-4 py-3 text-base text-foreground shadow-inner shadow-black/5 transition focus:border-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/30 dark:border-white/15 dark:bg-white/5 dark:text-white"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get("name") as string) || ""
    const email = (formData.get("email") as string) || ""
    const subject = (formData.get("subject") as string) || ""
    const message = (formData.get("message") as string) || ""

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send message.")
      }

      setStatus({ type: "success", message: "Message sent successfully. We’ll get back to you soon." })
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus({
        type: "error",
        message: "Something went wrong while sending your message. Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-24">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-[40px] p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-[36px] py-12 px-6 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-4 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Contact</p>
                <h1 className="font-display text-4xl md:text-5xl leading-tight font-extrabold text-white">
                  Let's co-create the next big sprint
                </h1>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Partner with us on hackathons, workshops, or custom experiences for schools across Lucknow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="Contact"
          title="Reach the team"
          description="We love partnering with schools, sponsors, mentors, and students. Drop a note and we'll get back within a couple days."
        >
          <div className="mx-auto w-full max-w-6xl">
            <ContactCard
              title="Get in Touch"
              description="Have questions about our hackathons, workshops, or programs? We'd love to hear from you! Fill out the form and we'll respond within 1-2 business days."
              contactInfo={[
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'hello@gobitsnbytes.org',
                },
                {
                  icon: MapPin,
                  label: 'Location',
                  value: 'Lucknow, India',
                },
                {
                  icon: Clock,
                  label: 'Established',
                  value: 'Teen-led since 2025',
                  className: 'col-span-2',
                }
              ]}
              className="rounded-[40px] border-white/30 bg-white/50 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-foreground dark:text-white">Name</Label>
                  <Input 
                    id="name"
                    name="name" 
                    type="text" 
                    placeholder="Your name"
                    className={fieldClass}
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-foreground dark:text-white">Email</Label>
                  <Input 
                    id="email"
                    name="email" 
                    type="email" 
                    placeholder="you@email.com"
                    className={fieldClass}
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject" className="text-foreground dark:text-white">Subject</Label>
                  <Input 
                    id="subject"
                    name="subject" 
                    type="text" 
                    placeholder="Reason for reaching out"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message" className="text-foreground dark:text-white">Message</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what you're thinking…"
                    className={cn(fieldClass, "min-h-[120px] resize-none")}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[var(--brand-pink)] py-6 text-base font-semibold text-white shadow-[var(--glow-strong)] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
                {status && (
                  <p
                    className={cn(
                      "text-sm text-center",
                      status.type === "success" ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300",
                    )}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </ContactCard>

            {/* Social Links Section */}
            <div className="mt-12 text-center">
              <p className="mb-6 text-lg font-semibold text-foreground dark:text-white">
                Connect with us on social media
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="https://github.com/gobitsnbytes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card inline-flex items-center gap-3 px-6 py-3 shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(228,90,146,0.3)]"
                >
                  <Github className="h-5 w-5 text-[var(--brand-pink)]" />
                  <span className="font-medium text-foreground dark:text-white">GitHub</span>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/gobitsbytes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card inline-flex items-center gap-3 px-6 py-3 shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(228,90,146,0.3)]"
                >
                  <Linkedin className="h-5 w-5 text-[var(--brand-pink)]" />
                  <span className="font-medium text-foreground dark:text-white">LinkedIn</span>
                </Link>
                <Link
                  href="https://www.instagram.com/bitsnbytes.lko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card inline-flex items-center gap-3 px-6 py-3 shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(228,90,146,0.3)]"
                >
                  <Instagram className="h-5 w-5 text-[var(--brand-pink)]" />
                  <span className="font-medium text-foreground dark:text-white">Instagram</span>
                </Link>
              </div>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  )
}
