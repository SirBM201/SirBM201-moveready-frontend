"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/jobs" },
  { label: "Companies", href: "/jobs/companies" },
  { label: "Applications", href: "/jobs/applications" },
  { label: "Resume", href: "/jobs/resume-vault" },
  { label: "Automation", href: "/jobs/automation" },
];

const supportingLinks = [
  { label: "Quick setup", href: "/jobs/setup" },
  { label: "Job profile", href: "/jobs/profile" },
  { label: "Recruiters", href: "/jobs/recruiters" },
  { label: "Interview Preparation", href: "/jobs/interview-preparation" },
];

export default function JobsNav() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
    <section className="jobs-nav-wrap">
      <div>
        <p className="overline">Job search workspace</p>
        <strong>Find jobs, prepare, apply, and follow up.</strong>
      </div>
      <nav className="jobs-nav" aria-label="Jobs workspace navigation">
        {links.map((item) => (
          <a href={item.href} key={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</a>
        ))}
        <details className="jobs-nav-more" ref={detailsRef}>
          <summary>More tools</summary>
          <div>
            {supportingLinks.map((item) => (
              <a href={item.href} key={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</a>
            ))}
          </div>
        </details>
      </nav>
    </section>
  );
}
