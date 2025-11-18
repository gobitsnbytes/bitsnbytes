"use client"

import { Mail, MapPin, Clock, Loader2 } from "lucide-react"
import { InteractiveRobotSection } from "@/components/ui/interactive-3d-robot"
import { useState, FormEvent } from "react"

import { PageSection } from "@/components/page-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-base text-foreground shadow-inner shadow-black/5 transition focus:border-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/30 dark:bg-white/5 dark:text-white"

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
      {/* Hero section with interactive 3D robot */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <InteractiveRobotSection />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Have questions? We'd love to hear from you. Reach out anytime!
            </p>
          </div>
        </div>
      </section>

      <main className="bg-transparent">
        <PageSection
          align="center"
          eyebrow="Contact"
          title="Reach the team"
          description="We love partnering with schools, sponsors, mentors, and students. Drop a note and we’ll get back within a couple days."
        >
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            <form onSubmit={handleSubmit} className="glass-panel space-y-6 p-8 sm:p-12">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Name</label>
                  <input name="name" placeholder="Your name" className={fieldClass} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input type="email" name="email" placeholder="you@email.com" className={fieldClass} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <input name="subject" placeholder="Reason for reaching out" className={fieldClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're thinking…"
                  className={cn(fieldClass, "min-h-[140px] resize-none")}
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
            </form>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-card/60 p-6 shadow-[var(--shadow-card)] backdrop-blur-3xl dark:bg-white/5 md:grid-cols-3">
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
                  copy: "2025 — teen-led",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/70 p-5 text-center dark:bg-white/5">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-white/60 dark:bg-white/10">
                    <item.icon className="h-5 w-5 text-[var(--brand-purple)] dark:text-white" />
                  </div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </PageSection>
      </main>
    </>
  )
}
