import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TrendyCart",
  description: "Read the terms and conditions for using TrendyCart services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: April 14, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            By accessing and using TrendyCart (&quot;the Platform&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the Platform following any changes constitutes your acceptance of such changes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            To use our services, you must be at least 18 years of age or have reached the age of majority in your jurisdiction. By using the Platform, you represent and warrant that you meet this requirement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To make purchases or access certain features, you may be required to create an account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your information to keep it accurate and complete</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Products and Pricing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All product descriptions, pricing, and availability are subject to change without notice. We make every effort to ensure that product images and descriptions are accurate, but we do not warrant that they are error-free.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Prices displayed are in the currency shown and do not include applicable taxes, shipping fees, or customs duties unless otherwise stated. We reserve the right to refuse or cancel any order if a product is mispriced or described incorrectly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Orders and Payment</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you place an order, you are making an offer to purchase the products subject to these terms. We reserve the right to accept or decline any order at our discretion.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Payment must be made at the time of order using the available payment methods. We use third-party payment processors and do not store your full payment card details.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Order confirmation emails serve as acknowledgment of your order, not as acceptance. A binding contract is formed only when we dispatch the products to you.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Shipping and Delivery</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Delivery times are estimates and not guaranteed. We are not liable for delays caused by carriers, customs processing, or circumstances beyond our reasonable control.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Risk of loss and title for products pass to you upon delivery to the shipping carrier. You are responsible for inspecting products upon receipt and reporting any issues within the timeframe specified in our Refund Policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Returns and Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            Returns and refunds are governed by our Refund Policy. By making a purchase, you agree to the terms outlined therein. Please review our Refund Policy page for detailed information about eligibility, timeframes, and procedures.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All content on this Platform, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of TrendyCart or its licensors and is protected by intellectual property laws.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You may not reproduce, distribute, modify, create derivative works from, publicly display, or repurpose any content from this Platform without our express written consent.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Prohibited Conduct</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Use the Platform for any unlawful purpose or in violation of any laws</li>
            <li>Attempt to gain unauthorized access to our systems or user accounts</li>
            <li>Interfere with or disrupt the Platform or its infrastructure</li>
            <li>Use automated tools to scrape, crawl, or data-mine the Platform</li>
            <li>Submit false or misleading information</li>
            <li>Impersonate another person or entity</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To the maximum extent permitted by law, TrendyCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Loss of data or unauthorized access to your data</li>
            <li>Errors, mistakes, or inaccuracies in content</li>
            <li>Personal injury or property damage resulting from use of the Platform</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Our total liability to you for any claim shall not exceed the amount you have paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to indemnify, defend, and hold harmless TrendyCart and its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of your use of the Platform, your violation of these terms, or your violation of any rights of a third party.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms shall be governed by and construed in accordance with the applicable laws. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms of Service, please contact us through the support channels available on the Platform.
          </p>
        </section>
      </div>
    </div>
  );
}
