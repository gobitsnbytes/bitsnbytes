"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

import ThemeToggle from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    const handler = () => setIsScrolled(window.scrollY > 8)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center px-4 pt-4">
      <div
        className={cn(
          "w-full max-w-6xl rounded-3xl border border-white/10 bg-card/70 px-4 py-2 shadow-[var(--shadow-card)] transition-all duration-300 backdrop-blur-xl dark:border-white/5",
          isScrolled && "bg-card/85 shadow-[var(--glow-soft)]",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-pink)]/90 to-[var(--brand-purple)]/90 text-white shadow-[var(--glow-soft)] transition-transform group-hover:scale-105">
              <span className="font-mono text-lg font-bold">&lt;/&gt;</span>
              <div className="absolute inset-0 rounded-2xl border border-white/20" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-foreground">Bits&Bytes</span>
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Lucknow</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/20 px-2 py-1 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md dark:bg-white/5 md:flex">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 transition-colors",
                    isActive
                      ? "bg-white text-primary shadow-sm dark:bg-white/90"
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
                "hidden items-center gap-1 rounded-full bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] text-white shadow-[var(--glow-strong)] hover:shadow-[var(--glow-strong)] md:inline-flex",
              )}
            >
              Join Now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-secondary text-foreground transition hover:border-white/30 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-background/95 p-4 shadow-[var(--shadow-card)] md:hidden">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-base transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )
            })}
            <Button
              asChild
              className="w-full rounded-2xl bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-purple)] text-white"
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
