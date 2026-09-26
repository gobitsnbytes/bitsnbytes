import { Chapter, ChapterHead } from "@/components/riot/chapter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/riot/accordion";

export type HomeFaqItem = { question: string; answer: string };

/** FAQ chapter: riot accordion, indented like the statement (the FAQPage JSON-LD stays in app/page.tsx). */
export function HomeFaq({ faqs }: { faqs: HomeFaqItem[] }) {
  return (
    <Chapter id="faq" title="faq" number={4} tone="cream">
      <div className="px-[4vw]">
        <ChapterHead
          number={4}
          label="FAQ"
          title="Frequently asked questions"
          description="What people usually ask us before they join, answered plainly."
        />
        <div className="lg:ml-[26%]">
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            [Q.{String(faqs.length).padStart(2, "0")}]
          </p>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-[clamp(16px,1.5vw,20px)]">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[17px]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Chapter>
  );
}
