"use client"

import Navigation from "@/components/navigation"
import { Mail, MapPin, Clock } from "lucide-react"

export default function Contact() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-in-up">
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[#3e1e68] mb-4">Get In Touch</h1>
            <p className="text-xl text-[#656565] max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out anytime!
            </p>
          </div>

          {/* Contact Form */}
          <div
            className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#e0e0e0] p-8 sm:p-12 mb-16 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="font-display font-bold text-3xl text-[#3e1e68] mb-8">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
              />
              <textarea
                rows={6}
                placeholder="Your message"
                className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#e45a92] text-white font-display font-bold rounded-xl hover:bg-[#d1437a] transition-all hover:shadow-lg hover:shadow-[#e45a92]/30"
              >
                Send Message
              </button>
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
              <p className="text-white/80">hello@bitsbytes.dev</p>
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
              <p className="text-[#3e1e68]/80">Tech Hub, Innovation District</p>
            </div>

            {/* Hours */}
            <div
              className="bg-[#e45a92] rounded-2xl p-8 text-white text-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Hours</h3>
              <p className="text-white/80">Mon - Fri, 4:00 PM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
