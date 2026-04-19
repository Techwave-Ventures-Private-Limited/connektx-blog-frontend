// connektx-web/app/company/contact/page.js

import React from 'react';
import { Mail, MapPin, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ConnektX team for support and inquiries.',
};

export default function Contact() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 antialiased">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-lg text-gray-600">We're here to help. Reach out to us anytime.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information Cards */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">For support, feedback, or inquiries</p>
                <a
                  href="mailto:contact@connektx.com"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  contact@connektx.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Company</h3>
                <p className="text-gray-800 font-medium">Techwave Ventures Private Limited</p>
                <p className="text-gray-600 text-sm mt-1">Operating ConnektX</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
                <address className="not-italic text-gray-700 leading-relaxed">
                  Pune, Maharashtra, India
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Support Topics */}
        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What can we help you with?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Account Support</h3>
              <p className="text-sm text-gray-600">Login issues, password resets, account verification</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Billing & Subscriptions</h3>
              <p className="text-sm text-gray-600">Payment issues, refunds, subscription management</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
              <p className="text-sm text-gray-600">Bug reports, feature requests, performance issues</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Business Inquiries</h3>
              <p className="text-sm text-gray-600">Partnerships, enterprise plans, media requests</p>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            <strong className="font-semibold text-gray-900">Expected Response Time:</strong> We typically respond within 24-48 hours during business days.
          </p>
        </div>

        {/* Quick Links */}
        <section className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Looking for something else?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/company/privacy-policy"
              className="text-blue-600 hover:underline font-semibold"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/company/terms-and-conditions"
              className="text-blue-600 hover:underline font-semibold"
            >
              Terms & Conditions
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/company/refund-policy"
              className="text-blue-600 hover:underline font-semibold"
            >
              Refund Policy
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
