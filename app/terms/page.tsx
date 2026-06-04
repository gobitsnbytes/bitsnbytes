"use client";

import { FileText } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const termsMarkdown = `<aside>
These Terms govern participation in bits&bytes™ programs, community spaces, local Forks, events, and digital platforms operated by GOBITSNBYTES FOUNDATION.
</aside>

---

## 1. Legal Status and Mission

bits&bytes™ is the public builder network operated by GOBITSNBYTES FOUNDATION, a Section 8 non-profit company in India. The network exists for technology education, youth-led building, open-source collaboration, and public-benefit programs.

All income, grants, donations, and sponsorships connected to official bits&bytes™ activity must support the Foundation's educational and community objectives. No participant, organizer, director, volunteer, or local group may treat Foundation funds as personal income or local profit.

## 2. Participation

By joining an event, cohort, project, Fork, repository, Discord, WhatsApp group, or other official space, you agree to follow these Terms, the Code of Conduct, and any event-specific instructions.

Participants are expected to:

- Build with integrity and respect other contributors.
- Follow safety, consent, data protection, and venue rules.
- Avoid misrepresenting their authority, role, or affiliation.
- Keep community spaces productive, lawful, and safe for minors.

## 3. Youth-Led Operations

bits&bytes™ is intentionally youth-led. Titles such as organizer, Fork Lead, maintainer, executive officer, or volunteer describe community responsibilities and coordination roles. They do not automatically create legal authority to bind the Foundation, sign contracts, collect money, or make statutory filings.

Minors may participate and lead operational work where permitted by law, but contracts, banking, venue agreements, sponsorship documents, and other formal commitments must be handled through authorized Foundation channels.

## 4. Fork Network Model

Forks are local or institutional operating groups recognized by the Foundation. A Fork may use the bits&bytes™ name and brand only while recognized and only for approved community activity.

A Fork is not a separate legal entity, franchise, branch office, or independent fundraising body. Fork permission is limited, conditional, and revocable. If recognition ends, the local group must stop using bits&bytes™ names, logos, domains, assets, and official channels.

## 5. Financial Controls

All funds connected to official bits&bytes™ work must be routed through approved Foundation systems. Personal UPI IDs, personal bank accounts, personal QR codes, cash collections, independent payment links, and unofficial sponsor contracts are not allowed unless formally authorized.

This protects participants, sponsors, organizers, and the Foundation from financial confusion, fraud, tax risk, and reputational harm.

## 6. Brand, IP, and Contributions

The bits&bytes™ name, logo, design system, domains, repositories, curricula, documentation, event formats, and other official assets are stewarded by GOBITSNBYTES FOUNDATION.

Community-facing software is generally released under open-source licenses when appropriate, and educational resources may be released under open-content licenses. Contribution terms may vary by project. Minor contributors may require parent or guardian consent for formal assignment or license documentation.

## 7. Safety and Enforcement

The Foundation may suspend access to events, platforms, repositories, roles, or Fork recognition when needed to prevent safety risks, harassment, data misuse, financial irregularity, legal exposure, or serious disruption.

All participants must follow the Code of Conduct. Serious violations, especially those involving minors, harassment, threats, sexual misconduct, doxxing, fraud, or retaliation, may lead to immediate removal and referral to appropriate authorities where required.

## 8. Governing Law

These Terms are governed by the laws of India. Disputes connected with official Foundation activity are subject to the competent courts in Uttar Pradesh, India.

---

Adopted for public use on 4 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-legal-status-and-mission", label: "Legal Status" },
  { id: "2-participation", label: "Participation" },
  { id: "3-youth-led-operations", label: "Youth-Led" },
  { id: "4-fork-network-model", label: "Forks" },
  { id: "5-financial-controls", label: "Finance" },
  { id: "6-brand-ip-and-contributions", label: "Brand & IP" },
  { id: "7-safety-and-enforcement", label: "Safety" },
  { id: "8-governing-law", label: "Law" },
];

export default function TermsOfService() {
  return (
    <LegalPolicyPage
      badge="Legal Framework"
      title="Terms of Service"
      summary="Plain-language rules for participation, local Forks, brand use, finances, youth-led operations, and safety across the bits&bytes™ network."
      updated="Last updated: 4 June 2026"
      icon={FileText}
      sections={sections}
      markdown={termsMarkdown}
      highlights={["Youth-led, legally routed", "No personal fund collection", "Safety powers override local autonomy"]}
    />
  );
}
