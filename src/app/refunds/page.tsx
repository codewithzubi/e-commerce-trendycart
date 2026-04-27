import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy | TrendyCart",
  description: "Learn about TrendyCart's refund and return policy, including eligibility, timeframes, and procedures.",
};

export default function RefundsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Refund & Return Policy</h1>
        <p className="text-muted-foreground">Last updated: April 14, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            At TrendyCart, we want you to be completely satisfied with your purchase. If you are not entirely happy with your order, this policy outlines the conditions and process for returns, exchanges, and refunds. Please review it carefully to understand your rights and obligations.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Return Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Items may be returned if they meet the following criteria:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>The return request is initiated within <strong>30 days</strong> of receiving the product</li>
            <li>The item is unused, in its original condition, and in its original packaging</li>
            <li>All tags, labels, and accessories are still attached</li>
            <li>You have the original order confirmation or proof of purchase</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Non-Returnable Items</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Personalized or custom-made products</li>
            <li>Items marked as &quot;Final Sale&quot; or &quot;Non-Returnable&quot;</li>
            <li>Gift cards and digital products</li>
            <li>Items that have been used, worn, washed, or altered</li>
            <li>Products returned without original packaging</li>
            <li>Items damaged through normal wear and tear or misuse</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. How to Initiate a Return</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To start a return, please follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
            <li><strong>Contact our support team</strong> through the Platform with your order number and reason for return</li>
            <li><strong>Receive a Return Authorization (RA) number</strong> and return shipping instructions</li>
            <li><strong>Pack the item securely</strong> in its original packaging with all included accessories</li>
            <li><strong>Include the RA number</strong> inside the package clearly visible</li>
            <li><strong>Ship the package</strong> using the provided return shipping label or your preferred carrier</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We recommend using a trackable shipping service and retaining your tracking number. We are not responsible for returns lost in transit without tracking.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Refund Processing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Once we receive and inspect your return:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>We will notify you via email of the approval or rejection of your return</li>
            <li>Approved refunds will be processed to the <strong>original payment method</strong> within <strong>5-10 business days</strong></li>
            <li>The timeframe for the refund to appear in your account depends on your bank or payment provider</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Partial Refunds</h3>
          <p className="text-muted-foreground leading-relaxed">
            Partial refunds may apply in the following situations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Items returned with visible signs of use or damage</li>
            <li>Items not in their original packaging (where packaging is essential)</li>
            <li>Missing accessories, manuals, or components</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Exchanges</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you would like a different size, color, or variant of the same product, please contact our support team. Exchanges are subject to product availability. If the replacement item is of a different price, the difference will be refunded or charged accordingly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Damaged or Defective Items</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you receive a damaged, defective, or incorrect item:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Contact us within <strong>7 days</strong> of delivery</li>
            <li>Provide photos or a description of the issue</li>
            <li>We will arrange a replacement or full refund at no additional cost to you</li>
            <li>In most cases, we will provide a prepaid return shipping label</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Shipping Costs</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Original shipping costs</strong> are non-refundable unless the return is due to our error (damaged, defective, or incorrect item)</li>
            <li><strong>Return shipping costs</strong> are the responsibility of the customer unless the return is due to our error</li>
            <li>For orders qualifying for free shipping originally, the cost of standard shipping may be deducted from the refund</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Late or Missing Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have not received your refund after the processing time:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
            <li>Check your bank account again</li>
            <li>Contact your credit card company or bank, as processing times may vary</li>
            <li>If you still have not received your refund, contact us at support through the Platform</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Cancellations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Orders may be cancelled within <strong>2 hours</strong> of placement, provided they have not yet been processed or shipped. After this window, cancellations are treated as returns under the standard policy. To cancel an order, contact our support team immediately.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Sale Items</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sale items are eligible for return and refund under the same terms as regular-priced items, unless explicitly marked as &quot;Final Sale&quot; at the time of purchase. Final Sale items cannot be returned or exchanged.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about our Refund & Return Policy, please reach out to us through the support channels available on the Platform. Our team is here to help resolve any concerns.
          </p>
        </section>
      </div>
    </div>
  );
}
