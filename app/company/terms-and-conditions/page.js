// connektx-web/app/company/terms-and-conditions/page.js

import React from 'react';

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Terms of service for using ConnektX platform.',
};

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 antialiased">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500">Effective Date: January 17, 2026</p>
        </header>

        <p className="mb-8 leading-relaxed text-lg">
          Welcome to ConnektX. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of our professional social media platform (the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        {/* 1. Acceptance of Terms */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By creating an account or using ConnektX, you agree to these Terms, our Privacy Policy, and any additional guidelines we may publish. If you do not agree, please do not use the Service.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">2. Eligibility</h2>
          <p className="leading-relaxed">
            You must be at least 16 years old to use ConnektX. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
          </p>
        </section>

        {/* 3. Account Registration */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">3. Account Registration</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Accurate Information:</strong> You must provide accurate and complete information when creating your account.</li>
            <li><strong className="font-medium">Account Security:</strong> You are responsible for maintaining the confidentiality of your password and account credentials.</li>
            <li><strong className="font-medium">Email Verification:</strong> We use OTP verification to confirm email ownership before activating your account.</li>
            <li><strong className="font-medium">One Account Per User:</strong> You may not create multiple accounts for the same individual.</li>
          </ul>
        </section>

        {/* 4. User Conduct */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">4. User Conduct</h2>
          <p className="mb-4 leading-relaxed">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Post or share content that is illegal, defamatory, harassing, or violates third-party rights</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with any organization</li>
            <li>Engage in spamming, phishing, or any fraudulent activities</li>
            <li>Attempt to gain unauthorized access to the Service or other user accounts</li>
            <li>Use automated tools (bots, scrapers) without our explicit permission</li>
            <li>Distribute viruses, malware, or any harmful code</li>
          </ul>
        </section>

        {/* 5. Content Ownership */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">5. Content Ownership and License</h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">Your Content</h3>
          <p className="mb-4 leading-relaxed">
            You retain ownership of all content you post on ConnektX. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content on the Service.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Content</h3>
          <p className="leading-relaxed">
            All ConnektX branding, logos, features, and functionality are owned by Techwave Ventures Private Limited and are protected by intellectual property laws.
          </p>
        </section>

        {/* 6. Subscriptions and Payments */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">6. Subscriptions and Payments</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Premium Features:</strong> Certain features require a paid subscription.</li>
            <li><strong className="font-medium">Billing:</strong> Subscription fees are billed in advance on a recurring basis (monthly or annually).</li>
            <li><strong className="font-medium">Trial Periods:</strong> Some plans may include a trial period at a reduced rate. After the trial, you will be charged the full subscription amount.</li>
            <li><strong className="font-medium">Auto-Renewal:</strong> Subscriptions automatically renew unless you cancel before the renewal date.</li>
            <li><strong className="font-medium">Payment Processing:</strong> Payments are processed through secure third-party payment gateways (Razorpay).</li>
            <li><strong className="font-medium">Price Changes:</strong> We reserve the right to modify subscription prices with at least 30 days notice.</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            For cancellation and refund terms, please see our <a href="/company/refund-policy" className="text-blue-600 hover:underline font-semibold">Refund Policy</a>.
          </p>
        </section>

        {/* 7. Termination */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">7. Termination</h2>
          <p className="mb-4 leading-relaxed">
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in activities that harm the Service or other users. You may also delete your account at any time through account settings.
          </p>
          <p className="leading-relaxed">
            Upon termination, your right to access the Service will immediately cease, though certain provisions of these Terms will survive termination.
          </p>
        </section>

        {/* 8. Disclaimer of Warranties */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">8. Disclaimer of Warranties</h2>
          <p className="leading-relaxed">
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">9. Limitation of Liability</h2>
          <p className="leading-relaxed">
            To the maximum extent permitted by law, ConnektX and Techwave Ventures Private Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">10. Governing Law</h2>
          <p className="leading-relaxed">
            These Terms are governed by the laws of India. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
          </p>
        </section>

        {/* 11. Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">11. Changes to These Terms</h2>
          <p className="leading-relaxed">
            We may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on this page and updating the &quot;Effective Date&quot; at the top. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* 12. Contact Us */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">12. Contact Us</h2>
          <p className="mb-4 leading-relaxed">If you have questions about these Terms, please contact us at:</p>
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
