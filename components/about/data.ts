// /about copy and team data, moved verbatim from the old app/about/page.tsx.

import { FORK_CITIES } from "@/lib/forks";

export const aboutContent = {
  title: "About bits&bytes™",
  description:
    "We're a builder network across India, run entirely by teenagers. We built it from scratch as the alternative to rigid tech events pitched only at beginners.",
  highlights: ["100% teen-led", "High-agency builder squads", "Local forks, one upstream"],
  sections: [
    {
      title: "The Origin Story",
      description:
        "In July 2025, our team was organizing a major regional student hackathon under an external partner organization. By mid-August the partner had cancelled the event, and we refused to quit. We founded bits&bytes™ in November 2025 so our events would never depend on an outside group again. The plan was one 24-hour hackathon to make up for the lost one, and it grew into a teen builder network that runs across India.",
    },
    {
      title: "High Agency Only",
      description:
        "We don't hand-hold, and we don't run rigid formats. bits&bytes™ is run by teenagers, for teenagers. The people next to you came to write code and launch real projects, so nobody sits through lectures to collect a certificate.",
    },
    {
      title: "Distributed Forks",
      description:
        `On GitHub, a fork is your own copy of an upstream repo that stays linked, so work flows back. A bits&bytes™ fork is the same thing for a city or school: a local chapter takes the playbook and brand from upstream, runs its own room, and ships back. Active forks: ${FORK_CITIES}. Start one at gobitsnbytes.org/fork`,
    },
    {
      title: "Ship Real Products",
      description:
        "Our hackathons, and the workshops inside them, have to end with something shipped. A demo that only lives on a presentation slide doesn't count. We build software that people actually use.",
    },
  ],
};

// Derives team member email from their display name: "Aadrika Maurya" → "aadrika@gobitsnbytes.org"
export function getTeamEmail(name: string): string {
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  return `${first}@gobitsnbytes.org`;
}

export interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image: string;
  linkedin?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  isFounder?: boolean;
  isFeatured?: boolean;
}

export interface Volunteer {
  id: number;
  name: string;
  image: string;
  linkedin?: string;
  section: "Creative" | "Tech" | "Outreach" | "Operations";
  role?: string;
}

export const coreTeam: CoreTeamMember[] = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Chief Executive Officer (CEO)",
    image: "/team/yash.jpeg",
    bio: "National IOQM qualifier who prototypes with AI. Built Codiva, a 5-star VS Code extension with thousands of users, and leads community hardware sessions.",
    socials: {
      linkedin: "https://www.linkedin.com/in/yashvardhansinghbnb/",
      github: "https://github.com/yashclouded",
      website: "https://yashvibe.codes/",
    },
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika Maurya",
    role: "Chief Creative Officer & COO",
    image: "/team/aadrika.png",
    bio: "RSI India alumna who did neuroscience research on EEG signals and attention modeling. Leads our visual voice and creative strategy.",
    socials: {
      linkedin: "https://www.linkedin.com/in/aadrika-maurya/",
      github: "https://github.com/Aadrika08",
      website: "https://aadrikasportfolio.framer.website/",
    },
    isFounder: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Akshat Kushwaha",
    role: "Chief Technology Officer (CTO)",
    image: "/team/akshat.jpg",
    bio: "Built and runs our stack. Former Jr. Research Engineer at jhana.ai. Works on retrieval pipelines and production infrastructure.",
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      github: "https://github.com/a3ro-dev",
      website: "https://a3ro.dev",
    },
    isFounder: true,
  },
  {
    id: 4,
    name: "Devaansh Pathak",
    role: "Chief Financial Officer (CFO)",
    image: "/team/devansh.jpeg",
    bio: "Co-architected our backend. Manages partner accounts, sponsors and the budget.",
    socials: {
      linkedin: "https://www.linkedin.com/in/devaanshpa/",
    },
  },
  {
    id: 5,
    name: "Drishti Arora",
    role: "Chief Growth Officer (CGO)",
    image: "/team/drishti.jpg",
    bio: "Runs growth: audience campaigns, brand strategy and coordination across regional cohorts.",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
  },
  {
    id: 6,
    name: "Raghwender Vasisth",
    role: "Head of Operations",
    image: "/team/raghav.png",
    bio: "Keeps operations moving: process automation, resource planning and logistics for the team.",
    socials: {
      linkedin: "https://www.linkedin.com/in/raghwender-vasisth/",
    },
  },
  {
    id: 7,
    name: "Maryam Fatima",
    role: "Head of Brand & Media",
    image: "/team/maryam.jpeg",
    bio: "Looks after our media, visual content, graphic identity and social campaigns.",
    socials: {
      linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
    },
  },
  {
    id: 8,
    name: "Srishti Singh",
    role: "Head of Partnerships",
    image: "/team/srishti.jpeg",
    bio: "Handles institutional relations, sponsor contacts and communication with our regional chapters.",
    socials: {
      linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
    },
  },
  {
    id: 9,
    name: "Angel",
    role: "Head of Research & Strategy",
    image: "/team/angel.jpg",
    bio: "Leads our research: studying the community and planning how the organization grows.",
    socials: {
      linkedin: "https://www.linkedin.com/in/angelp-online/",
      instagram: "https://www.instagram.com/rightangeled/",
    },
  },
];

