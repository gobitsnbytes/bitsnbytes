"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

import ThemeToggle from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import logo from "@public/logo.svg"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center">
      <div
        className={cn(
          "w-full max-w-full border-b border-white/10 bg-white/90 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-white/5",
          isScrolled && "border-white/20 bg-white shadow-[var(--glow-soft)] dark:bg-white/10",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-black text-white shadow-[0_8px_30px_rgba(228,90,146,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(228,90,146,0.6)]">
              <Image
                src={logo}
                alt="Bits&Bytes logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:rotate-12"
                priority
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-[var(--brand-pink)]" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-foreground">Bits&Bytes</span>
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Lucknow</span>
            </div>
          </Link>

          <nav className="relative hidden items-center gap-1 rounded-full border border-white/30 bg-white/80 px-1 py-1 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-white/10 dark:bg-white/10 md:flex">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 transition-all",
                    isActive
                    ? "rounded-full bg-[var(--brand-pink)] text-white shadow-[var(--glow-soft)]"
                    : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <Link
              href="/join"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden items-center gap-1 rounded-full bg-[var(--brand-pink)] text-white shadow-[var(--glow-strong)] md:inline-flex",
              )}
            >
              Join Now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/70 text-foreground transition hover:border-white/50 dark:bg-white/10 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-[var(--shadow-card)] dark:bg-[var(--background)] md:hidden">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-base transition-all",
                    isActive
                    ? "rounded-2xl bg-[var(--brand-pink)] text-white"
                    : "border border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground",
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )
            })}
            <Button
              asChild
              className="w-full rounded-2xl bg-[var(--brand-pink)] text-white"
            >
              <Link href="/join" className="flex items-center justify-center gap-2">
                Join the Club <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
