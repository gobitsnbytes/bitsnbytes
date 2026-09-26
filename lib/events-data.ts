export type HeroEventStatus = "upcoming" | "archived" | "closed";

export type HeroEventSlide = {
  image: string;
  imageMobile?: string;
  alt: string;
  badge: string;
  status: HeroEventStatus;
  title: string;
  subtitle: string;
  href: string;
};

// Copy is verbatim from the trailer's captions; nothing beyond it is announced yet.
export const regionalSeriesEvent = {
  id: "regional-series",
  title: "Regional Hackathon Series",
  statusLabel: "Upcoming",
  finaleVenueLabel: "IIT Bombay",
  finaleDateLabel: "Dec 17–18",
  trailerSrc: "/movie/regional-series-trailer.mp4",
  posterSrc: "/movie/regional-series-trailer-poster.jpg",
  href: "/events#regional-series",
  trailerLines: [
    "High schoolers, your city's got competition.",
    "bits&bytes™ is launching a regional hackathon series across India.",
    "Win your qualifier — here's where you're headed: IIT Bombay.",
    "December 17th and 18th, qualifier winners compete here for the title.",
    "So who's carrying your city?",
  ],
} as const;

export const githubDevDayEvent = {
  title: "GitHub Copilot Dev Days",
  city: "Lucknow",
  dateLabel: "Apr 19, 2026",
  venueLabel: "Cubispace, Lucknow",
  formatLabel: "In-Person Workshop",
  statusLabel: "Registrations Closed",
  archiveLink: "https://luma.com/xtxua1jl",
  lumaCheckoutUrl: "https://luma.com/event/evt-utBD3JUI1ENZoyn",
  lumaEventId: "evt-utBD3JUI1ENZoyn",
} as const;

export const lucknowBuildGuildEvent = {
  title: "Lucknow Build Guild",
  dateLabel: "Apr 19, 2026",
  venueLabel: "SureStay by Best Western, Lucknow",
  formatLabel: "Free Hardware Workshop & Meetup",
  statusLabel: "Archived",
  hostName: "Shaurya",
  eventSite: "https://www.lucknow-build-guild.xyz/",
  hostLinktree: "https://linktr.ee/shauryaashu",
  hostGithub: "https://github.com/Shaurya-Ashu",
} as const;

export const hack4goodEvent = {
  title: "Hack4Good",
  subtitle: "Architect Your Autonomy",
  dateLabel: "Apr 2, 2026 – May 3, 2026",
  venueLabel: "Cubispace, Lucknow",
  formatLabel: "Agentic AI Hackathon (24 Hours)",
  statusLabel: "Archived",
  teamSizeLabel: "1–4 members",
  prizePoolLabel: "₹35,000",
  impressionsLabel: "4,117",
  registrationsLabel: "425",
  onGroundLabel: "110",
} as const;

export const heroEvents: HeroEventSlide[] = [
  {
    image: "/event_pictures/h4g/h4g2.jpeg",
    imageMobile: "/event_pictures/h4g/h4g2.jpeg",
    alt: "Hack4Good v0",
    badge: "Archived Event",
    status: "archived",
    title: "Hack4Good v0",
    subtitle: "2 May 2026 · Lucknow",
    href: "/events",
  },
  {
    image: "/event_pictures/bd1.jpg",
    imageMobile: "/event_pictures/bd1.jpg",
    alt: "Lucknow Build Guild",
    badge: "Archived Event",
    status: "archived",
    title: "Lucknow Build Guild",
    subtitle: "19 Apr 2026 · Lucknow",
    href: "/events",
  },
  {
    image: "/images/github-copilot-hero-desktop.png",
    imageMobile: "/images/github-copilot-hero-mobile.png",
    alt: "GitHub Copilot Dev Days | Lucknow",
    badge: "Registrations Closed",
    status: "closed",
    title: "GitHub Copilot Dev Days",
    subtitle: "19 Apr 2026 · Lucknow",
    href: "/events",
  },
  {
    image: "/event_pictures/HEe923uagAATqvy.jpg",
    imageMobile: "/event_pictures/HEe923uagAATqvy.jpg",
    alt: "India Innovates 2026 archive",
    badge: "Archived Event",
    status: "archived",
    title: "India Innovates 2026 Archive",
    subtitle: "28 Mar 2026 · New Delhi",
    href: "/events",
  },
];

/** /events hero playlist (inkfish reel). Only existing footage; labels come from existing copy. */
export type ReelClip = {
  event: string;
  title: string;
  src: string;
  poster: string;
  /** Note under the fullscreen player. */
  note?: string;
};

export const eventsReel: ReelClip[] = [
  {
    event: regionalSeriesEvent.title,
    title: "Trailer",
    src: regionalSeriesEvent.trailerSrc,
    poster: regionalSeriesEvent.posterSrc,
    note: "Captions burned in",
  },
  {
    event: "India Innovates 2026",
    title: "Event Video",
    src: "/event_pictures/india-innovates-2026-stage-address.mp4",
    poster: "/event_pictures/HEe923ub0AE-92F.jpg",
    note: "Stage highlights and on-floor moments from the finale.",
  },
  {
    event: "bits&bytes™",
    title: "Documentary Film",
    src: "/movie/bnb-movie.mp4",
    poster: "/movie/bnb-movie-poster.jpg",
  },
];
