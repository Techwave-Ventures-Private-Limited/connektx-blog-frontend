// connektx-web/app/company/refund-policy/page.js

import React from 'react';

export const metadata = {
  title: 'Refund and Cancellation Policy',
  description: 'Refund and cancellation policy for ConnektX subscriptions.',
};

export default function RefundPolicy() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 antialiased">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Refund and Cancellation Policy</h1>
          <p className="text-sm text-gray-500">Effective Date: January 17, 2026</p>
        </header>

        <p className="mb-8 leading-relaxed text-lg">
          This Refund and Cancellation Policy explains how ConnektX handles subscription cancellations, refunds, and related payment matters. By subscribing to our premium services, you agree to the terms outlined below.
        </p>

        {/* 1. Subscription Cancellation */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">1. Subscription Cancellation</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">How to Cancel</h3>
          <p className="mb-4 leading-relaxed">
            You can cancel your subscription at any time through your account settings or by contacting our support team at <a href="mailto:contact@connektx.com" className="text-blue-600 hover:underline font-semibold">contact@connektx.com</a>.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Effect of Cancellation</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Immediate Loss of Access:</strong> Upon cancellation, you will immediately lose access to premium features and benefits.</li>
            <li><strong className="font-medium">No Partial Refunds:</strong> Cancelling your subscription does not entitle you to a refund for the remaining period of your current billing cycle.</li>
            <li><strong className="font-medium">End of Billing Cycle:</strong> You will not be charged for subsequent billing cycles after cancellation.</li>
          </ul>
        </section>

        {/* 2. Trial Period Cancellation */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">2. Trial Period Cancellation</h2>
          <p className="mb-4 leading-relaxed">
            Some subscription plans include a trial period at a reduced rate (e.g., ₹1 for 7 days).
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">During Trial:</strong> If you cancel during the trial period, you will lose access immediately but will not be charged for the full subscription price.</li>
            <li><strong className="font-medium">After Trial:</strong> If you do not cancel before the trial period ends, you will be automatically charged the full subscription amount for the next billing cycle.</li>
            <li><strong className="font-medium">Trial Fee Non-Refundable:</strong> The trial period fee (e.g., ₹1) is non-refundable.</li>
          </ul>
        </section>

        {/* 3. Refund Policy */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">3. Refund Policy</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">General Policy</h3>
          <p className="mb-4 leading-relaxed">
            All subscription fees are <strong>non-refundable</strong> except in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
            <li><strong className="font-medium">Duplicate Charges:</strong> If you are accidentally charged twice for the same subscription period, we will refund the duplicate charge.</li>
            <li><strong className="font-medium">Technical Issues:</strong> If a technical error on our platform prevents you from accessing premium features for an extended period, you may be eligible for a prorated refund.</li>
            <li><strong className="font-medium">Unauthorized Charges:</strong> If you believe your account was charged without authorization, contact us immediately for investigation.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Refund Requests</h3>
          <p className="leading-relaxed">
            To request a refund, contact us at <a href="mailto:contact@connektx.com" className="text-blue-600 hover:underline font-semibold">contact@connektx.com</a> with your transaction details. Refund requests must be submitted within 7 days of the charge. We will review your request and respond within 5-7 business days.
          </p>
        </section>

        {/* 4. Auto-Renewal */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">4. Auto-Renewal</h2>
          <p className="mb-4 leading-relaxed">
            Subscriptions automatically renew at the end of each billing cycle unless you cancel before the renewal date.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Renewal Notification:</strong> We will send you an email reminder before your subscription renews.</li>
            <li><strong className="font-medium">Prevent Renewal:</strong> To prevent auto-renewal, cancel your subscription at least 24 hours before the renewal date.</li>
            <li><strong className="font-medium">No Refunds for Auto-Renewal:</strong> If your subscription auto-renews and you did not cancel in time, no refund will be provided.</li>
          </ul>
        </section>

        {/* 5. Payment Failures */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">5. Payment Failures</h2>
          <p className="leading-relaxed">
            If a payment fails due to insufficient funds, expired payment methods, or other issues, your subscription may be suspended or cancelled. You are responsible for updating your payment information to avoid service interruption.
          </p>
        </section>

        {/* 6. Price Changes */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">6. Price Changes</h2>
          <p className="leading-relaxed">
            We reserve the right to change subscription pricing at any time. If we increase the price of your subscription plan, we will notify you at least 30 days in advance. The new price will apply starting from your next billing cycle. You may cancel your subscription before the price increase takes effect if you do not wish to pay the new rate.
          </p>
        </section>

        {/* 7. Exceptions */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">7. Exceptions and Discretion</h2>
          <p className="leading-relaxed">
            ConnektX reserves the right to make exceptions to this policy on a case-by-case basis at our sole discretion. Contact us if you believe your situation warrants special consideration.
          </p>
        </section>

        {/* 8. Chargebacks */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">8. Chargebacks and Disputes</h2>
          <p className="leading-relaxed">
            If you initiate a chargeback or payment dispute through your bank or payment provider without first contacting us, your account may be immediately suspended or terminated. We encourage you to reach out to us directly to resolve any billing concerns before filing a dispute.
          </p>
        </section>

        {/* 9. Contact Us */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">9. Contact Us</h2>
          <p className="mb-4 leading-relaxed">If you have questions about cancellations, refunds, or billing, please contact us at:</p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <address className="not-italic leading-relaxed">
              <strong className="font-bold text-gray-900 text-lg">ConnektX</strong> <br />
              Managed by: Techwave Ventures Private Limited <br />
              Pune, Maharashtra, India <br />
              Email: <a href="mailto:contact@connektx.com" className="text-blue-600 hover:underline font-semibold">contact@connektx.com</a>
            </address>
          </div>
        </section>

      </div>
    </div>
  );
}
