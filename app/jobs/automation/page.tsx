import type { Metadata } from "next";

import JobAutomationWorkspace from "@/components/jobs/JobAutomationWorkspace";

export const metadata: Metadata = {
  title: "Job Automation | MoveReady",
  description: "Monitor official employer vacancies, prepare truthful application documents, and use a controlled application handoff.",
};

export default function JobAutomationPage() {
  return <JobAutomationWorkspace />;
}
