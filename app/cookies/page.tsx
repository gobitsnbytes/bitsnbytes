"use client";

import { Cookie } from "lucide-react";
import { LegalPolicyPage } from "@/components/legal-policy-page";

const cookieMarkdown = `<aside>
This Cookie Policy explains how GOBITSNBYTES FOUNDATION uses cookies, browser local storage, and related web technologies on the bits&bytes™ platform (gobitsnbytes.org) in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and international data protection standards.
</aside>

---

## 1. What Are Cookies and Local Storage?

Cookies are small text files placed on your device by websites you visit. Similar technologies include HTML5 Local Storage, Session Storage, and web beacons. These technologies help websites remember preferences, ensure security, and understand how the site performs.

bits&bytes™ prioritizes privacy, particularly because our builder network serves teenagers. We do not use third-party advertising cookies, behavioral tracking pixels (such as Meta Pixel or Google Ads), or data-broker trackers.

## 2. Categories of Storage We Use

We categorize the browser storage mechanisms used across gobitsnbytes.org into two primary tiers:

### 2.1 Strictly Necessary and Functional Storage
These items are essential for core site functionality, security, accessibility, and user preference persistence. They do not require prior consent because the website cannot function properly without them:
- **\`theme\` (Local Storage):** Remembers your preferred appearance mode (Dark or Light theme).
- **\`bnb_motion_preference\` (Local Storage):** Remembers whether you have enabled or paused immersive motion and animations for accessibility.
- **\`bnb_cookie_consent\` (Local Storage):** Stores your cookie consent selection so you are not repeatedly prompted on subsequent visits.
- **\`bnb_chat_history\` (Local Storage):** Stores your interactive AI assistant conversation locally within your browser so you can resume questions. This data remains on your device and is not synchronized to external profiles.
- **Security & Bot Prevention:** Security tokens via hCaptcha to prevent automated spam and malicious abuse on our contact and application forms.

### 2.2 Performance and Reliability Telemetry
We use privacy-friendly performance telemetry to monitor site speed, core web vitals, and system uptime:
- **Vercel Web Analytics & Speed Insights:** Measures aggregate performance metrics (such as page loading time, TTFB, and layout stability). These metrics do not track individual identity across the web, do not create personal consumer profiles, and do not sell information to third-party data brokers.

## 3. Strict Minor Safeguards (DPDP Act, 2023)

In strict adherence to Section 9(2) of India's Digital Personal Data Protection Act, 2023:
- **No Behavioral Monitoring:** We strictly prohibit behavioral tracking, biometric tracking, or profiling of children (minors under 18 years).
- **No Targeted Advertising:** We do not serve targeted advertisements, commercial marketing campaigns, or retargeting pixels anywhere on our website or digital properties.
- **Child-Safe Defaults:** Any telemetry gathered is strictly aggregated and focused on technical performance and platform security.

## 4. Third-Party Embeds and External Services

When you interact with certain interactive features, third-party services may load:
- **hCaptcha (Intuition Machines, Inc.):** Deployed on forms to verify that submissions are made by human users and protect against denial-of-service or bot submissions. hCaptcha processes hardware and browser technical markers in accordance with its strict privacy policy.
- **Discord Widget & Links:** Certain pages provide embedded community previews or invite links to the official bits&bytes™ Discord server. Interacting with Discord directly is governed by Discord's Terms of Service and Privacy Policy.
- **Luma (lu.ma):** Used for verified event registrations and calendar RSVPs.

All external domains permitted on our site are strictly locked down through modern Content Security Policy (CSP) headers.

## 5. How You Can Control Cookies and Storage

You have full control over cookies and browser storage:

- **Interactive Consent Banner:** You can accept all or select essential-only storage using our on-site Cookie Consent Banner.
- **Browser Controls:** You can block, restrict, or delete cookies and site data through your browser settings:
  - **Google Chrome:** Settings → Privacy and Security → Third-party cookies.
  - **Mozilla Firefox:** Settings → Privacy & Security → Cookies and Site Data.
  - **Apple Safari:** Settings → Safari → Advanced → Block All Cookies.
  - **Microsoft Edge:** Settings → Cookies and site permissions → Manage and delete cookies and site data.
- **Clearing Local Storage:** You can clear local storage at any time by clearing your browser's site data for \`gobitsnbytes.org\` or inspecting Developer Tools → Application → Local Storage.

Please note that disabling strictly necessary storage may affect your experience, such as resetting your theme or motion preferences on every page refresh.

## 6. Data Fiduciary and Contact Details

This Cookie Policy is maintained by **GOBITSNBYTES FOUNDATION**, a Section 8 non-profit company (CIN: U85500UP2026NPL248652) registered in Uttar Pradesh, India.

For inquiries regarding this Cookie Policy or our data privacy practices, please contact:
- **Email:** hello@gobitsnbytes.org
- **Grievance Officer:** grievance@gobitsnbytes.org
- **Registered Office:** 265/1 Patrakar Colony, Ashok Nagar, Prayagraj - 211001, Uttar Pradesh, India
- **Operational / Creator Base:** Lucknow, Uttar Pradesh, India

---

Adopted for public use on 6 June 2026. Contact: hello@gobitsnbytes.org.`;

const sections = [
  { id: "1-what-are-cookies-and-local-storage", label: "Overview" },
  { id: "2-categories-of-storage-we-use", label: "Categories" },
  { id: "3-strict-minor-safeguards-dpdp-act-2023", label: "Minor Safety" },
  { id: "4-third-party-embeds-and-external-services", label: "Third-Party" },
  { id: "5-how-you-can-control-cookies-and-storage", label: "Your Controls" },
  { id: "6-data-fiduciary-and-contact-details", label: "Contact" },
];

export default function CookiePolicy() {
  return (
    <LegalPolicyPage
      badge="Data Transparency"
      title="Cookie Policy"
      summary="How bits&bytes™ utilizes essential cookies, local storage, and privacy-first telemetry with strict protections for minors under DPDP Act 2023."
      updated="Last updated: 13 September 2026"
      icon={Cookie}
      sections={sections}
      markdown={cookieMarkdown}
      highlights={[
        "No third-party ad tracking or marketing pixels",
        "Strict prohibition of minor behavioral monitoring",
        "Full user control via banner & browser settings",
      ]}
    />
  );
}
