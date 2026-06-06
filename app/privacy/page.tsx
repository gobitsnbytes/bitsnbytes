"use client";

import { Lock } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const privacyMarkdown = `<aside>
This Privacy Policy explains how GOBITSNBYTES FOUNDATION, acting as a Data Fiduciary, handles personal data for website visitors, participants, volunteers, contributors, and community members in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.
</aside>

---

## 1. Data Fiduciary and Responsibility

GOBITSNBYTES FOUNDATION is the Data Fiduciary responsible for personal data processed through official bits&bytes™ websites, event registrations, cohort applications, community platforms, and program operations.

For privacy questions, data access requests, parent/guardian consent inquiries, or grievances, please contact hello@gobitsnbytes.org.

## 2. Data We Collect

We collect only the personal data that is reasonably necessary to run educational, community, safety, and operational work.

In accordance with Article 48 of our e-AOA, data collected may include:
- **Identity and Contact Details:** Name, email address, phone number, age, school, city, and role.
- **Guardian Details:** Parent or guardian contact information where minor participation requires verifiable consent.
- **Event and Program Records:** Registration forms, team memberships, dietary or accessibility needs, project submissions, certificate issuances, and attendance records.
- **Media Assets:** Photographs, video recordings, and audio clips taken during official events (subject to consent).
- **Communication Logs:** Email correspondences, support tickets, and communication records with our team.
- **Technical Data:** Device specifications, browser type, IP address, referral source, page performance logs, and security/abuse-prevention logs.

## 3. Minors and Verifiable Guardian Consent

Because bits&bytes™ is a youth-focused network, safeguarding minor data is a core priority governed by the DPDP Act, 2023 and the Protection of Children from Sexual Offences Act, 2012 (POCSO).
- **Guardian Consent:** We require verified parent or guardian consent before collecting or processing a minor's personal data for hackathons, cohorts, travel, photography, recordings, or public showcases.
- **Restrictions:** We do not engage in targeted advertising, behavioral profiling, or the commercial sale of minor data. Minor data is processed solely for participation coordination, safety, and compliance.
- **Safeguarding Records:** All safeguarding incident reports, consent sheets, and minor safety files are treated with strict confidentiality and stored securely with restricted access.

## 4. How We Use Data

We process personal data to:
- Run and coordinate hackathons, workshops, cohorts, mentoring, and local Fork activities.
- Coordinate teams, logistics, event venues, certificates, and program communication.
- Moderate official digital channels and enforce our Code of Conduct.
- Protect participant safety and execute safeguarding protocols.
- Monitor and improve website reliability, security, accessibility, and performance.
- Comply with statutory audits, legal requirements, and lawful requests under Indian law.

## 5. Data Sharing and Service Providers

We do not sell personal data. We may share limited personal data with:
- **Service Providers:** Trusted partners who help operate our website, databases, registration forms, analytics tools, communication platforms, and event logistics.
- **Event Partners:** Sponsors, host institutions, or co-organizers where explicit consent has been provided by the participant or guardian.
- **Legal Authorities:** Regulatory, law enforcement, or statutory bodies where required by law, to protect safety, or to investigate fraud or code of conduct violations.

## 6. Your Rights and Consent Withdrawal

Under the DPDP Act, 2023, you have the right to access, correct, complete, or request the deletion of your personal data.
- **Withdrawal of Consent:** You may withdraw your consent for data processing at any time. Upon receiving a withdrawal request at hello@gobitsnbytes.org, we will stop processing your data unless retention is legally required.
- **Verification:** If a request concerns a minor, we will verify the parent or guardian relationship before disclosing or deleting any information.
- **Retention Limitations:** Certain operational, financial, and safeguarding logs may be retained for security, audit, or statutory compliance purposes.

## 7. Security and Data Breach Notification

We implement reasonable security practices and procedures, including industry-standard encryption and access controls, to protect your personal data from unauthorized access, loss, or alteration.
- **Restricted Access:** Access to databases and sensitive safeguarding reports is strictly limited to authorized personnel.
- **Data Breach Protocol:** In the unlikely event of a personal data breach, GOBITSNBYTES FOUNDATION will take immediate remedial action and notify affected individuals and the Data Protection Board of India in accordance with the DPDP Act, 2023.

---

Adopted for public use on 6 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-data-fiduciary-and-responsibility", label: "Responsibility" },
  { id: "2-data-we-collect", label: "Data" },
  { id: "3-minors-and-verifiable-guardian-consent", label: "Minors" },
  { id: "4-how-we-use-data", label: "Use" },
  { id: "5-data-sharing-and-service-providers", label: "Sharing" },
  { id: "6-your-rights-and-consent-withdrawal", label: "Rights" },
  { id: "7-security-and-data-breach-notification", label: "Security" },
];

export default function PrivacyPolicy() {
  return (
    <LegalPolicyPage
      badge="Data Protection"
      title="Privacy Policy"
      summary="How bits&bytes™ collects, uses, protects, and responds to participant data, with specific care for minors and community safety."
      updated="Last updated: 6 June 2026"
      icon={Lock}
      sections={sections}
      markdown={privacyMarkdown}
      highlights={["No sale of personal data", "Guardian consent for minors where required", "Data breach notification procedures"]}
    />
  );
}
