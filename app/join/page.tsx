"use client"

import { useState, FormEvent } from "react"
import { CheckCircle2, Info, Loader2 } from "lucide-react"

import { PageSection } from "@/components/page-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const INTERESTS = ["Web Development", "Mobile Apps", "AI/ML", "Game Dev", "Design"]

const fieldClass =
  "w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-base text-foreground shadow-inner shadow-black/5 transition focus:border-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/30 dark:bg-white/5 dark:text-white"

export default function Join() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    experience: "beginner",
    interests: [] as string[],
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to submit join request.")
      }

      setStatus({
        type: "success",
        message: "Application sent! We’ll reach out with next steps.",
      })
      setFormData({
        name: "",
        email: "",
        school: "",
        experience: "beginner",
        interests: [],
        message: "",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Could not submit your application. Please try again or email hello@lucknow.codes.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-transparent">
      <PageSection
        align="center"
        eyebrow="Apply"
        title="Join the crew"
        description="Tell us how you want to build with the Bits&Bytes community. We’ll connect you with squads, mentors, and live projects."
      >
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {status && (
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm",
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100",
              )}
            >
              {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-panel space-y-8 p-8 sm:p-12">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  className={fieldClass}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  className={fieldClass}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@lucknow.codes"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">School</label>
              <input
                className={fieldClass}
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Your school name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Experience Level</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className={fieldClass}>
                <option value="beginner">Beginner — just starting</option>
                <option value="intermediate">Intermediate — have shipped things</option>
                <option value="advanced">Advanced — lead projects</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">What interests you?</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const active = formData.interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleCheckbox(interest)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition",
                        active
                          ? "bg-[var(--brand-pink)]/90 text-white shadow-[var(--glow-soft)]"
                          : "border border-white/40 bg-white/40 text-foreground hover:border-white/70 dark:bg-white/5 dark:text-white",
                      )}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tell us about yourself</label>
              <textarea
                className={cn(fieldClass, "min-h-[120px] resize-none")}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="What do you want to build? What do you want to learn?"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] py-6 text-base font-semibold text-white shadow-[var(--glow-strong)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending…
                </>
              ) : (
                "Join our community"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              We review applications weekly. You can also email{" "}
              <a href="mailto:hello@lucknow.codes" className="text-[var(--brand-pink)] underline-offset-2 hover:underline">
                hello@lucknow.codes
              </a>
              .
            </p>
          </form>
        </div>
      </PageSection>
    </main>
  )
}
