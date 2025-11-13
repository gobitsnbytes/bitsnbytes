"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-up">
            <div className="inline-block px-4 py-2 bg-[#ffacac]/20 rounded-full mb-6">
              <span className="text-sm font-medium text-[#e45a92]">Welcome to Bits&Bytes</span>
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
              <span className="text-[#3e1e68]">Innovate.</span>
              <br />
              <span className="text-[#e45a92]">Collaborate.</span>
              <br />
              <span className="text-[#5d2f77]">Hack.</span>
            </h1>
            <p className="text-lg text-[#656565] mb-8 max-w-lg leading-relaxed">
              Join a vibrant community of teen developers building the future. Learn, create, and transform ideas into
              reality through code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/join"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#e45a92] text-white rounded-full font-medium hover:bg-[#d1437a] transition-all hover:shadow-lg hover:shadow-[#e45a92]/30 group"
              >
                Join Us Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#3e1e68] text-[#3e1e68] rounded-full font-medium hover:bg-[#3e1e68]/5 transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-[#656565]">Follow us:</span>
              <a href="#" className="p-2 hover:bg-[#e45a92]/10 rounded-full transition-colors group">
                <Github size={20} className="text-[#3e1e68] group-hover:text-[#e45a92]" />
              </a>
              <a href="#" className="p-2 hover:bg-[#e45a92]/10 rounded-full transition-colors group">
                <Linkedin size={20} className="text-[#3e1e68] group-hover:text-[#e45a92]" />
              </a>
              <a href="#" className="p-2 hover:bg-[#e45a92]/10 rounded-full transition-colors group">
                <Twitter size={20} className="text-[#3e1e68] group-hover:text-[#e45a92]" />
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-full min-h-[500px] animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3e1e68]/20 via-[#e45a92]/10 to-[#ffacac]/20 rounded-3xl blur-3xl"></div>

            {/* Floating shapes */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-[#e45a92] rounded-3xl rotate-45 animate-float opacity-80"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#5d2f77] rounded-full opacity-20 animate-rotate-slow"></div>
            <div
              className="absolute top-40 left-20 w-16 h-16 bg-[#ffacac] rounded-lg animate-float"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Circuit board SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.3"
            >
              <line x1="50" y1="50" x2="350" y2="50" stroke="#e45a92" strokeWidth="2" />
              <line x1="50" y1="200" x2="350" y2="200" stroke="#3e1e68" strokeWidth="2" />
              <line x1="50" y1="350" x2="350" y2="350" stroke="#ffacac" strokeWidth="2" />
              <line x1="50" y1="50" x2="50" y2="350" stroke="#3e1e68" strokeWidth="2" />
              <line x1="200" y1="50" x2="200" y2="350" stroke="#e45a92" strokeWidth="2" />
              <line x1="350" y1="50" x2="350" y2="350" stroke="#5d2f77" strokeWidth="2" />
              <circle cx="50" cy="50" r="6" fill="#e45a92" />
              <circle cx="200" cy="200" r="6" fill="#3e1e68" />
              <circle cx="350" cy="350" r="6" fill="#ffacac" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
