export type JobProfile = {
  id: string;
  display_name?: string;
  headline: string;
  years_experience?: number;
  education_level?: string;
  current_employer?: string;
  previous_employer?: string;
  target_roles?: string[];
  skills?: string[];
  primary_country?: string;
  later_countries?: string[];
  preferred_provinces?: string[];
  work_authorization_status?: string;
  updated_at?: string;
};

export type CompanyTracking = {
  id?: string;
  priority: string;
  status: string;
  notes?: string;
  updated_at?: string;
};

export type JobCompany = {
  id: string;
  company_name: string;
  industry: string;
  country: string;
  province?: string;
  website?: string;
  career_page?: string;
  visa_sponsorship_status?: string;
  lmia_history_status?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  source_status?: string;
  last_verified_at?: string;
  record_status?: string;
  tracking?: CompanyTracking | null;
  recruiter?: Pick<JobRecruiter, "id" | "recruiter_name" | "connection_status" | "specialization"> | null;
  recruiter_count?: number;
};

export type JobRecruiter = {
  id: string;
  company_id?: string;
  recruiter_name: string;
  recruitment_company?: string;
  province?: string;
  specialization?: string;
  linkedin_url?: string;
  website?: string;
  email_address?: string;
  phone?: string;
  connected?: boolean;
  connection_status?: string;
  last_contacted_at?: string;
  follow_up_date?: string;
  notes?: string;
  updated_at?: string;
};

export type JobLead = {
  id: string;
  company_id?: string;
  recruiter_id?: string;
  company_name?: string;
  recruiter_name?: string;
  job_title: string;
  country: string;
  province?: string;
  city?: string;
  employment_type?: string;
  workplace_type?: string;
  job_url?: string;
  source_name?: string;
  description_summary?: string;
  skills?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  visa_sponsorship_status?: string;
  posted_at?: string;
  expires_at?: string;
  status: string;
  source_status?: string;
  match_score?: number;
  match_reasons?: string[];
  updated_at?: string;
};

export type JobApplication = {
  id: string;
  job_id?: string;
  company_id?: string;
  recruiter_id?: string;
  job_title: string;
  company_name: string;
  country: string;
  province?: string;
  job_url?: string;
  status: string;
  date_applied?: string;
  follow_up_date?: string;
  interview_date?: string;
  documents_used?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type ResumeDocument = {
  id: string;
  document_type: string;
  title: string;
  original_file_name: string;
  mime_type: string;
  size_bytes: number;
  version: number;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type JobsSummary = {
  profile: JobProfile | null;
  counts: {
    recommended_jobs: number;
    target_companies: number;
    recruiters: number;
    applications: number;
    resume_documents: number;
    follow_ups_due: number;
  };
  applications_by_status: Record<string, number>;
  recommended_jobs: JobLead[];
  follow_ups: JobApplication[];
  privacy_note?: string;
};

export const applicationStatuses = ["saved", "applied", "interview", "rejected", "offer", "visa"];
export const companyPriorities = ["high", "medium", "low", "watch"];
export const companyStatuses = ["researching", "targeting", "contacted", "applied", "interview", "offer", "paused", "archived"];
export const connectionStatuses = ["not_contacted", "connection_requested", "connected", "contacted", "responded", "follow_up", "inactive"];
export const documentTypes = ["executive_resume", "ats_resume", "cover_letter", "manufacturing_portfolio"];

export function jobLabel(value?: string | null, fallback = "Not recorded") {
  const cleaned = String(value || "").trim();
  if (!cleaned) return fallback;
  return cleaned
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatJobDate(value?: string | null, includeTime = false) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, includeTime
      ? { dateStyle: "medium", timeStyle: "short" }
      : { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatFileSize(bytes?: number) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formValue(form: FormData, name: string) {
  return String(form.get(name) || "").trim();
}

export function optionalFormValue(form: FormData, name: string) {
  return formValue(form, name) || undefined;
}
