import type { Metadata } from "next";

import JobSetupWorkspace from "@/components/jobs/JobSetupWorkspace";

export const metadata: Metadata = {
  title: "Guided Job Setup | MoveReady",
  description: "Create a private, intentional local or international MoveReady job-search profile in five short steps.",
};

export default function JobsSetupPage() {
  return <JobSetupWorkspace />;
}
