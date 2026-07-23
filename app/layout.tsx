import type { Metadata, Viewport } from "next";

import AccessibilityPreferenceLoader from "@/components/AccessibilityPreferenceLoader";
import MobileQuickNav from "@/components/MobileQuickNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";
import "./legal.css";
import "./responsive-polish.css";
import "./accessibility-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sir-bm-201-moveready-frontend.vercel.app"),
  title: {
    default: "Project MoveReady",
    template: "%s | Project MoveReady",
  },
  description: "Source-backed visa, relocation, study, document, evidence, application, funds, scholarship, insurance, travel, and settlement readiness in one controlled workflow.",
  applicationName: "Project MoveReady",
  category: "travel",
  keywords: [
    "relocation planning",
    "visa readiness",
    "travel readiness",
    "immigration documents",
    "application tracking",
    "evidence pack",
    "country comparison",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    title: "Project MoveReady",
    description: "Plan, verify, organize, track, and review a relocation journey with source status, risk labels, private account controls, and no approval guarantees.",
    siteName: "Project MoveReady",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project MoveReady",
    description: "Source-backed relocation and travel readiness without approval guarantees.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <AccessibilityPreferenceLoader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <MobileQuickNav />
      </body>
    </html>
  );
}
