import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-standard-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/fraunces-latin-standard-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-latin-standard-normal.woff2", style: "normal", weight: "100 1000" },
    { path: "./fonts/dm-sans-latin-standard-italic.woff2", style: "italic", weight: "100 1000" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

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
  themeColor: "#f6f4ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} ${GeistMono.variable}`} suppressHydrationWarning>
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
