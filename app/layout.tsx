import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";
import "./legal.css";
import "./responsive-polish.css";

export const metadata: Metadata = {
  title: "Project MoveReady",
  description: "Visa, relocation, document, funds, scholarship, insurance, and budget readiness in one source-backed workflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
