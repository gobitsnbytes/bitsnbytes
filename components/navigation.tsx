"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#3e1e68] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold font-display text-lg">&lt;&gt;</span>
            </div>
            <span className="font-display font-bold text-lg text-[#3e1e68] hidden sm:inline">Bits&Bytes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-[#0a0a0a] hover:text-[#e45a92] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-[#0a0a0a] hover:text-[#e45a92] transition-colors">
              About
            </Link>
            <Link href="/impact" className="text-sm font-medium text-[#0a0a0a] hover:text-[#e45a92] transition-colors">
              Impact
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#0a0a0a] hover:text-[#e45a92] transition-colors">
              Contact
            </Link>
            <Link
              href="/join"
              className="px-6 py-2 bg-[#e45a92] text-white rounded-full font-medium hover:bg-[#d1437a] transition-colors"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-in-down">
            <Link href="/" className="block px-4 py-2 text-[#0a0a0a] hover:bg-gray-100 rounded-lg transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-[#0a0a0a] hover:bg-gray-100 rounded-lg transition-colors"
            >
              About
            </Link>
            <Link
              href="/impact"
              className="block px-4 py-2 text-[#0a0a0a] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-[#0a0a0a] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/join"
              className="block w-full text-center px-4 py-2 bg-[#e45a92] text-white rounded-lg transition-colors"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
