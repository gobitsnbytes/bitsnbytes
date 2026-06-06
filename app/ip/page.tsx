"use client";

import { Scale } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const ipMarkdown = `<aside>
This policy explains how the bits&bytes™ name, logo, brand system, software, educational materials, and contributor work may be used.
</aside>

---

## 1. Brand Ownership and Trademarks

GOBITSNBYTES FOUNDATION is the sole legal owner and steward of all intellectual property, trademarks, copyrights, trade secrets, domain names (including gobitsnbytes.org), code repositories, curriculum resources, design systems, and visual marks associated with the bits&bytes™ brand.

- **Name Usage:** The primary, canonical brand spelling is bits&bytes™. In contexts where the ampersand character ("&") is unavailable or restricted (such as domains, email handles, package managers, or file systems), "bitsnbytes" is the approved and equivalent alternative.
- **Brand Assets:** The 3D cube monogram (containing a stylized "BB" and a star accent), the full wordmark, all logo files, and associated goodwill are protected trademarks of GOBITSNBYTES FOUNDATION.

## 2. Fork and Partner Licensing

Recognized Forks, volunteers, partners, and schools may use the brand only for approved community activities and only while their recognition remains active.
- **License Terms:** In accordance with Article 40 of our e-AOA, the Foundation grants recognized Forks a limited, revocable, non-exclusive, non-transferable, royalty-free license to use Foundation trademarks and assets solely for approved local activities.
- **Restrictions:** This license does not allow anyone to create a separate legal entity, imply independent contracting or signing authority, raise or hold funds independently, sub-license the brand, or claim continuity after recognition ends.

## 3. Logo and Creative Standards

Use official logo files only, which must be reversed white on dark backgrounds or single-color on light backgrounds.
- Do not stretch, distort, recolor, rotate, outline, add effects, combine with other marks without approval, or place the logo where it becomes illegible.
- Public creative assets should use the brand name accurately, include the trademark symbol (™) where appropriate, avoid unsupported claims, avoid unapproved co-branding, and never include personal data, registration sheets, private communications, or images of minors without verified parent/guardian consent.

## 4. Participant Content and Project Ownership

We respect the creative work of student builders.
- **Ownership:** Participants retain full ownership of the intellectual property (projects, code, designs, presentations) they create during bits&bytes™ hackathons and events, unless agreed otherwise in writing.
- **License Grant:** By submitting projects, code, or presentations to Foundation platforms or event showcases, participants grant GOBITSNBYTES FOUNDATION a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, modify, distribute, and display the submission for the Foundation's non-profit, educational, and promotional purposes.
- **No Endorsement:** The showcase or use of participant content by the Foundation does not imply official endorsement.

## 5. Contributed Work and Open Source

To ensure project continuity and the public-benefit mission of the Network:
- **Vesting of Contributions:** All code, designs, content, curriculum, or documentation developed by Executive Officers, Fork Leads, volunteers, or contributors in connection with official Foundation programs, repositories, or digital assets shall vest in or be licensed to GOBITSNBYTES FOUNDATION.
- **Open-Source Defaults:** The Foundation defaults to open-source software licenses (such as MIT or Apache 2.0) and open-content licenses (such as Creative Commons) for educational resources and public-benefit assets, subject to terms approved by the Board.
- **Recognition:** Attribution and commit histories recognize contributions, but recognition does not create ownership of the repository, domain, or Fork identity. Minor contributors may require parent/guardian consent for formal assignments.

## 6. Third-Party Rights and Liability

All contributors, organizers, and participants must respect third-party copyrights, trademarks, licensing terms, and privacy rights.
- **No Infringement:** Do not publish, copy, import, or distribute third-party materials without proper licensing or authorization.
- **Disclaimer:** GOBITSNBYTES FOUNDATION is not liable for intellectual property infringements committed by individual participants, volunteers, or independent Forks.

## 7. Infringement Reports and Dispute Resolution

If you believe any content on a bits&bytes™ website, repository, or official platform infringes your copyright or trademark, please email hello@gobitsnbytes.org with:
1. Identify the work or mark you believe is infringed.
2. The exact URL, repository, or asset location.
3. Your contact information (name, address, email).
4. A statement of ownership or authorization to act on behalf of the owner.
5. A good-faith statement explaining why the use is unauthorized.
6. Your electronic or physical signature.

Upon receipt of a valid notice, we will review and may remove or restrict access to the disputed material. In accordance with Article 46 of the e-AOA, the Board of Directors has final authority over intellectual property disputes within the Network.

---

Adopted for public use on 6 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-brand-ownership-and-trademarks", label: "Ownership" },
  { id: "2-fork-and-partner-licensing", label: "Permission" },
  { id: "3-logo-and-creative-standards", label: "Logo Use" },
  { id: "4-participant-content-and-project-ownership", label: "Participant IP" },
  { id: "5-contributed-work-and-open-source", label: "Licensing" },
  { id: "6-third-party-rights-and-liability", label: "Third Party" },
  { id: "7-infringement-reports-and-dispute-resolution", label: "Reports" },
];

export default function IntellectualPropertyPolicy() {
  return (
    <LegalPolicyPage
      badge="Brand Stewardship"
      title="Intellectual Property"
      summary="The public policy for brand use, logo permissions, open-source defaults, contributor work, third-party rights, and infringement reports."
      updated="Last updated: 6 June 2026"
      icon={Scale}
      sections={sections}
      markdown={ipMarkdown}
      highlights={["bits&bytes™ is the canonical name", "Brand permission is revocable", "Minor contributor terms require extra care"]}
    />
  );
}
