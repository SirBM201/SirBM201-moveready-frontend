import type { Metadata, Viewport } from "next";

import AccessibilityPreferenceLoader from "@/components/AccessibilityPreferenceLoader";
import AdminKeyStorageGuard from "@/components/AdminKeyStorageGuard";
import MobileQuickNav from "@/components/MobileQuickNav";
import PerformanceVitals from "@/components/PerformanceVitals";
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
  description: "Source-backed relocation, jobs, visa, study, documents, applications, travel, and settlement execution in one controlled workflow.",
  applicationName: "Project MoveReady",
  category: "travel",
  keywords: [
    "relocation planning",
    "visa readiness",
    "travel readiness",
    "immigration documents",
    "application tracking",
    "international job search",
    "resume tracking",
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
        <AdminKeyStorageGuard />
        <PerformanceVitals />
        <div className="main-content" id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
        <MobileQuickNav />
      </body>
    </html>
  );
}
