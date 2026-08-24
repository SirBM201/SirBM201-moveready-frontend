import VacancyAlignmentReport from "@/components/jobs/VacancyAlignmentReport";
export default async function AlignmentPage({params}:{params:Promise<{jobId:string}>}){const{jobId}=await params;return <VacancyAlignmentReport jobId={jobId}/>;}
