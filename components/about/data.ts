// /about copy and team data, moved verbatim from the old app/about/page.tsx.

export const aboutContent = {
  title: "About bits&bytes™",
  description:
    "We are a youth-led builder network building the alternative to rigid, beginner-locked tech events. Run entirely by teenagers, built from scratch.",
  highlights: ["100% Teen-Led", "High-Agency Builder Squads", "Permissionless Distributed Nodes"],
  sections: [
    {
      title: "The Origin Story",
      description:
        "In July 2025, our team was organizing a major regional student hackathon under an external partner organization. When they cancelled the event at the last minute, we refused to quit. To build something independent and reliable, we founded bits&bytes™ in November 2025. Originally planning a single cope hackathon, we quickly grew into a sustainable nationwide teen builder network.",
    },
    {
      title: "High Agency Only",
      description:
        "We don't do hand-holding or rigid formats. bits&bytes™ is run entirely by and for teenagers. You'll be surrounded by people who want to write code and launch real projects, not just sit through lectures and collect certificates.",
    },
    {
      title: "Distributed Forks",
      description:
        "Forks are a distributed model where local builders run their own nodes without waiting for permission. They are active in Jaipur, Hyderabad, Bangalore, Kolkata, and Noida, where local teams run their own events and dev squads.",
    },
    {
      title: "Ship Real Products",
      description:
        "Our meetups and hack nights have to end with something launched, not just something learned. We don't build throwaway demos that only exist for a presentation slide. We build actual software that people use.",
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

export interface MotherboardHost {
  discord_id: string;
  booking_link: string;
  timezone: string;
  weekly_hours: string | null;
  is_active: boolean;
  // Extended fields from the availability endpoint
  username?: string;
  title?: string;
  description?: string;
  avatar?: string;
}

export const coreTeam: CoreTeamMember[] = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Chief Executive Officer (CEO)",
    image: "/team/yash.jpeg",
    bio: "Math qualifier (IOQM) & AI prototyping dev. Created Codiva (5-star VS Code extension with thousands of users) and lead community hardware sessions.",
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
    bio: "RSI India Alumni who conducted neuroscience research on EEG signals and attention modeling. Leads brand visual voice and creative strategies.",
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
    bio: "Primary systems architect. Ex Jr. Research Engineer at jhana.ai. Builds high-performance retrieval pipelines and production infra.",
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
    bio: "Co-architected high-performance backend layers and manages partner accounts, sponsors, and budget logistics.",
    socials: {
      linkedin: "https://www.linkedin.com/in/devaanshpa/",
    },
  },
  {
    id: 5,
    name: "Drishti Arora",
    role: "Chief Growth Officer (CGO)",
    image: "/team/drishti.jpg",
    bio: "Leads audience campaigns, community growth, brand strategy, and coordination across regional cohorts.",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
  },
  {
    id: 6,
    name: "Raghwender Vasisth",
    role: "Head of Operations",
    image: "/team/raghav.png",
    bio: "Manages process automation, resource planning, logistical support, and team operations at scale.",
    socials: {
      linkedin: "https://www.linkedin.com/in/raghwender-vasisth/",
    },
  },
  {
    id: 7,
    name: "Maryam Fatima",
    role: "Head of Brand & Media",
    image: "/team/maryam.jpeg",
    bio: "Oversees media assets, visual content, graphic identity, and social media campaigns.",
    socials: {
      linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
    },
  },
  {
    id: 8,
    name: "Srishti Singh",
    role: "Head of Partnerships",
    image: "/team/srishti.jpeg",
    bio: "Coordinates institutional relations, sponsor liaisons, and communications across regional chapters.",
    socials: {
      linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
    },
  },
  {
    id: 9,
    name: "Angel",
    role: "Head of Research & Strategy",
    image: "/team/angel.jpg",
    bio: "Leads strategic research initiatives, community analysis, and organizational growth frameworks.",
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

export function findHostForMember(name: string, hosts: MotherboardHost[]): MotherboardHost | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const mNorm = norm(name);
  if (!mNorm) return undefined;

  // Try exact normalized match first on title (real name)
  let match = hosts.find((h) => h.title && norm(h.title) === mNorm);
  if (match) return match;

  // Try exact normalized match on booking_link
  match = hosts.find((h) => h.booking_link && norm(h.booking_link) === mNorm);
  if (match) return match;

  // Try substring match on title
  match = hosts.find((h) => {
    if (!h.title) return false;
    const hNorm = norm(h.title);
    return hNorm.includes(mNorm) || mNorm.includes(hNorm);
  });
  if (match) return match;

  // Try username matching (e.g. "baakisabmast")
  match = hosts.find((h) => {
    if (!h.username) return false;
    const uNorm = norm(h.username);
    return uNorm.includes(mNorm) || mNorm.includes(uNorm);
  });
  return match;
}
