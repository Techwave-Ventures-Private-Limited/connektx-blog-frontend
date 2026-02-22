import React from 'react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how ConnektX collects, uses, and protects your information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 antialiased">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Effective Date: January 17, 2026</p>
        </header>

        <p className="mb-8 leading-relaxed text-lg">
          This Privacy Policy explains how ConnektX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects your information when you use our professional social media platform (the &quot;Service&quot;). By using the Service, you consent to the practices described in this policy.
        </p>

        {/* 1. Information We Collect */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">1. Information We Collect</h2>
          <p className="mb-4 leading-relaxed font-semibold text-blue-800 italic">
            Policy on Email Acquisition: We do not use third-party or purchased mailing lists. We only collect email addresses directly from users who register via our platform.
          </p>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">Information You Provide to Us</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>
              <strong className="font-medium">Account and Profile Information:</strong> When you create an account, you provide us with your name, email address, password, and professional details.
            </li>
            <li>
              <strong className="font-medium">Consent and Authentication:</strong> We use an OTP (One-Time Password) system to verify email ownership before adding any user to our active database.
            </li>
            <li>
              <strong className="font-medium">Payment Information:</strong> If you purchase premium features, we collect payment details through secure, third-party processors.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Information Collected Automatically</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="font-medium">Usage and Log Data:</strong> Includes IP address, browser type, and interaction timestamps.
            </li>
            <li>
              <strong className="font-medium">Cookies:</strong> To personalize your experience and secure your session.
            </li>
          </ul>
        </section>

        {/* 2. How We Use */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">2. How We Use Your Information</h2>
          <p className="mb-4 leading-relaxed">We use the collected information for various purposes, including:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Service Maintenance:</strong> To operate our platform and provide customer support.</li>
            <li><strong className="font-medium">Essential Communications:</strong> To send critical transactional messages, including OTP verification codes, password resets, and subscription receipts.</li>
            <li><strong className="font-medium">Notification Preferences:</strong> To send updates or community activity alerts based on your explicit settings.</li>
            <li><strong className="font-medium">Safety and Security:</strong> To detect and prevent fraud, spam, and other harmful activities.</li>
          </ul>
        </section>

        {/* 4. Rights */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">4. Your Choices and Rights</h2>
          <p className="mb-4 leading-relaxed">As a user, you have rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="font-medium">Access and Correction:</strong> Update your profile directly in settings.</li>
            <li><strong className="font-medium">Deletion:</strong> Request account and data deletion at any time.</li>
            <li>
              <strong className="font-medium">Opt-Out & Unsubscribe:</strong> Every non-essential email includes an &quot;Unsubscribe&quot; link. You can also contact us at <span className="text-blue-600 font-semibold">contact@connektx.com</span>.
            </li>
          </ul>
        </section>

        {/* 5. Data Security */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">5. Data Security</h2>
          <p className="leading-relaxed">
            We implement reasonable technical measures to protect your information. Note that while we strive for maximum security, no method of internet transmission is 100% secure.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">6. Data Retention</h2>
          <p className="leading-relaxed">
            We retain your personal data for as long as your account is active or as needed to provide the Service. We also retain and use your information as necessary to comply with legal obligations and resolve disputes.
          </p>
        </section>

        {/* 7. International Transfers */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">7. International Data Transfers</h2>
          <p className="leading-relaxed">
            The Service is provided globally. Your information may be processed and stored on servers located outside of India. By using the Service, you consent to these transfers.
          </p>
        </section>

        {/* 8. Changes */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">8. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Effective Date&quot; at the top.
          </p>
        </section>

        {/* 9. Contact Us */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">9. Contact Us</h2>
          <p className="mb-4 leading-relaxed">If you have questions about this policy or wish to report a security/spam issue, please contact us at:</p>
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