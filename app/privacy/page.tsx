"use client";

import { Lock } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const privacyMarkdown = `<aside>
This Privacy Policy explains how GOBITSNBYTES FOUNDATION handles data for website visitors, participants, volunteers, contributors, and community members.
</aside>

---

## 1. Who Is Responsible

GOBITSNBYTES FOUNDATION is responsible for personal data processed through official bits&bytes™ websites, event registrations, cohort applications, community platforms, and program operations.

For privacy questions, data requests, parent or guardian requests, or grievances, contact hello@gobitsnbytes.org.

## 2. Data We Collect

We collect only what is reasonably needed to run educational, community, safety, and operational work.

Data may include:

- Identity and contact details such as name, email, phone number, age range, school, city, and role.
- Parent or guardian contact details where minor participation requires consent.
- Event and program details such as registration forms, team membership, dietary needs, accessibility needs, project submissions, certificates, and attendance records.
- Technical details such as device, browser, IP address, referral source, page performance, and abuse-prevention logs.
- Community activity connected to official platforms, repositories, moderation, support, or safety reports.

## 3. Minors and Guardian Consent

Many bits&bytes™ participants are under 18. Where law or program design requires it, we ask for parent or guardian consent before processing a minor's personal data for events, cohorts, travel, photography, recordings, or public showcases.

We do not use minors' data for targeted advertising, behavioral profiling, or commercial sale. Minor data is processed for participation, safety, communication, learning, community support, and legal compliance.

## 4. How We Use Data

We use data to:

- Run hackathons, workshops, cohorts, mentoring, and local Fork activity.
- Coordinate teams, venues, schedules, certificates, and program communication.
- Moderate official digital communities and enforce the Code of Conduct.
- Keep minors and participants safe through consent, reporting, access controls, and escalation.
- Improve website reliability, security, accessibility, and performance.
- Comply with applicable Indian law and lawful requests.

## 5. Sharing and Service Providers

We do not sell personal data. We may share limited data with trusted service providers that help operate the website, databases, forms, analytics, communication channels, repositories, and event logistics.

We may also share information where required by law, to protect participant safety, to investigate serious misconduct, or to respond to legal process.

## 6. Your Rights

You may request access, correction, deletion, withdrawal of consent, or grievance redressal by emailing hello@gobitsnbytes.org. If the request concerns a minor, we may verify the parent or guardian relationship before acting.

Some data may need to be retained where required for safety, legal compliance, fraud prevention, dispute handling, or official records.

## 7. Retention and Security

We retain personal data only as long as needed for the purpose collected, unless a longer period is required for legal, safety, audit, or dispute reasons.

Access to production systems, records, and sensitive reports is limited to authorized people. Safeguarding and incident records are handled with confidentiality and shared only with people who need access for safety, inquiry, compliance, support, or escalation.

---

Adopted for public use on 4 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-who-is-responsible", label: "Responsibility" },
  { id: "2-data-we-collect", label: "Data" },
  { id: "3-minors-and-guardian-consent", label: "Minors" },
  { id: "4-how-we-use-data", label: "Use" },
  { id: "5-sharing-and-service-providers", label: "Sharing" },
  { id: "6-your-rights", label: "Rights" },
  { id: "7-retention-and-security", label: "Security" },
];

export default function PrivacyPolicy() {
  return (
    <LegalPolicyPage
      badge="Data Protection"
      title="Privacy Policy"
      summary="How bits&bytes™ collects, uses, protects, and responds to participant data, with specific care for minors and community safety."
      updated="Last updated: 4 June 2026"
      icon={Lock}
      sections={sections}
      markdown={privacyMarkdown}
      highlights={["No sale of personal data", "Guardian consent for minors where required", "Safety records handled with restricted access"]}
    />
  );
}
