import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://connektx.com"
  ),

  title: {
    default: "Connektx | Connect. Build. Grow.",
    template: "%s | Connektx",
  },

  description:
    "Connektx helps students, founders, and professionals connect with purpose — to build, collaborate, and grow in the startup ecosystem.",

  keywords: [
    "Connektx",
    "startup networking",
    "founders",
    "students",
    "collaboration",
    "entrepreneur community",
  ],

  authors: [{ name: "Connektx" }],
  creator: "Connektx",
  publisher: "Connektx",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://connektx.com",
    siteName: "Connektx",
    title: "Connektx | Connect. Build. Grow.",
    description:
      "Join Connektx to connect with builders, founders, and professionals in the startup ecosystem.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Connektx | Connect. Build. Grow.",
    description:
      "Connect with purpose. Build meaningful collaborations. Grow in the startup world.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 🔑 SEO Sitemap link */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
