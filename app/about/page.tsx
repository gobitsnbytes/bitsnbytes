"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageSection } from "@/components/page-section";
import { LoadingInline } from "@/components/loading-wrapper";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
} from "@/components/ui/glowing-card";
import type { CoreTeamMember, Volunteer } from "@/components/team-case-study";

// Lazy load heavy components
const TeamCaseStudy = dynamic(() => import("@/components/team-case-study"), {
  loading: () => <LoadingInline />,
  ssr: true,
});

const aboutContent = {
  title: "About Bits&Bytes",
  description:
    "We are a student led code club building the alternative to rigid, beginner locked tech events. Run entirely by teenagers, built from scratch.",
  sections: [
    {
      title: "The Origin Story",
      description:
        "In July 2025, our team was organizing a major regional student hackathon under an external partner organization. When they cancelled the event at the last minute, we refused to quit. To build something independent and reliable, we founded Bits&Bytes in November 2025. Originally planning a single cope hackathon, we quickly grew into a sustainable nationwide teen builder network.",
    },
    {
      title: "High Agency Only",
      description:
        "We don't do hand-holding or rigid formats. Bits&Bytes is run entirely by and for teenagers. You'll be surrounded by people who want to write code and launch real projects, not just sit through lectures and collect certificates.",
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

// Executive Leadership & Department Leads
const coreTeam: CoreTeamMember[] = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Chief Executive Officer (CEO)",
    image: "/team/yash.jpeg",
    mobileImagePosition: "center 18%",
    socials: {
      linkedin: "https://www.linkedin.com/in/yashvardhansinghbnb/",
      github: "https://github.com/yashclouded",
      website: "https://yashvibe.codes/",
    },
    accentColor: "var(--brand-purple)",
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika Maurya",
    role: "Chief Creative Officer (CCO) & Chief Operating Officer (COO)",
    image: "/team/aadrika.png",
    mobileImagePosition: "center 20%",
    isFeatured: true,
    socials: {
      linkedin: "https://www.linkedin.com/in/aadrika-maurya/",
      github: "https://github.com/Aadrika08",
      website: "https://aadrikasportfolio.framer.website/",
    },
    accentColor: "var(--brand-pink)",
    isFounder: true,
  },
  {
    id: 3,
    name: "Akshat Kushwaha",
    role: "Chief Technology Officer (CTO)",
    image: "/team/akshat.jpg",
    mobileImagePosition: "center 16%",
    mobileImageScale: 1.03,
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      github: "https://github.com/a3ro-dev",
      website: "https://a3ro.dev",
    },
    accentColor: "var(--brand-plum)",
    isFounder: true,
  },
  {
    id: 4,
    name: "Devaansh Pathak",
    role: "Chief Financial Officer (CFO)",
    image: "/team/devansh.jpeg",
    mobileImagePosition: "center 18%",
    socials: {
      linkedin: "https://www.linkedin.com/in/devaanshpa/",
    },
  },
  {
    id: 5,
    name: "Drishti Arora",
    role: "Chief Marketing Officer (CMO)",
    image: "/team/drishti.jpg",
    mobileImagePosition: "center 20%",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
  },
  // Department Leads
  {
    id: 6,
    name: "Raghwender Vasisth",
    role: "Head of Operations",
    image: "/team/raghav.png",
    mobileImagePosition: "center 20%",
    socials: {
      linkedin: "https://www.linkedin.com/in/raghwender-vasisth/",
    },
  },
  {
    id: 7,
    name: "Maryam Fatima",
    role: "Head of Brand & Media",
    image: "/team/maryam.jpeg",
    mobileImagePosition: "center 22%",
    socials: {
      linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
    },
  },
  {
    id: 8,
    name: "Srishti Singh",
    role: "Head of Partnerships & Institutional Relations",
    image: "/team/srishti.jpeg",
    mobileImagePosition: "center 16%",
    socials: {
      linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
    },
  },
];

// Contributors - organized by track
const volunteers: Volunteer[] = [
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
    role: "Fork Operations Support",
    image: "/team/atharva.jpg",
    linkedin: "https://www.linkedin.com/in/atharvaupadhyay/",
    section: "Operations",
  },
  // Outreach Track
  {
    id: 14,
    name: "Adithya",
    role: "Fork Relations & Sponsor Outreach",
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
    role: "Graphic + Video Editing",
    image: "/team/jaagruti.jpeg",
    section: "Creative",
  },
  {
    id: 18,
    name: "Kavan",
    role: "Graphic + Video Editing",
    image: "/team/kavan.jpg",
    section: "Creative",
  },
  {
    id: 16,
    name: "Vareesha",
    role: "Graphic + Video Editing",
    image: "/team/vareesha.jpg",
    linkedin: "https://www.linkedin.com/in/vareesha-mehdi-a669203ab/",
    section: "Creative",
  },
  {
    id: 13,
    name: "Aishwary",
    role: "Graphic + Video Editing",
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
    role: "Email Writing & Reel Editing",
    image: "/team/diaa.jpg",
    section: "Creative",
  },
  // Tech Track
  {
    id: 5,
    name: "Hridyansh",
    role: "Core Platform Engineering",
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
    role: "Internal Tools & Instrumentation",
    image: "/team/areeb.png",
    linkedin: "https://www.linkedin.com/in/areeb-ahmad-066547315/",
    section: "Tech",
  },
];

export default function About() {
  return (
    <>
      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="About"
          title={aboutContent.title}
          description={aboutContent.description}
          className="pt-24 md:pt-32"
        >
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4">
            {aboutContent.sections.map((section, index) => {
              // Define grid areas for each card
              const gridAreas = [
                "md:[grid-area:1/1/2/7]",
                "md:[grid-area:1/7/2/13]",
                "md:[grid-area:2/1/3/7]",
                "md:[grid-area:2/7/3/13]",
              ];
              return (
                <li key={section.title} className={gridAreas[index]}>
                  <GlowingCard animationDelay={index * 0.05}>
                    <div className="space-y-3">
                      <GlowingCardTitle>{section.title}</GlowingCardTitle>
                      <GlowingCardDescription>
                        {section.description}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                </li>
              );
            })}
          </ul>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Team"
          title="Meet the Agents"
          description="Designers, engineers, club leads, and storytellers. The people behind everything."
        >
          <Suspense fallback={<LoadingInline />}>
            <TeamCaseStudy coreTeam={coreTeam} volunteers={volunteers} />
          </Suspense>
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            *Roles stay flexible as our team and club grow.
          </p>
        </PageSection>
      </main>
    </>
  );
}
