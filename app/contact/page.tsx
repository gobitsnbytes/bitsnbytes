"use client"

import Navigation from "@/components/navigation"
import { Mail, MapPin, Clock } from "lucide-react"
import { InteractiveRobotSection } from "@/components/ui/interactive-3d-robot"
import { useState, FormEvent } from "react"

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
      <Navigation />
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

      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Contact Form */}
          <div
            className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#e0e0e0] p-8 sm:p-12 mb-16 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="font-display font-bold text-3xl text-[#3e1e68] mb-8">Send us a message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
              />
              <textarea
                rows={6}
                name="message"
                placeholder="Your message"
                className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors resize-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#e45a92] text-white font-display font-bold rounded-xl hover:bg-[#d1437a] transition-all hover:shadow-lg hover:shadow-[#e45a92]/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  className={`mt-2 text-sm ${
                    status.type === "success" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email */}
            <div
              className="bg-[#5d2f77] rounded-2xl p-8 text-white text-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex justify-center mb-4">
                <Mail size={32} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Email</h3>
              <p className="text-white/80">hello@lucknow.codes</p>
            </div>

            {/* Location */}
            <div
              className="bg-[#ffacac] rounded-2xl p-8 text-[#3e1e68] text-center animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex justify-center mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Location</h3>
              <p className="text-[#3e1e68]/80">Based in Lucknow</p>
            </div>

            {/* Hours */}
            <div
              className="bg-[#e45a92] rounded-2xl p-8 text-white text-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">From</h3>
              <p className="text-white/80">2025</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
