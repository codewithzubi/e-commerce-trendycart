import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrendyCart",
  description: "Learn how TrendyCart collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 14, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            TrendyCart (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our e-commerce platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Please read this policy carefully. By using our services, you consent to the practices described herein. If you do not agree, please discontinue use of the Platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.1 Information You Provide</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Account information:</strong> Name, email address, password, and phone number when you register</li>
            <li><strong>Payment information:</strong> Billing address, payment card details (processed by secure third-party payment processors)</li>
            <li><strong>Shipping information:</strong> Delivery address, contact name, and phone number</li>
            <li><strong>Communications:</strong> Messages you send to customer support, reviews, and survey responses</li>
            <li><strong>Preferences:</strong> Marketing preferences, wishlists, and saved items</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Device information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Usage data:</strong> Pages viewed, time spent on pages, click patterns, search queries</li>
            <li><strong>Cookies and tracking:</strong> Information collected through cookies, web beacons, and similar technologies</li>
            <li><strong>Location data:</strong> General geographic location based on IP address</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Process and fulfill your orders, including payment processing and shipping</li>
            <li>Create and manage your account</li>
            <li>Communicate with you about orders, products, promotions, and service updates</li>
            <li>Personalize your shopping experience and recommend products</li>
            <li>Improve our platform, products, and services</li>
            <li>Detect, prevent, and address fraud, security breaches, or technical issues</li>
            <li>Comply with legal obligations and enforce our terms</li>
            <li>Conduct analytics and research to better understand our users</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Service providers:</strong> Payment processors, shipping carriers, cloud hosting, analytics providers, and email services that help us operate the Platform</li>
            <li><strong>Legal requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred</li>
            <li><strong>Protection of rights:</strong> To protect the rights, property, or safety of TrendyCart, our users, or the public</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Remember your preferences and keep you logged in</li>
            <li>Maintain your shopping cart contents across sessions</li>
            <li>Analyze how you use the Platform to improve our services</li>
            <li>Deliver relevant advertisements</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You can manage cookie preferences through your browser settings. Disabling cookies may affect the functionality of certain features.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption (SSL/TLS), secure servers, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When information is no longer needed, it is securely deleted or anonymized.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data in certain circumstances</li>
            <li><strong>Portability:</strong> Request transfer of your data in a machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Withdraw consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            To exercise these rights, please contact us through the support channels available on the Platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party services you visit.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will take steps to delete such information promptly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on the Platform with a new effective date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us through the support channels available on the Platform.
          </p>
        </section>
      </div>
    </div>
  );
}
