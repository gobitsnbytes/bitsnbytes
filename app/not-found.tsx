import Link from "next/link";
import { ArrowLeft, Home, Compass, Sparkles, Terminal, FileQuestion } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | bits&bytes™",
  description: "The requested page could not be found. Navigate back to India's boldest youth builder network.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    { title: "Home", href: "/", desc: "Return to homepage", icon: Home },
    { title: "Events & Hackathons", href: "/events", desc: "Upcoming student hackathons", icon: Sparkles },
    { title: "About Us", href: "/about", desc: "Meet the student team", icon: Compass },
    { title: "SparkCloud", href: "/cloud", desc: "Free student compute", icon: Terminal },
    { title: "Fork Network", href: "/fork", desc: "Local builder chapters", icon: Compass },
    { title: "Frequently Asked Questions", href: "/faq", desc: "Get quick answers", icon: FileQuestion },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary dark:text-accent shadow-[3px_3px_0px_0px_var(--border)]">
          [HTTP_STATUS: 404_NOT_FOUND]
        </div>

        <div className="space-y-4">
          <h1 className="font-accent-sans text-6xl sm:text-8xl tracking-tight text-foreground uppercase">
            Page Not Found
          </h1>
          <p className="font-serif-brand text-base sm:text-lg text-foreground/80 max-w-lg mx-auto leading-relaxed">
            The page you are looking for has been moved, renamed, or does not exist in our build repository.
          </p>
        </div>

        <div className="border-3 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] text-left">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground/70 mb-4 border-b border-border/20 pb-2">
            Suggested Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-3 p-3 border-2 border-border/40 hover:border-border hover:bg-accent/10 transition-all shadow-[2px_2px_0px_0px_var(--border)] group"
                >
                  <Icon className="h-5 w-5 text-primary dark:text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {link.title}
                    </div>
                    <div className="text-xs text-foreground/60">{link.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border-3 border-border bg-primary text-primary-foreground font-mono text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
