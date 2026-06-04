"use client";

import { Shield } from "lucide-react";

import { LegalPolicyPage } from "@/components/legal-policy-page";

const cocMarkdown = `<aside>
This Code of Conduct applies to everyone in bits&bytes™ spaces: participants, volunteers, Fork Leads, organizers, mentors, sponsors, guests, contributors, and executive team members.
</aside>

---

## TL;DR

Build things. Be decent. Keep people safe.

## 1. Why This Exists

bits&bytes™ is a youth-led builder network for students, developers, designers, and creators who want to ship real things. A serious builder community needs serious standards, especially because many participants are minors.

This Code is a condition of participation in any official bits&bytes™ event, platform, project, Fork, cohort, repository, or community space.

## 2. Scope

This Code applies online and offline, including events, hackathons, workshops, cohorts, meetups, Discord, WhatsApp, Slack, GitHub, social media, partner spaces, and any public representation of bits&bytes™.

It applies regardless of age, role, seniority, founding involvement, public profile, or prior contribution.

## 3. Expected Behavior

Everyone is expected to:

- Welcome new people and make participation easier, not harder.
- Be patient with different learning speeds, communication styles, and backgrounds.
- Critique ideas without attacking people.
- Take responsibility when something goes wrong.
- Protect the community by reporting safety, conduct, privacy, or financial concerns.

## 4. Prohibited Behavior

The following are not allowed:

- Harassment, bullying, intimidation, stalking, grooming, coercion, or hostile behavior.
- Discrimination or exclusion based on age, gender, gender identity, sexual orientation, disability, appearance, race, ethnicity, caste, religion, nationality, socioeconomic background, or any protected characteristic.
- Sexual misconduct, unwanted romantic or sexual attention, or inappropriate conduct involving minors.
- Doxxing, privacy violations, sharing private messages without consent, or exposing personal data.
- Fraud, unauthorized fundraising, personal collection of money, or misuse of community funds.
- Spam, sustained disruption, trolling, threats, or retaliation against someone who reports a concern.

## 5. Reporting

If you experience or witness a violation, report it. Email hello@gobitsnbytes.org or contact a trusted team member.

Include what happened, where it happened, when it happened, who was involved, and any screenshots or records that help the team understand the situation. If you are unsure whether something counts, report it anyway and let us assess.

## 6. Confidentiality and No Retaliation

Reports are handled with care and confidentiality. Information is shared only with people who need access for safety, inquiry, compliance, support, escalation, or remedial action.

Retaliation against someone who reports, supports a reporter, refuses unsafe conduct, or escalates a concern is itself a serious violation.

## 7. Enforcement

The Foundation may issue warnings, restrict access, remove roles, suspend participation, revoke Fork recognition, or permanently remove a person from official spaces.

<aside>
Warning: Serious violations may lead to immediate action without prior warning. This includes sexual misconduct, conduct involving a minor, credible threats, doxxing, financial fraud, retaliation, or anything that places participant safety at imminent risk.
</aside>

Where conduct may violate applicable law, including child protection, information technology, privacy, or criminal law, the Foundation may refer the matter to appropriate authorities.

## 8. Special Protections for Minors

Because bits&bytes™ is youth-led, safeguarding is a core governance priority. Teams must use appropriate consent, supervision, communication boundaries, moderation, and escalation procedures when minors are involved.

Photography, recording, public showcases, travel, residential activity, direct adult-to-minor communication, and platform access require heightened care. No local group may dilute these requirements for convenience.

## 9. Data and Privacy

Participant data, safety records, consent information, and incident records must be handled according to the Privacy Policy and safeguarding standards. Do not expose personal data in public channels, creative assets, screenshots, slides, repos, or demos.

---

Adopted for public use on 4 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "tldr", label: "TL;DR" },
  { id: "1-why-this-exists", label: "Why" },
  { id: "2-scope", label: "Scope" },
  { id: "3-expected-behavior", label: "Expected" },
  { id: "4-prohibited-behavior", label: "Not Allowed" },
  { id: "5-reporting", label: "Reporting" },
  { id: "6-confidentiality-and-no-retaliation", label: "Confidentiality" },
  { id: "7-enforcement", label: "Enforcement" },
  { id: "8-special-protections-for-minors", label: "Minors" },
  { id: "9-data-and-privacy", label: "Privacy" },
];

export default function CodeOfConduct() {
  return (
    <LegalPolicyPage
      badge="Community Standard"
      title="Code of Conduct"
      summary="The standard for safe, high-agency participation across bits&bytes™ events, projects, Forks, and digital community spaces."
      updated="Last updated: 4 June 2026"
      icon={Shield}
      sections={sections}
      markdown={cocMarkdown}
      highlights={["Applies to every role", "No retaliation", "Minor safety gets heightened protections"]}
    />
  );
}
