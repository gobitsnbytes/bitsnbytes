import Image from "next/image"
import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react"
import logo from "@public/logo.svg"

const socialLinks = [
  { href: "https://www.linkedin.com/company/gobitsbytes", label: "LinkedIn", icon: Linkedin },
  { href: "https://github.com/gobitsnbytes", label: "GitHub", icon: Github },
  { href: "https://www.instagram.com/bitsnbytes.lko", label: "Instagram", icon: Instagram },
]

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/20 bg-white/70 text-sm text-muted-foreground backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="section-shell grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 text-foreground">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-black text-white shadow-[0_8px_30px_rgba(228,90,146,0.4)]">
              <Image
                src={logo}
                alt="Bits&Bytes logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-[var(--brand-pink)]" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Bits&Bytes</p>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Teen-led</p>
            </div>
          </div>
          <p>
            Building Lucknow&apos;s coolest hackathons & creative code movements. Teen-led, club-backed, future ready.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">Explore</p>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">Connect</p>
          <div className="space-y-2">
            <a className="flex items-center gap-2 transition-colors hover:text-foreground" href="mailto:hello@gobitsnbytes.org">
              <Mail className="h-4 w-4" />
              hello@gobitsnbytes.org
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Lucknow, India
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">Social</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/50 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/50 hover:text-foreground dark:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4">
        © {new Date().getFullYear()} Bits&Bytes. Built with club love.
      </div>
    </footer>
  )
}

export default Footer

