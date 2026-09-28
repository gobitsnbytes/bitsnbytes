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
  /**
   * Fullscreen look. "cover" (default): the clip fills the screen. "gradient": the clip sits framed at a sensible
   * size on a drifting brand gradient and plays once through, then offers replay / close.
   */
  mode?: "cover" | "gradient";
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
    mode: "gradient",
  },
];

/** One photo in the /events "In Pictures" bento. w × h: displayed size after EXIF rotation. */
export type EventPhoto = {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** Shown after the event name in the caption. */
  title?: string;
  /** Asks the bento for a big 2×2 tile. */
  feature?: boolean;
};

/**
 * Every usable event photo, grouped by event (the gallery mixes them). Add new photos to their event's list.
 * The two India Innovates press photos (1ae8b918…, 3d53b490…) keep their Getty Images / Hindustan Times watermark
 * on purpose (the user's call). Left out on purpose: the .HEIC originals (h4g1/h4g3 have JPEG copies), the banners,
 * devday4 (almost all black: its duotone prints as a solid ink block that reads as an empty cell), and h4g_hackers / h4g_hallway /
 * h4g_standee, which are smaller copies of h4g0, h7g and h4g2.
 */
export const eventPhotos: { event: string; photos: EventPhoto[] }[] = [
  {
    event: "India Innovates 2026",
    photos: [
      { src: "/event_pictures/HEe923uagAATqvy.jpg", w: 1600, h: 1067, title: "Build table", feature: true, alt: "Two finalists wiring a hardware prototype at their table, India Innovates 2026" },
      { src: "/event_pictures/HEe923ub0AE-92F.jpg", w: 1600, h: 1067, title: "Plenary session", alt: "A speaker at the podium addressing the hall at Bharat Mandapam" },
      { src: "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg", w: 801, h: 1200, title: "Jury interaction", alt: "Evaluators gathered round a student team's laptop for an on-floor demo" },
      { src: "/event_pictures/HEe93oOakAAi2Mi.jpg", w: 1600, h: 1067, title: "Participant teams", alt: "A student team seated at their table before the demonstrations" },
      { src: "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg", w: 1024, h: 687, alt: "A speaker pointing skyward at the Hamara Neta App podium, India Innovates 2026" },
      { src: "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg", w: 1024, h: 757, alt: "A speaker at the podium under the India Innovates 2026 screen, guests seated on stage" },
    ],
  },
  {
    event: "Hack4Good v0",
    photos: [
      { src: "/event_pictures/h4g/h4g0.jpg", w: 3072, h: 4096, title: "D-Day coding sprint", alt: "Hackers at their laptops during the Hack4Good coding round" },
      { src: "/event_pictures/h4g/h4g1.jpg", w: 4032, h: 3024, title: "Pitching session", alt: "A team presenting its project to the room from a projector slide" },
      { src: "/event_pictures/h4g/h4g3.jpg", w: 4032, h: 3024, title: "Project iteration", feature: true, alt: "A team crowded round one laptop, working through their agent with mentors" },
      { src: "/event_pictures/h4g/h4g2.jpeg", w: 4284, h: 5712, alt: "The Hack4Good standee at Cubispace with a sculpture of energy-drink cans in front" },
      { src: "/event_pictures/h4g/h7g.jpeg", w: 4284, h: 5712, alt: "A hacker in a helmet aiming a can contraption down the Cubispace corridor" },
      { src: "/event_pictures/h4g/h4g.jpg", w: 4096, h: 3072, alt: "Round woven lamps glowing under the ceiling at the Hack4Good venue" },
    ],
  },
  {
    event: "Execron 1.0",
    photos: [
      { src: "/event_pictures/byteforge1.webp", w: 1080, h: 608, alt: "A packed lecture hall of students at Execron 1.0, IIT Kanpur" },
      { src: "/event_pictures/byteforge4.webp", w: 1080, h: 720, alt: "Three participants working at one laptop in front of a chalkboard" },
      { src: "/event_pictures/byteforge3.webp", w: 1080, h: 720, alt: "A laptop screen, close up, during the sprint" },
      { src: "/event_pictures/byteforge2.webp", w: 1080, h: 720, feature: true, alt: "Participants talking in a circle in front of a chalkboard" },
      { src: "/event_pictures/byteforge5.webp", w: 1080, h: 608, alt: "Execron 1.0 participants posing for a group photo in a classroom" },
    ],
  },
  {
    event: "GitHub Copilot Dev Days",
    photos: [
      { src: "/event_pictures/devday.jpeg", w: 1280, h: 960, alt: "A speaker presenting Agentic Coding with GitHub Copilot to the room" },
      { src: "/event_pictures/devday2.jpeg", w: 960, h: 1280, alt: "A speaker with a microphone in front of the audience" },
      { src: "/event_pictures/devday3.jpeg", w: 722, h: 1600, alt: "A table of stickers, swag and an Octocat plush" },
      { src: "/event_pictures/founder-s.jpeg", w: 517, h: 720, alt: "An attendee grinning behind a printed sign" },
    ],
  },
];

/**
 * Events other teams ran, with bits&bytes™ as community partner (we are not the organiser). Newest first, undated
 * partnerships last. Text only: no partner logos (no licensed assets), never their images.
 */
export type PartnerEvent = {
  id: string;
  name: string;
  /** The organiser. */
  host: string;
  /** Archive venue column. */
  venue: string;
  /** Archive list date, e.g. "2026.08.15 → 16"; left out when we don't know it. */
  dateLabel?: string;
  /** ISO 8601 for JSON-LD (month precision where the day isn't confirmed). No date: no Event in the JSON-LD. */
  startDate?: string;
  endDate?: string;
  format?: string;
  description: string;
  url: string;
};

export const communityPartnerEvents: PartnerEvent[] = [
  {
    id: "dorahacks-2-0",
    name: "DoraHacks 2.0",
    host: "Dora DAO",
    // Sources give conflicting dates, so only the year is shown.
    venue: "Online",
    dateLabel: "2026",
    startDate: "2026",
    format: "72-hour vibecoding sprint",
    description:
      "A 72-hour global online vibecoding sprint by Dora DAO. Teams build AI products and launch them on Product Hunt and Peerlist. bits&bytes™ was a community partner.",
    url: "https://doradao.substack.com/p/dorahacks-20",
  },
  {
    id: "infinity-hacks-2026",
    name: "Infinity Hacks 2026",
    host: "HackerRank Campus Crew",
    venue: "Online",
    dateLabel: "2026.08.15 → 16",
    startDate: "2026-08-15",
    endDate: "2026-08-16",
    format: "24-hour global hackathon",
    description:
      "A 24-hour global online hackathon by HackerRank Campus Crew, with AI-first tracks such as road safety, women safety, climate and wildlife protection, for teams of 3–5. bits&bytes™ was a community partner.",
    url: "https://hrcc-infinityhacks.vercel.app/",
  },
  {
    id: "nexushacks-2026",
    name: "NexusHacks 2026",
    host: "Phaser",
    venue: "Online",
    dateLabel: "2026.07.21 → 23",
    startDate: "2026-07-21",
    endDate: "2026-07-23",
    format: "48-hour AI × Robotics hackathon",
    description:
      "A 48-hour global online AI × Robotics hackathon by Phaser, with Agentic AI and Embedded AI categories and a ₹20,000 prize pool. bits&bytes™ was a community partner.",
    url: "https://phaser.in/nexushacks",
  },
];
