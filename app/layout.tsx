import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project MoveReady",
  description: "Visa, relocation, document, funds, scholarship, insurance, and budget readiness in one source-backed workflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
