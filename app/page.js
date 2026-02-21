"use client";

import Script from "next/script";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Connektx</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-NLF67TF763"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NLF67TF763');
        `}
      </Script>

      <main className="bg-white text-slate-800 antialiased font-sans">

        {/* NAVBAR */}
        <nav className="fixed w-full z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-2 cursor-pointer">
                <img src="public/logo.png" alt="Connektx Logo" className="h-10 w-auto" />
                <span className="font-bold text-xl tracking-tight">Connektx</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#roles" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition">
                  For You
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=app.rork.connektx"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg"
                >
                  Join Connektx
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              ConnektX <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                Where Serious Builders Hang Out
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect. Build. Grow.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=app.rork.connektx"
                className="px-8 py-3.5 text-base font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition shadow-xl"
              >
                Download Now
              </a>

              <a href="#roles"
                className="px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition">
                How it works
              </a>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        </section>

        {/* ROLES SECTION */}
        <section id="roles" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                Who Connektx is For
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              {/* Students */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl font-bold mb-3">Students & Freshers</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Tired of ghosting? Get real responses and find early-stage opportunities.
                </p>
                <a href="https://play.google.com/store/apps/details?id=app.rork.connektx" className="text-orange-600 font-bold text-sm">
                  Find Opportunities →
                </a>
              </div>

              {/* Founders */}
              <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl font-bold mb-3">Founders & Startups</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Launch products, hire serious builders, and grow without noise.
                </p>
                <a href="https://play.google.com/store/apps/details?id=app.rork.connektx" className="text-sky-600 font-bold text-sm">
                  Start Building →
                </a>
              </div>

              {/* Professionals */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <h3 className="text-xl font-bold mb-3">Professionals</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Showcase your work and tap into the startup ecosystem.
                </p>
                <a href="https://play.google.com/store/apps/details?id=app.rork.connektx" className="text-purple-600 font-bold text-sm">
                  Grow Your Network →
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the community of serious builders
            </h2>

            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              If you're building something real, this is where you belong.
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=app.rork.connektx"
              className="px-8 py-4 text-base font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg"
            >
              Join Connektx
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                Connektx
                </span>
                <p className="mt-4 text-sm text-slate-500">
                The ecosystem where meaningful connections turn into opportunities.
                </p>
            </div>

            {/* Empty Column (kept as per original HTML) */}
            <div></div>

            {/* Company Links */}
            <div>
                <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                <li>
                    <a
                    href="https://techwaveventures.in"
                    className="hover:text-sky-600"
                    >
                    About Us
                    </a>
                </li>
                <li>
                    <a
                    href="mailto:contact@connektx.com"
                    className="hover:text-sky-600"
                    >
                    Contact
                    </a>
                </li>
                <li>
                    <a
                    href="privacy-policy.html"
                    className="hover:text-sky-600"
                    >
                    Privacy Policy
                    </a>
                </li>
                </ul>
            </div>

            {/* Contact + Social */}
            <div>
                <h4 className="font-semibold text-slate-900 mb-4">Contact Us</h4>

                <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li>
                    <a
                    href="mailto:contact@connektx.com"
                    className="flex items-center gap-2 hover:text-sky-600 transition-colors"
                    >
                    contact@connektx.com
                    </a>
                </li>
                </ul>

                <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
                Follow Us
                </h4>

                <div className="flex gap-4">
                <a
                    href="https://www.linkedin.com/company/connektx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#0077b5] transition-colors"
                    aria-label="LinkedIn"
                >
                    LinkedIn
                </a>

                <a
                    href="https://www.instagram.com/connektx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#1877F2] transition-colors"
                    aria-label="Facebook"
                >
                    Facebook
                </a>

                <a
                    href="https://www.instagram.com/connektx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#E4405F] transition-colors"
                    aria-label="Instagram"
                >
                    Instagram
                </a>
                </div>
            </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-400">
                    © 2025 Techwave Ventures Private Limited. All rights reserved.
                </p>

                <div className="flex gap-6 text-sm text-slate-400">
                    <a href="privacy-policy.html" className="hover:text-slate-600">Privacy</a>
                </div>
            </div>

        </div>
        </footer>

      </main>
    </>
  );
}