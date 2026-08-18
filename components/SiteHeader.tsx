"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const primaryNavigation = [
  { label: "Find", href: "/find", title: "Find realistic jobs, pathways and opportunities" },
  { label: "Qualify", href: "/qualify", title: "Build language, evidence, financial and route readiness" },
  { label: "Move", href: "/move", title: "Execute applications, travel and settlement" },
  { label: "Dashboard", href: "/dashboard", title: "Open your MoveReady dashboard" },
  { label: "Jobs", href: "/jobs", title: "Run your local or international job search" },
  { label: "Profile", href: "/dashboard#profiles", title: "Review your active relocation profile" },
];

const secondaryNavigation = [
  { label: "Home", href: "/", title: "Home page" },
  { label: "Start", href: "/onboarding", title: "Guided verified-account setup" },
  { label: "Account Center", href: "/dashboard", title: "Open your MoveReady dashboard" },
  { label: "Readiness", href: "/readiness-hub", title: "Open the document, money, deadline and execution command center" },
  { label: "Progress", href: "/progress", title: "Review private progress and recorded outcomes" },
  { label: "Jobs", href: "/jobs", title: "Run your local or international job search" },
  { label: "Countries", href: "/country-comparison", title: "Compare countries" },
  { label: "Routes", href: "/compare", title: "Compare relocation routes" },
  { label: "Documents", href: "/evidence-pack", title: "Organize private documents and evidence" },
  { label: "Language", href: "/language-coach", title: "English and French language coach" },
  { label: "My Journey", href: "/my-journey", title: "Review private end-to-end journey progress" },
  { label: "Actions", href: "/action-center", title: "Review ranked private next actions" },
  { label: "Decide", href: "/decision-center", title: "Choose your direction" },
  { label: "Passport", href: "/passport-index", title: "Check what your passport can do" },
  { label: "Visa Power", href: "/visa-power", title: "Check travel benefits from visas you already hold" },
  { label: "Check Route", href: "/route-checker", title: "Check your route and generate a report" },
  { label: "Study", href: "/study-planner", title: "Plan admission and study visa preparation" },
  { label: "Trip", href: "/trip-planner", title: "Check trip readiness before comparing bookings" },
  { label: "Planner", href: "/journey-planner", title: "Plan documents, family, appointments, and settlement" },
  { label: "Applications", href: "/applications", title: "Track a real application from research to decision" },
  { label: "App Alerts", href: "/application-alerts", title: "Review private application deadline and risk alerts" },
  { label: "Source Health", href: "/source-health", title: "Review source freshness and confidence" },
  { label: "Alerts", href: "/alerts", title: "Review consolidated private smart alerts" },
  { label: "Watchlist", href: "/watchlist", title: "Create and manage route and opportunity watches" },
  { label: "Services", href: "/services", title: "Request trusted support" },
  { label: "Prices", href: "/pricing", title: "Pricing overview" },
  { label: "Quotes", href: "/billing", title: "Request and review commercial quotes and payment status" },
  { label: "Support", href: "/support-center", title: "Review provider handoffs and open private support cases" },
  { label: "Activity", href: "/activity", title: "Review private account activity" },
  { label: "Settings", href: "/settings", title: "Account settings, accessibility, security, and privacy" },
  { label: "Accessibility", href: "/accessibility", title: "Review mobile, keyboard, reading and accessibility support" },
  { label: "Status", href: "/deployment-status", title: "Verify the live backend revision and operational contract" },
];

type SiteHeaderProps = { sectionLabel?: string; subtitle?: string };

function pathOnly(href: string) {
  return href.split("#")[0];
}

function isCurrent(pathname: string, href: string) {
  if (href.includes("#")) return false;
  const target = pathOnly(href);
  if (target === "/") return pathname === "/";
  if (target === "/jobs") return pathname === target || pathname.startsWith(`${target}/`);
  return pathname === target;
}

export default function SiteHeader({ sectionLabel = "Global relocation readiness platform", subtitle }: SiteHeaderProps) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const label = subtitle || sectionLabel;

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current.open = false;
        detailsRef.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Project MoveReady home">
        <strong>Project MoveReady</strong>
        <span>{label}</span>
      </a>
      <nav className="nav" aria-label="Main navigation">
        {primaryNavigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            title={item.title}
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
        <details className="nav-more" ref={detailsRef}>
          <summary aria-label="Open more MoveReady navigation">More</summary>
          <div className="nav-more-menu">
            {secondaryNavigation.map((item) => (
              <a
                href={item.href}
                key={item.href}
                title={item.title}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}
