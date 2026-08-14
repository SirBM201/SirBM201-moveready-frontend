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
  career_facts?: string[];
  primary_country?: string;
  later_countries?: string[];
  preferred_provinces?: string[];
  work_authorization_status?: string;
  search_scope?: "local" | "international" | "both";
  current_country?: string;
  work_authorized_countries?: string[];
  updated_at?: string;
};

export type CompanyTracking = { id?: string; priority: string; status: string; notes?: string; updated_at?: string };
export type JobCompany = { id: string; company_name: string; industry: string; country: string; province?: string; website?: string; career_page?: string; visa_sponsorship_status?: string; lmia_history_status?: string; salary_min?: number; salary_max?: number; salary_currency?: string; source_status?: string; last_verified_at?: string; record_status?: string; tracking?: CompanyTracking | null; recruiter?: Pick<JobRecruiter, "id" | "recruiter_name" | "connection_status" | "specialization"> | null; recruiter_count?: number };
export type JobRecruiter = { id: string; company_id?: string; recruiter_name: string; recruitment_company?: string; province?: string; specialization?: string; linkedin_url?: string; website?: string; email_address?: string; phone?: string; connected?: boolean; connection_status?: string; last_contacted_at?: string; follow_up_date?: string; notes?: string; updated_at?: string };

export type JobLead = {
  id: string; company_id?: string; recruiter_id?: string; company_name?: string; recruiter_name?: string;
  job_title: string; country: string; province?: string; city?: string; employment_type?: string; workplace_type?: string;
  job_url?: string; source_name?: string; description_summary?: string; skills?: string[];
  salary_min?: number; salary_max?: number; salary_currency?: string;
  visa_sponsorship_status?: string;
  work_authorization_requirement?: "unknown" | "existing_required" | "employer_support_possible" | "employer_support_confirmed";
  relocation_support_status?: "unknown" | "not_available" | "possible" | "confirmed";
  sponsorship_evidence?: string;
  posted_at?: string; expires_at?: string; status: string; source_status?: string; source_fingerprint?: string; source_content_hash?: string;
  first_seen_at?: string; last_seen_at?: string; last_checked_at?: string;
  match_score?: number; match_reasons?: string[];
  application_viability_score?: number; application_priority_score?: number; application_priority?: string; viability_reasons?: string[];
  search_scope_classification?: "local" | "international";
  updated_at?: string;
};

export type JobWatch = { id: string; company_id: string; company_name?: string; watch_name: string; source_url: string; source_type: string; keywords?: string[]; country: string; province?: string; cadence: string; min_match_score: number; email_alerts: boolean; is_active: boolean; last_scan_at?: string; next_scan_at?: string; last_scan_status: string; last_error?: string; last_result_count?: number };
export type JobAutomationAlert = { id: string; watch_id?: string; job_id?: string; alert_type: string; severity: string; title: string; summary: string; source_url?: string; status: string; delivery_status?: string; created_at?: string };
export type JobDocumentDraft = { id: string; job_id: string; application_id?: string; source_resume_asset_id?: string; draft_type: "tailored_resume" | "cover_letter"; title: string; content: string; status: string; generation_method: string; truth_basis?: Record<string, any>; warnings?: string[]; user_confirmations?: Record<string, boolean>; approved_at?: string; exported_at?: string; updated_at?: string };
export type ApplicationReadinessCheck = { code: string; label: string; passed: boolean };
export type JobApplicationAssistance = { application?: Record<string, any>; job?: JobLead; drafts?: JobDocumentDraft[]; readiness?: ApplicationReadinessCheck[]; ready_to_handoff?: boolean; handoff_url?: string; warnings?: string[] };
