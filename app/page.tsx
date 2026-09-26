import {
  HomeFaq,
  HomeHero,
  HomeReel,
  HomeVoices,
  HomeWorks,
  type HomeFaqItem,
} from "@/components/home";
import { IndentStatement } from "@/components/edition/indent-statement";
import { TornEdge } from "@/components/riot/chapter";
import { Partners } from "@/components/partners";

const homeFaqs: HomeFaqItem[] = [
  {
    question: "Who can join bits&bytes™?",
    answer:
      "Any teenager aged 13-19 interested in coding, designing, or building products. Beginners are extremely welcome! No prior experience is required—you will learn by doing alongside other builders.",
  },
  {
    question: "Are the hackathons and workshops free?",
    answer:
      "Yes, all bits&bytes™ events, cohorts, hackathons, and workshops are 100% free to attend, with meals, drinks, and stickers fully covered.",
  },
  {
    question: "What makes bits&bytes™ different from other student groups?",
    answer:
      "We are completely student-led, youth-led, and independent. We focus 100% on shipping real projects and developer agency. There are no passive lectures or boring slides—just pure coding and building.",
  },
  {
    question: "How do local hubs (Forks) work?",
    answer:
      "Forks are our local student-led chapters. Any teen builder can apply to start a Fork in their school or city to run events and workshops under our brand, with operational support and mentorship from Upstream.",
  },
];

// buttermax 1:1 in brand (DESIGN.md "Homepage"): orange hero → curtain reel → one long paper panel
// (statement, works grid) torn over the reel → partners → FAQ → voices.
// No wrapper element: #film's fixed media needs ancestors without transform/filter.
export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeReel />

      <TornEdge from="ink" to="paper" flip />
      <IndentStatement label="WHO WE ARE" number={1} id="who-we-are" className="[&>div]:px-[4vw]">
        We are a youth-led builder network building the alternative to rigid, beginner-locked tech events. Run
        entirely by teenagers, built from scratch.
      </IndentStatement>
      <HomeWorks />

      <Partners />
      <HomeFaq faqs={homeFaqs} />
      <HomeVoices />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": homeFaqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
