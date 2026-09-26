import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WIDE } from "@/components/chrome/wordmark";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "404 - Page Not Found | bits&bytes™",
  description: "The requested page could not be found. Navigate back to India's boldest youth builder network.",
  robots: {
    index: false,
    follow: true,
  },
};

const quickLinks = [
  { title: "Home", href: "/", desc: "Return to homepage" },
  { title: "Events & Hackathons", href: "/events", desc: "Upcoming student hackathons" },
  { title: "About Us", href: "/about", desc: "Meet the student team" },
  { title: "SparkCloud", href: "/cloud", desc: "Free student compute" },
  { title: "Fork Network", href: "/fork", desc: "Local builder chapters" },
  { title: "Frequently Asked Questions", href: "/faq", desc: "Get quick answers" },
];

// buttermax-style poster: full-bleed orange campaign surface, giant wide 404, hairline destination list.
export default function NotFound() {
  return (
    <section
      data-surface="orange"
      className="tone-orange relative overflow-x-clip px-4 pb-20 pt-24 md:px-8 md:pt-28"
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">[HTTP_STATUS: 404_NOT_FOUND]</p>

      <p aria-hidden className={cn(WIDE, "-ml-[0.04em] select-none text-[clamp(140px,38vw,620px)] leading-[0.8]")}>
        404
      </p>

      <div className="mt-8 grid gap-10 border-t-3 border-ink pt-6 lg:grid-cols-2">
        <div>
          <h1 className={cn(WIDE, "text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] [font-stretch:112%]")}>
            Page Not Found
          </h1>
          <p className="mt-5 max-w-[46ch] font-serif text-lg leading-relaxed">
            The page you are looking for has been moved, renamed, or does not exist in our build repository.
          </p>
          <Button asChild variant="burgundy" className="mt-8">
            <Link href="/">
              <span aria-hidden>←</span> Back to Home
            </Link>
          </Button>
        </div>

        <nav aria-labelledby="not-found-destinations">
          <h2
            id="not-found-destinations"
            className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em]"
          >
            Suggested Destinations
          </h2>
          <ul className="border-t-2 border-ink">
            {quickLinks.map((link, i) => (
              <li key={link.href} className="border-b-2 border-ink">
                <Link
                  href={link.href}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 px-1 py-3 transition-colors duration-200 hover:bg-ink hover:text-orange"
                >
                  <span className="font-mono text-[11px] font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-[family-name:var(--font-archivo)] text-lg font-black uppercase leading-tight">
                      {link.title}
                    </span>
                    <span className="block font-serif text-sm">{link.desc}</span>
                  </span>
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
