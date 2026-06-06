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
    title: "FAQ - Frequently Asked Questions | bits&bytes™",
    description: "Get answers about joining bits&bytes™, our hackathons, and what to expect from India's teen builders network.",
    url: "https://gobitsnbytes.org/faq",
    type: "website",
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
