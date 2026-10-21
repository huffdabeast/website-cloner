import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteDialogs } from "@/components/skyfall/chrome/dialogs";
import { SmoothScroll } from "@/components/skyfall/motion/smooth-scroll";

const description = "Skyfall AI is building Engineering World Models for the autonomous enterprise.";

export const metadata: Metadata = {
  title: {
    default: "Skyfall AI",
    template: "%s · Skyfall AI",
  },
  description,
  icons: { icon: { url: "/seo/favicon.svg", type: "image/svg+xml" } },
  openGraph: { siteName: "Skyfall AI", type: "website", title: "Skyfall AI", description },
  twitter: { card: "summary", site: "@skyfallai" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f6f6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/GeistMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "[data-split-reveal],[data-fade-up],[data-fade-up] *{visibility:visible!important}" }} />
        </noscript>
      </head>
      <body>
        <SmoothScroll>
          {children}
          <SiteDialogs />
        </SmoothScroll>
      </body>
    </html>
  );
}
