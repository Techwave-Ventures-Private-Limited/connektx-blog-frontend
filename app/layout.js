import { Inter } from 'next/font/google'
import Script from 'next/script';
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
    "Connektx isn't another social platform. It's an ecosystem for serious builders — builders collaborating, founders discussing product strategy, ambitious minds turning ideas into scalable companies together.",

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
        <meta name="facebook-domain-verification" content="wkf0gfpvopi2ubho29pnc9l5wp1agi" />
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '439392249067743'); 
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
