"use client"

import { Mail, MapPin, Clock, Loader2 } from "lucide-react"
import { InteractiveRobotSection } from "@/components/ui/interactive-3d-robot"
import { useState, FormEvent } from "react"

import { PageSection } from "@/components/page-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LiquidGlassBackdrop } from "@/components/ui/liquid-glass-effect"

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
      <section className="relative overflow-hidden rounded-b-[3rem]">
        <InteractiveRobotSection className="h-[70vh] min-h-[560px]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Contact</p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">Let’s co-create the next big sprint</h1>
            <p className="text-white/75">
              Partner with us on hackathons, workshops, or custom experiences for schools across Lucknow.
            </p>
          </div>
        </InteractiveRobotSection>
      </section>

      <main className="bg-transparent">
        <PageSection
          align="center"
          eyebrow="Contact"
          title="Reach the team"
          description="We love partnering with schools, sponsors, mentors, and students. Drop a note and we’ll get back within a couple days."
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <form
              onSubmit={handleSubmit}
              className="relative isolate rounded-[32px] border border-white/30 bg-white/75 p-8 text-foreground shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/10 dark:text-white sm:p-12"
            >
              <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
              <div className="relative z-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-foreground dark:text-white">Your Name</label>
                    <input name="name" placeholder="Your name" className={fieldClass} required />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-foreground dark:text-white">Email</label>
                    <input type="email" name="email" placeholder="you@email.com" className={fieldClass} required />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-foreground dark:text-white">Subject</label>
                  <input name="subject" placeholder="Reason for reaching out" className={fieldClass} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-foreground dark:text-white">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us what you're thinking…"
                    className={cn(fieldClass, "min-h-[160px] resize-none")}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] py-6 text-base font-semibold text-white shadow-[var(--glow-strong)] disabled:opacity-60"
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
                      "text-sm",
                      status.type === "success" ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300",
                    )}
                  >
                    {status.message}
                  </p>
                )}
              </div>
            </form>

            <div className="relative isolate rounded-[32px] border border-white/30 bg-white/60 p-6 text-foreground shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:text-white md:grid-cols-3 md:p-10">
              <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
              <div className="relative z-10 grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    copy: "hello@lucknow.codes",
                  },
                  {
                    icon: MapPin,
                    title: "Based in",
                    copy: "Lucknow, India",
                  },
                  {
                    icon: Clock,
                    title: "From",
                    copy: "Teen-led since 2025",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="relative isolate rounded-2xl border border-white/40 bg-white/30 p-5 text-center shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
                    <div className="relative z-10">
                      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-white/60 text-[var(--brand-purple)] dark:bg-white/10 dark:text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-foreground dark:text-white">{item.title}</p>
                      <p className="text-sm text-muted-foreground dark:text-white/70">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  )
}
