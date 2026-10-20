import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Stackle collects and uses your information.", alternates: { canonical: "/privacy-policy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="January 2025">
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
      <h2>3. Information Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      <h2>4. Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
      </p>
    </LegalPage>
  );
}
