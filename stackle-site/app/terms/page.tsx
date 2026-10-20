import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Terms of Service", description: "The terms that apply when you use Stackle.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="January 2025">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Stackle, you accept and agree to be bound by the terms and provisions of this agreement.</p>
      <h2>2. Use of Service</h2>
      <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.</p>
      <h2>3. Intellectual Property</h2>
      <p>All content, features, and functionality of our platform are owned by Stackle and are protected by international copyright, trademark, and other intellectual property laws.</p>
      <h2>4. Course Enrollment</h2>
      <p>Upon enrollment, you are granted a limited, non-exclusive license to access course materials for personal, non-commercial use.</p>
      <h2>5. Limitation of Liability</h2>
      <p>Stackle shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
      <h2>6. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at <a href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a>.
      </p>
    </LegalPage>
  );
}
