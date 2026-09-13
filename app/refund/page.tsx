"use client";

import { CreditCard } from "lucide-react";
import { LegalPolicyPage } from "@/components/legal-policy-page";

const refundMarkdown = `<aside>
This Cancellation and Refund Policy governs registrations, voluntary donations, sponsorships, and any financial transactions associated with bits&bytes™ and operated by GOBITSNBYTES FOUNDATION, a non-profit company registered under Section 8 of the Companies Act, 2013 (Uttar Pradesh, India).
</aside>

---

## 1. 100% Free Core Community Programs

The primary mission of bits&bytes™ is getting ambitious teenagers to build and ship software without financial barriers.

- **Free Hackathons & Events:** All official student hackathons, online sprints, Discord community spaces, Minecraft builder environments, and local guild meetups are **100% free** for eligible student attendees.
- **No Hidden Fees:** We do not charge registration fees, application fees, or evaluation fees for student participation in our core hackathons.
- **Meals & Materials:** At physical hackathons, meals, drinks, stickers, and event badges are provided free of cost to registered attendees, subject to venue capacity and safety rules.

## 2. Voluntary Donations and Non-Profit Contributions

GOBITSNBYTES FOUNDATION operates strictly as a Section 8 non-profit company. In accordance with Section 8 of the Companies Act, 2013 and Clause 5 of our e-MOA:
- **Application of Funds:** All financial contributions, grants, and donations received are applied exclusively towards educational workshops, open-source tooling, infrastructure, student travel stipends, and non-profit community programs.
- **No Dividends:** No portion of the Foundation's income is paid or transferred by way of dividend, bonus, or profit to any members or directors.
- **Donation Policy:** Because donations and charitable contributions are immediately committed to ongoing student programs, compute grants, and event logistics, voluntary donations made to GOBITSNBYTES FOUNDATION are generally **non-refundable** once processed and official receipts are issued.
- **Duplicate or Erroneous Transactions:** If you experience a technical error resulting in a duplicate donation, please notify finance@gobitsnbytes.org within **7 calendar days** of the transaction. Verified duplicate charges will be refunded in full.

## 3. Paid Workshops, Merchandise, or Ticketed Programs (If Applicable)

From time to time, bits&bytes™ or local Forks may organize specialized masterclasses, industry summits, or branded merchandise offerings where nominal fees apply:

### 3.1 Cancellation by Participant
- **Advance Notice (7+ Days):** If a participant cancels their registration at least 7 calendar days before the scheduled start date of a ticketed event or workshop, they are entitled to a **full refund** minus any third-party payment gateway transaction processing fees.
- **Late Cancellation (Under 7 Days):** Cancellations submitted fewer than 7 days prior to the event are non-refundable, as operational resources, seating, and mentor commitments are locked in advance.
- **Participant Transfer:** Participants who cannot attend may request to transfer their ticket to another eligible student builder up to 48 hours prior to the event by contacting events@gobitsnbytes.org.

### 3.2 Cancellation or Rescheduling by the Foundation
- **Event Cancellation:** If an event or workshop is cancelled by GOBITSNBYTES FOUNDATION due to force majeure, venue unavailability, or safety considerations, all registered paying participants will receive a **100% refund** to their original payment source.
- **Rescheduled Dates:** If an event is postponed or rescheduled, participants will be given the choice between attending on the rescheduled date or requesting an immediate full refund.

## 4. Refund Processing Timelines and Method

All authorized refunds are processed through approved banking and payment gateway channels (such as Razorpay or direct bank transfer):
- **Payment Method:** Refunds will be credited exclusively to the original payment method (original bank account, UPI ID, or credit/debit card) used during the transaction.
- **Processing Time:** Once approved by our finance team, refunds are typically initiated within **2 business days** and will reflect in the payer's account within **5 to 7 business days**, subject to bank processing cycles.
- **Cash Payments Prohibited:** In accordance with our Financial Controls Policy (Terms of Service Section 5), GOBITSNBYTES FOUNDATION never issues cash refunds or processes transactions via unverified personal accounts.

## 5. Dispute Resolution and Chargebacks

Before initiating a bank chargeback or dispute, we encourage supporters and participants to contact us directly:
- **Direct Resolution:** Contact our finance team at finance@gobitsnbytes.org with the transaction reference, date, and payer details. We resolve billing disputes promptly and transparently.
- **Statutory Consumer Rights:** Nothing in this policy limits or affects your statutory rights under the Consumer Protection Act, 2019 or the Consumer Protection (E-Commerce) Rules, 2020.

## 6. Grievance Officer and Billing Contact

For billing questions, refund claims, duplicate charge reviews, or payment issues:

- **Entity:** GOBITSNBYTES FOUNDATION (Section 8 Non-Profit Company | CIN: U85500UP2026NPL248652)
- **Email:** finance@gobitsnbytes.org / hello@gobitsnbytes.org
- **Grievance Redressal:** grievance@gobitsnbytes.org
- **Registered Office:** 265/1 Patrakar Colony, Ashok Nagar, Prayagraj - 211001, Uttar Pradesh, India
- **Operational / Creator Base:** Lucknow, Uttar Pradesh, India

---

Adopted for public use on 6 June 2026. Contact: finance@gobitsnbytes.org.`;

const sections = [
  { id: "1-100-free-core-community-programs", label: "Free Programs" },
  { id: "2-voluntary-donations-and-non-profit-contributions", label: "Donations" },
  { id: "3-paid-workshops-merchandise-or-ticketed-programs-if-applicable", label: "Paid Events" },
  { id: "4-refund-processing-timelines-and-method", label: "Timelines" },
  { id: "5-dispute-resolution-and-chargebacks", label: "Disputes" },
  { id: "6-grievance-officer-and-billing-contact", label: "Contact" },
];

export default function RefundPolicy() {
  return (
    <LegalPolicyPage
      badge="Consumer Protection"
      title="Cancellation & Refund Policy"
      summary="Clear, transparent terms regarding free hackathons, non-profit charitable donations, ticket cancellations, and refund timelines under Indian law."
      updated="Last updated: 13 September 2026"
      icon={CreditCard}
      sections={sections}
      markdown={refundMarkdown}
      highlights={[
        "100% free student hackathons & community membership",
        "Section 8 non-profit donation rules",
        "5-7 business days refund turnaround to original source",
      ]}
    />
  );
}
