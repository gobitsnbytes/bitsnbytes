"use client";

import { useState } from "react";
import { FigWindow, LAB_STICKY, LabFeed, LabFilters, type LabFilterValue } from "@/components/lab";
import { cn } from "@/lib/utils";
import { LabRow } from "./lab-row";

export type FaqEntry = { question: string; answer: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * stripe.dev feed for the FAQ: sticky "/ ALL" directory + Fig. 1 beside a disclosure list.
 * The questions carry no categories, so the directory is the single "All" group (it narrows
 * nothing). The first three answers start open, as they always have.
 */
export function FaqFeed({ faqs, seed }: { faqs: FaqEntry[]; seed: string }) {
  const [filters, setFilters] = useState<LabFilterValue>({ all: [] });

  return (
    <LabFeed
      labels={["No.", "Question"]}
      aside={
        <div className={cn(LAB_STICKY, "grid gap-8")}>
          <LabFilters
            className="lg:static lg:grid-cols-1"
            groups={[{ id: "all", label: "All", options: [{ value: "all", label: "All", count: faqs.length }] }]}
            value={filters}
            onChange={setFilters}
          />
          <FigWindow seed={seed} fig={1} className="max-lg:hidden" />
        </div>
      }
    >
      {faqs.map((faq, index) => (
        <LabRow key={faq.question} label={`Q.${pad(index + 1)}`} title={faq.question} defaultOpen={index < 3}>
          <p>{faq.answer}</p>
        </LabRow>
      ))}
    </LabFeed>
  );
}
