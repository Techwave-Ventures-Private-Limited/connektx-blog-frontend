"use client";

import Script from "next/script";
import Head from "next/head";
import Link from "next/link";
import { LinkedinLogo, FacebookLogo, InstagramLogo } from "phosphor-react";
import Header from "@/components/Header";

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
        < Header />

        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              A Better Way to Connect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                In the Startup World.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ConnektX helps students, founders, and professionals connect with purpose
              whether you're looking to build, hire, or find your next opportunity.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=app.rork.connektx"
                className="px-8 py-3.5 text-base font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition shadow-xl"
              >
                Join ConnektX
              </a>

              <a
                href="#roles"
                className="px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition"
              >
                See How It Works
              </a>
            </div>

          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        </section>

        {/* HOW CONNEKTX HELPS BUILDERS */}
        <section id="roles" className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                How ConnektX Helps Builders
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Whether you're starting something new or joining something ambitious —
                it begins with the right people.
              </p>
            </div>

            {/* Perspective wrapper for 3D depth */}
            <div className="grid md:grid-cols-2 gap-10 [perspective:1200px]">

              {/* CARD 1 */}
              <div className="group relative">
                <div
                  className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm
                            transition-all duration-500 ease-out
                            transform-gpu
                            group-hover:-translate-y-3
                            group-hover:rotate-x-2
                            group-hover:-rotate-y-2
                            group-hover:shadow-2xl"
                >
                  <div className="text-3xl mb-6">🛠️</div>

                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    Build Something
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    Turn your ideas into reality by connecting with people who are serious
                    about building and collaborating.
                  </p>

                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Start new projects</li>
                    <li>• Find collaborators</li>
                    <li>• Move faster with the right team</li>
                  </ul>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="group relative">
                <div
                  className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm
                            transition-all duration-500 ease-out
                            transform-gpu
                            group-hover:-translate-y-3
                            group-hover:rotate-x-2
                            group-hover:-rotate-y-2
                            group-hover:shadow-2xl"
                >
                  <div className="text-3xl mb-6">🚀</div>

                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    Join Someone Who’s Building
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    Work on meaningful ideas by joining ambitious founders and early-stage
                    teams building real products.
                  </p>

                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• Discover early-stage teams</li>
                    <li>• Contribute to real products</li>
                    <li>• Grow alongside builders</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              You’re Closer Than You Think.
            </h2>

            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              To building something that matters.
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=app.rork.connektx"
              className="px-8 py-4 text-base font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg"
            >
              Get Started
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

              {/* Empty Column */}
              <div></div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link
                      href="/company/about#who-are-we"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Who Are We
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/company/about#why-we-built-connektx"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Why We Built ConnektX
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/company/about#who-is-connektx-for"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Who Is ConnektX For
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/company/privacy-policy"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
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
                      <i className="ph ph-envelope-simple text-lg"></i>
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
                    <LinkedinLogo size={28} weight="fill" />
                  </a>

                  <a
                    href="https://www.facebook.com/connektx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#1877F2] transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookLogo size={28} weight="fill" />
                  </a>

                  <a
                    href="https://www.instagram.com/connektx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#E4405F] transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramLogo size={28} weight="fill" />
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
                <Link href="/company/privacy-policy" className="hover:text-slate-600">
                  Privacy
                </Link>
              </div>
            </div>

          </div>
        </footer>

      </main>
    </>
  );
}