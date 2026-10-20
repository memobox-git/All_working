import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Stackle: live data and AI engineering cohorts",
    template: "%s · Stackle",
  },
  description: site.description,
  applicationName: "Stackle",
  openGraph: {
    type: "website",
    siteName: "Stackle",
    url: site.url,
    title: "Stackle: live data and AI engineering cohorts",
    description: site.tagline,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stackle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stackle: live data and AI engineering cohorts",
    description: site.tagline,
    images: ["/og.png"],
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f4f4f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveal />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}');`}
        </Script>
      </body>
    </html>
  );
}
