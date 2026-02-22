"use client";

import Link from "next/link";
import { LinkedinLogo, FacebookLogo, InstagramLogo } from "phosphor-react";

export default function Footer() {
  return (
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
                <Link href="/company/who-are-we" className="hover:text-sky-600 transition-colors">
                  Who Are We
                </Link>
              </li>
              <li>
                <Link href="/company/why-we-built-connektx" className="hover:text-sky-600 transition-colors">
                  Why We Built ConnektX
                </Link>
              </li>
              <li>
                <Link href="/company/who-is-connektx-for" className="hover:text-sky-600 transition-colors">
                  Who Is ConnektX For
                </Link>
              </li>
              <li>
                <Link href="/company/privacy-policy" className="hover:text-sky-600 transition-colors">
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
  );
}