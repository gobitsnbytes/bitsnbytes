"use client";

import { Scale } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const ipMarkdown = `<aside>
This policy explains how the bits&bytes™ name, logo, brand system, software, educational materials, and contributor work may be used.
</aside>

---

## 1. Brand Ownership

bits&bytes™, bitsnbytes, the cube monogram, official logo assets, domains, repositories, design systems, curricula, documentation, event formats, and associated goodwill are stewarded by GOBITSNBYTES FOUNDATION.

The public brand spelling is bits&bytes™. bitsnbytes is the approved alternative where ampersands are unavailable or restricted, such as handles, domains, package names, or file paths.

## 2. Permission to Use the Brand

Recognized Forks, volunteers, partners, schools, and contributors may use the brand only for approved bits&bytes™ activity and only while their permission or recognition remains active.

Brand permission is limited, conditional, non-exclusive, and revocable. It does not allow anyone to create a separate entity, imply independent legal authority, raise funds, sub-license the brand, or claim continuity after recognition ends.

## 3. Logo and Creative Standards

Use official logo files only. Do not stretch, distort, recolor, rotate, outline, add effects, combine with other marks without approval, or place the logo where it becomes illegible.

Public creative should use the brand name accurately, include the trademark symbol where appropriate, avoid unsupported claims, avoid unapproved co-branding, and never include personal data, registration sheets, private communications, or images of minors without proper consent.

## 4. Open Source and Educational Content

The Foundation may release software, curricula, documentation, and educational resources under open-source or open-content licenses when consistent with the mission, safeguarding obligations, third-party rights, and legal compliance.

No Fork, volunteer, or participant may independently license Foundation-owned or Foundation-stewarded assets except through published license terms or written approval.

## 5. Contributor Work

Contributors should expect official project work to be stewarded for continuity and public benefit. Attribution, credits, commit history, acknowledgements, or showcases may recognize contributions, but recognition does not create ownership of the brand, repos, domains, or local Fork identity.

Where a contributor is a minor, formal IP assignment or contributor license documentation may require parent or guardian consent or a Board-approved process.

## 6. Third-Party Rights

All contributors and organizers must respect third-party copyrights, trademarks, licenses, image rights, music rights, font licenses, platform terms, and data rights.

Do not publish, copy, import, train on, distribute, or use third-party material in a way that creates legal, ethical, security, reputational, or consent risk.

## 7. Infringement Reports

If you believe a bits&bytes™ website, repository, event asset, or platform post infringes your copyright or trademark, email hello@gobitsnbytes.org with:

1. The work or mark you believe is infringed.
2. The exact URL, repository, channel, or asset location.
3. Your contact information.
4. A statement that you own the rights or are authorized to act for the owner.
5. A good-faith statement explaining why the use is unauthorized.
6. Your physical or electronic signature.

We review notices promptly and may remove or restrict access to disputed material while assessing the issue.

---

Adopted for public use on 4 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-brand-ownership", label: "Ownership" },
  { id: "2-permission-to-use-the-brand", label: "Permission" },
  { id: "3-logo-and-creative-standards", label: "Logo Use" },
  { id: "4-open-source-and-educational-content", label: "Licensing" },
  { id: "5-contributor-work", label: "Contributors" },
  { id: "6-third-party-rights", label: "Third Party" },
  { id: "7-infringement-reports", label: "Reports" },
];

export default function IntellectualPropertyPolicy() {
  return (
    <LegalPolicyPage
      badge="Brand Stewardship"
      title="Intellectual Property"
      summary="The public policy for brand use, logo permissions, open-source defaults, contributor work, third-party rights, and infringement reports."
      updated="Last updated: 4 June 2026"
      icon={Scale}
      sections={sections}
      markdown={ipMarkdown}
      highlights={["bits&bytes™ is the canonical name", "Brand permission is revocable", "Minor contributor terms require extra care"]}
    />
  );
}