export const volunteers: Volunteer[] = [
  // Operations Track
  {
    id: 21,
    name: "Shantanu Joshi",
    role: "Ground Operations",
    image: "/team/shantanu.jpeg",
    linkedin: "https://www.linkedin.com/in/theshantanujoshi/",
    section: "Operations",
  },
  {
    id: 8,
    name: "Atharva",
    role: "Fork Ops Support",
    image: "/team/atharva.jpg",
    linkedin: "https://www.linkedin.com/in/atharvaupadhyay/",
    section: "Operations",
  },
  // Outreach Track
  {
    id: 14,
    name: "Adithya",
    role: "Sponsor Outreach",
    image: "/team/adhitya.png",
    linkedin: "https://www.linkedin.com/in/adithya---k/",
    section: "Outreach",
  },
  {
    id: 17,
    name: "Aanjaneya",
    role: "Community Outreach",
    image: "/team/aanjaneya.jpg",
    linkedin: "https://www.linkedin.com/in/aanjaneya-tripathi-0700a4346/",
    section: "Outreach",
  },
  // Creative Track
  {
    id: 11,
    name: "Jaagruti",
    role: "Graphic & Video",
    image: "/team/jaagruti.jpeg",
    section: "Creative",
  },
  {
    id: 16,
    name: "Vareesha",
    role: "Graphic & Video",
    image: "/team/vareesha.jpg",
    linkedin: "https://www.linkedin.com/in/vareesha-mehdi-a669203ab/",
    section: "Creative",
  },
  {
    id: 13,
    name: "Aishwary",
    role: "Video Editing",
    image: "/team/aishwary.jpeg",
    linkedin: "https://www.linkedin.com/in/ashlovesnoodle",
    section: "Creative",
  },
  {
    id: 22,
    name: "Swastika",
    role: "Video Editing",
    image: "/team/swastika.jpg",
    section: "Creative",
  },
  {
    id: 23,
    name: "Diaa",
    role: "Email & Reel Editor",
    image: "/team/diaa.jpg",
    section: "Creative",
  },
  // Tech Track
  {
    id: 5,
    name: "Hridyansh",
    role: "Platform Engineer",
    image: "/team/hirdyansh.jpeg",
    linkedin: "https://www.linkedin.com/in/hridyansh-bhardwaj-739470406/",
    section: "Tech",
  },
  {
    id: 15,
    name: "Prakhar",
    role: "Fork Software Systems",
    image: "/team/prakhar.png",
    linkedin: "https://www.linkedin.com/in/prakharrdev/",
    section: "Tech",
  },
  {
    id: 7,
    name: "Areeb",
    role: "Dev and Project Manager",
    image: "/team/areeb.png",
    linkedin: "https://www.linkedin.com/in/areeb-ahmad-066547315/",
    section: "Tech",
  },
];
