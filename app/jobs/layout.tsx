import type { Metadata } from "next";
import type { ReactNode } from "react";

import JobsNav from "@/components/jobs/JobsNav";
import V1LaunchJourney from "@/components/jobs/V1LaunchJourney";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Jobs Execution Center",
  description: "Private company targeting, recruiter outreach, job tracking, resume storage, applications, and interview preparation inside MoveReady.",
};

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="page-shell jobs-shell">
      <SiteHeader sectionLabel="Guided relocation and job-search platform" />
      <JobsNav />
      <V1LaunchJourney />
      {children}
    </main>
  );
}
