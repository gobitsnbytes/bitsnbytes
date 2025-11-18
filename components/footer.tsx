import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react"

const socialLinks = [
  { href: "https://www.linkedin.com/company/gobitsbytes", label: "LinkedIn", icon: Linkedin },
  { href: "https://github.com/bitsnbytes", label: "GitHub", icon: Github },
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
    <footer className="mt-16 border-t border-white/10 bg-card/80 text-sm text-muted-foreground backdrop-blur-2xl">
      <div className="section-shell grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 text-foreground">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-pink)]/80 to-[var(--brand-purple)]/80 text-white shadow-[var(--glow-soft)]">
              <span className="font-mono text-lg font-bold">&lt;/&gt;</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Bits&Bytes</p>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Teen-led</p>
            </div>
          </div>
          <p>
            Building Lucknow&apos;s coolest hackathons & creative code movements. Teen-led, community-backed, future ready.
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
            <a className="flex items-center gap-2 transition-colors hover:text-foreground" href="mailto:hello@lucknow.codes">
              <Mail className="h-4 w-4" />
              hello@lucknow.codes
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
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition-colors hover:border-white/30 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4">
        © {new Date().getFullYear()} Bits&Bytes. Built with community love.
      </div>
    </footer>
  )
}

export default Footer

