"use client";

import { FileText } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const termsMarkdown = `<aside>
These Terms govern participation in bits&bytes™ programs, community spaces, local Forks, events, and digital platforms operated by GOBITSNBYTES FOUNDATION.
</aside>

---

## 1. Legal Status and Non-Profit Mission

bits&bytes™ is the public-facing brand name and community identity of the builder network operated by GOBITSNBYTES FOUNDATION, a company registered under Section 8 of the Companies Act, 2013 (Uttar Pradesh, India) as a non-profit organization.

In accordance with Section 8 of the Act and Clause 5 of our Memorandum of Association (e-MOA):
- All profits, income, grants, donations, and sponsorships connected to official bits&bytes™ activity must be applied solely to promoting our educational, youth development, and technology objectives.
- No portion of the Foundation's income, profits, or assets may be paid or transferred, directly or indirectly, by way of dividend, bonus, or otherwise as profit to any member or representative.
- In the event of winding up or dissolution, any remaining assets after satisfying all liabilities must be transferred to another Section 8 company with similar objects or credited to the statutory Rehabilitation and Insolvency Fund.
- Each formal member of the Foundation guarantees a contribution of up to ₹10,000 in the event of winding up.

## 2. Participation and Membership

By joining an event, cohort, project, Fork, repository, Discord, WhatsApp group, or other official space, you agree to follow these Terms, the Code of Conduct, and any event-specific instructions.

Network participation is distinct from corporate membership:
- Fork Leads, volunteers, contributors, and attendees are "Network Participants."
- Network participation does not confer voting rights in GOBITSNBYTES FOUNDATION's statutory affairs or ownership of its assets.
- The Board of Directors reserves the right to suspend or terminate any participant's access or role for code of conduct violations, safety concerns, financial irregularities, or behavior that risks the reputation of the Network.

## 3. Youth-Led Operations and Executive Officers

bits&bytes™ is structurally designed to support youth leadership. Minors may act as contributors, organizers, Fork Leads, Local Maintainers, Executive Officers, and volunteers to the extent permitted by law.

- **Protected Operational Participation:** Participation by a minor in any leadership, coordination, or executive role does not impose adult legal responsibility, fiduciary status, personal liability, or statutory signing authority on the minor.
- **Authority Limits:** Titles used within the Network (such as CEO, CTO, CFO, COO, CCO, Fork Lead, or Organizer) describe operational coordination roles. They do NOT confer statutory directorship, ownership of corporate assets, or the authority to sign contracts, bind the Foundation, operate corporate bank accounts, or make representations of legal authority.
- **Executive Officers:** Appointed by and serve at the pleasure of the Board of Directors. They may exercise operational responsibilities within Board-defined limits but cannot bind the Foundation except where explicitly authorized in writing.

## 4. Fork Network Model

A Fork is a recognized local, institutional, or thematic operating unit of the bits&bytes™ Network recognized under authority of GOBITSNBYTES FOUNDATION.
- **Limited License:** Fork Recognition is a limited, conditional, revocable, and non-exclusive operational and brand-use permission. A Fork is not a separate legal entity, franchise, branch office, joint venture, or independent fundraising body.
- **Recognition Status:** Forks may progress from provisional to full recognition based on compliance reviews.
- **Archiving and Revocation:** The Board reserves the right to archive a Fork (for inactivity, leadership transitions, or compliance lapses) or revoke Fork Recognition (for policy violations or safety breaches). If recognition ends or is archived, the local group must immediately cease using all bits&bytes™ names, logos, domains, and assets. A Fork may be archived automatically if inactive for more than 90 days.

## 5. Financial Controls and Expense Reimbursements

All money, sponsorships, grants, donations, event fees, and financial contributions connected with bits&bytes™ must be routed exclusively through approved corporate bank accounts and payment gateways managed by GOBITSNBYTES FOUNDATION.

- **Strictly Prohibited:** Collecting corporate or event funds via personal UPI IDs, personal bank accounts, personal QR codes, or cash collections; using personal digital wallets to hold corporate funds; and entering into informal sponsor agreements.
- **Expense Reimbursement:** No participant or organizer may commit personal funds and expect reimbursement without prior written authorization from the Board or the designated Chief Financial Officer.
- **Local Sponsorships:** Forks must route all sponsorship agreements and received funds upstream to the corporate account.

## 6. Brand, IP, and Contributions

The bits&bytes™ name, logo, design system, domains, repositories, curricula, documentation, event formats, and other official assets are stewarded by GOBITSNBYTES FOUNDATION.
- **Contributed Work:** All code, design, content, curriculum, or documentation developed by Executive Officers, Fork Leads, volunteers, or participants in connection with Foundation programs or events shall vest in or be licensed to the Foundation to ensure project continuity and the open-source mission of the Network.
- **Open-Source Defaults:** The Foundation defaults to open-source software (e.g., MIT or Apache 2.0) and open-content licensing (e.g., Creative Commons) for educational and public-benefit assets, subject to terms defined by the Board.

## 7. Limitation of Liability

GOBITSNBYTES FOUNDATION, its directors, and officers shall not be liable for any indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with the Network.
- The Foundation is not liable for content created by participants, third-party services, actions of individual Forks, or technical issues with digital platforms.
- To the maximum extent permitted by law, the Foundation's total liability under these Terms is limited to the amount of fees paid by the participant (if any) to the Foundation in the preceding 12 months.
- The Foundation may indemnify directors and officers for actions taken in good faith in the performance of their duties, excluding cases of willful default, fraud, or breach of duty.

## 8. Governing Law and Dispute Resolution

These Terms and all activities of the bits&bytes™ Network are governed by the laws of India.
- **Escalation:** Any disputes, safety concerns, legal threats, or financial discrepancies must be immediately escalated to Upstream governance at hello@gobitsnbytes.org.
- **Dispute Resolution:** In the event of a dispute, parties shall first attempt to resolve the matter through good-faith negotiation for a period of 30 days. If negotiation fails, parties may seek mediation in Lucknow, Uttar Pradesh.
- **Jurisdiction:** Subject to mediation, any formal legal proceedings connected with GOBITSNBYTES FOUNDATION are subject to the exclusive jurisdiction of the competent courts in Lucknow, Uttar Pradesh, India.

---

Adopted for public use on 6 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-legal-status-and-non-profit-mission", label: "Legal Status" },
  { id: "2-participation-and-membership", label: "Participation" },
  { id: "3-youth-led-operations-and-executive-officers", label: "Youth-Led" },
  { id: "4-fork-network-model", label: "Forks" },
  { id: "5-financial-controls-and-expense-reimbursements", label: "Finance" },
  { id: "6-brand-ip-and-contributions", label: "Brand & IP" },
  { id: "7-limitation-of-liability", label: "Liability" },
  { id: "8-governing-law-and-dispute-resolution", label: "Law" },
];

export default function TermsOfService() {
  return (
    <LegalPolicyPage
      badge="Legal Framework"
      title="Terms of Service"
      summary="Plain-language rules for participation, local Forks, brand use, finances, youth-led operations, and safety across the bits&bytes™ network."
      updated="Last updated: 6 June 2026"
      icon={FileText}
      sections={sections}
      markdown={termsMarkdown}
      highlights={["Youth-led, legally routed", "No personal fund collection", "Safety powers override local autonomy"]}
    />
  );
}
