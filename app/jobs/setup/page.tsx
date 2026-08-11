import type { Metadata } from "next";

import JobSetupWorkspace from "@/components/jobs/JobSetupWorkspace";

export const metadata: Metadata = {
  title: "Guided Job Setup | MoveReady",
  description: "Create a private MoveReady job-search profile in four short steps.",
};

export default function JobsSetupPage() {
  return <JobSetupWorkspace />;
}
