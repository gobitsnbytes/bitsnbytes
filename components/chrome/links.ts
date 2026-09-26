// Every link the chrome renders (labels carried over verbatim from the old mini-navbar + flickering-footer).

export type ChromeLink = {
  href: string;
  label: string;
  /** Route handler (redirect / PDF), not an app page: render a plain <a>, never next/link. */
  handler?: boolean;
};

/** Every public route, in menu order. */
export const ROUTES: ChromeLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/impact", label: "Impact" },
  { href: "/join", label: "Join" },
  { href: "/fork", label: "Fork" },
  { href: "/press", label: "Press" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/cloud", label: "Cloud" },
  { href: "/prospectus", label: "Prospectus", handler: true },
  { href: "/qna", label: "QnA" },
  { href: "/minecraft", label: "Minecraft" },
  { href: "/coc", label: "Code of Conduct" },
];

/** Nav right zone (desktop), each with its single-key shortcut (stripe.dev [K] chip). */
export const PRIMARY: (ChromeLink & { key: string })[] = [
  { href: "/events", label: "Events", key: "E" },
  { href: "/about", label: "About", key: "A" },
  { href: "/join", label: "Join", key: "J" },
];

export const SOCIALS: ChromeLink[] = [
  { href: "https://www.linkedin.com/company/gobitsbytes", label: "LinkedIn" },
  { href: "https://discord.gg/rjqPfwKKTE", label: "Discord" },
  { href: "https://github.com/gobitsnbytes", label: "GitHub" },
  { href: "https://www.instagram.com/gobitsnbytes", label: "Instagram" },
  { href: "https://x.com/gobitsnbytes", label: "Twitter / X" },
];

export const FOOTER_COLUMNS: { title: string; links: ChromeLink[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/impact", label: "Impact & research" },
      { href: "/events", label: "Events & hackathons" },
      { href: "/fork", label: "Local hubs (forks)" },
      { href: "/join", label: "Join the network" },
      { href: "/press", label: "Press kit & media" },
    ],
  },
  {
    title: "Legal & Safety",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/qna", label: "AI Assistant" },
      { href: "/coc", label: "Code of Conduct" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/refund", label: "Refund Policy" },
      { href: "/ip", label: "IP Policy" },
    ],
  },
];

/** Trust Center (footer). */
export const TRUST_LINKS: (ChromeLink & { note: string })[] = [
  { href: "/terms", label: "Terms", note: "Taking part, forks, money, and who can sign" },
  { href: "/privacy", label: "Privacy", note: "Data handling, minors, and guardian requests" },
  { href: "/cookies", label: "Cookies", note: "Essential storage, analytics, and telemetry" },
  { href: "/refund", label: "Refunds", note: "Free events, donations, and billing rules" },
  { href: "/coc", label: "Code of Conduct", note: "Safety, reporting, enforcement, and standards" },
  { href: "/ip", label: "IP Policy", note: "Brand use, logos, open-source, and claims" },
  { href: "/press", label: "Press Kit", note: "Logos, facts, colours, and who to email" },
];

export const isActive = (pathname: string | null, href: string) =>
  pathname === href || (href !== "/" && Boolean(pathname?.startsWith(`${href}/`)));

export const pad = (n: number) => String(n).padStart(2, "0");
