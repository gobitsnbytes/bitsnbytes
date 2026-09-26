import {
  HomeFaq,
  HomeHero,
  HomeReel,
  HomeVoices,
  HomeWorks,
  type HomeFaqItem,
} from "@/components/home";
import { IndentStatement } from "@/components/edition/indent-statement";
import { Character } from "@/components/character/character";
import { TornEdge } from "@/components/riot/chapter";
import { Partners } from "@/components/partners";

const homeFaqs: HomeFaqItem[] = [
  {
    question: "Who can join bits&bytes™?",
    answer:
      "Any teenager aged 13–19 who wants to code, design or build products. Beginners are welcome and you don't need any prior experience. You learn by building next to people who are doing the same thing.",
  },
  {
    question: "Are the hackathons and workshops free?",
    answer:
      "Yes. Every bits&bytes™ event, cohort, hackathon and workshop is free to attend, and we cover meals, drinks and stickers. Workshops run inside our hackathons, as part of the build.",
  },
  {
    question: "What makes bits&bytes™ different from other student groups?",
    answer:
      "Students run it, and we're independent: we aren't a branch of any outside group. Every event is built around shipping a real project. There are no passive lectures or slide decks, only people writing code and building things.",
  },
  {
    question: "How do forks (local chapters) work?",
    answer:
      "Like a fork on GitHub: your own copy of upstream that stays linked to the original. Any teen builder can apply to start one in their school or city and run events under our brand, with operational support and mentorship from upstream. Apply at gobitsnbytes.org/fork.",
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
      <IndentStatement
        label="WHO WE ARE"
        number={1}
        id="who-we-are"
        className="[&>div]:px-[4vw]"
        aside={
          <Character
            pose="wave"
            sizes="(min-width: 768px) 100px, 0px"
            className="absolute bottom-0 right-[4vw] hidden w-[clamp(80px,6.5vw,100px)] px-0! md:block"
          />
        }
      >
        We&apos;re a teen-led builder network across India, and our answer to rigid, beginner-locked tech events.
        Teenagers run every part of it, and we built it from scratch.
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
