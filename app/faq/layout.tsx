import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions About bits&bytes™",
  description:
    "Get answers about joining bits&bytes™ teen builders network. Learn about hackathons, membership, time commitments & what to expect. Everything you need to know!",
  keywords: [
    "bits&bytes™ faq",
    "teen coding network questions",
    "hackathon faq",
    "how to join coding network",
    "student hackathon questions",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/faq",
  },
  openGraph: {
    title: "FAQ | bits&bytes™ — Frequently Asked Questions",
    description: "Get answers about joining bits&bytes™, our hackathons, and what to expect from India's teen builders network.",
    url: "https://gobitsnbytes.org/faq",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "bits&bytes™ FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | bits&bytes™ — Frequently Asked Questions",
    description: "Does bits&bytes™ cost money? Do I need experience? Can I bring a team? All answers here.",
  },
};

// FAQ Structured Data for Google Rich Results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is bits&bytes™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "bits&bytes™ is a student-led tech network that runs hackathons and other events. Our hackathons follow the usual format but aren't traditional—we have some inspirations from Hack Club style hackathons. Our focus is on creativity; lots of attendees are newer to coding.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need coding experience to join bits&bytes™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all! We welcome beginners and pair them with experienced mentors. What matters most is your enthusiasm to learn and build.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a membership fee to join bits&bytes™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "bits&bytes™ is completely free to join. We believe tech education should be accessible to all students.",
      },
    },
    {
      "@type": "Question",
      name: "Can I come to hackathons with a pre-formed team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can come to our hackathon with a pre-formed team, or you can form a team once you're on the ground. At the beginning of the event, everyone has the chance to pitch ideas for apps or games they want to make.",
      },
    },
    {
      "@type": "Question",
      name: "How much time do I need to commit to bits&bytes™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend 2-4 hours per week, but it's flexible. Some weeks you might attend a workshop, others you might work on a project async.",
      },
    },
    {
      "@type": "Question",
      name: "Can I volunteer for bits&bytes™?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! We're almost always looking for help with organizers, general day-of volunteers, workshops, and mentors. Reach out through our contact page to learn more.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own what I build at hackathons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you retain full ownership of the projects, code, and designs you create. By submitting or showcasing your project on our platforms, you grant GOBITSNBYTES FOUNDATION a perpetual, royalty-free, non-exclusive license to share it for our non-profit educational and community-showcasing purposes.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if someone breaks the rules?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Violations of our Code of Conduct can lead to warnings, role restriction, suspension from events, or a permanent ban. Serious violations are escalated to legal authorities. Any disciplined participant has 14 days to appeal the decision in writing to the Board of Directors.",
      },
    },
    {
      "@type": "Question",
      name: "How is my data handled?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We process data as a Data Fiduciary under the Digital Personal Data Protection Act, 2023 (DPDP Act). We only collect what is needed for participation and safety. We never sell your data, and minor data is protected with extra safeguarding measures under POCSO and the DPDP Act.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the bits&bytes™ brand?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recognized Forks and approved volunteers are granted a revocable, non-exclusive, royalty-free license to use the brand for authorized activities only. Local groups are not authorized to raise money or sign contracts on behalf of the brand.",
      },
    },
  ],
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
