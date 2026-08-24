import VacancyDetail from "@/components/jobs/VacancyDetail";

export default async function VacancyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return <VacancyDetail jobId={jobId} />;
}
