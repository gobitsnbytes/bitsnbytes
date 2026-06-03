"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import PageSection from "@/components/page-section";

export default function InfiniteMovingCardsDemo() {
  return (
    <PageSection
      eyebrow="Stories"
      title="Voices from the crew"
      align="center"
      className="relative overflow-hidden"
    >
      <div className="relative flex h-[20rem] flex-col items-center justify-center overflow-hidden rounded-md antialiased">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </PageSection>
  );
}

const testimonials = [
  {
    quote:
      "Our builder meetups feel electric. Teens building, pitching, and cheering each other on. Students can run real events.",
    name: "Aadrika",
    title: "Community Lead",
    image: "/team/aadrika.png",
  },
  {
    quote:
      "We pair first-time coders with mentors, so everyone ships something real. The confidence boost is unreal.",
    name: "Yash",
    title: "Chief Executive Officer",
    image: "/team/yash.jpeg",
  },
  {
    quote:
      "bits&bytes™ let me dig into complex backend systems. Now I help others design their own projects.",
    name: "Devansh",
    title: "Backend Specialist",
    image: "/team/devansh.jpeg",
  },
  {
    quote:
      "I never thought I could build apps until I joined. The mentorship here is different. Everyone actually wants you to win.",
    name: "Maryam",
    title: "Mobile Dev Lead",
    image: "/team/maryam.jpeg",
  },
  {
    quote:
      "From design systems to deployment pipelines, we learn by doing. That's how you actually grow as an engineer.",
    name: "Kaustubh",
    title: "DevOps Engineer",
    image: "/team/kaustubh.jpeg",
  },
];
