/**
 * Stable frontend models for the B19 job-application platform.
 * Keep wire-specific aliases inside adapters; UI code imports these models.
 */
export type Id = string;
export type IsoDateTime = string;
export type JsonObject = Record<string, unknown>;

export type ReadinessState = "not_started" | "in_progress" | "ready" | "blocked" | string;
export interface JobReadiness {
  jobId: Id;
  state: ReadinessState;
  score: number | null;
  materials: ReadinessMaterial[];
  blockers: string[];
  updatedAt: IsoDateTime | null;
}
export interface ReadinessMaterial {
  kind: string;
  status: string;
  documentId?: Id | null;
  note?: string | null;
}
export interface ApplicationDraft {
  id: Id;
  jobId: Id;
  status: string;
  resumeId: Id | null;
  coverLetterId: Id | null;
  reviewNotes: string[];
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
}
export interface ApplicationHandoff {
  id: Id;
  jobId: Id;
  draftId: Id;
  status: string;
  destination: string | null;
  externalUrl: string | null;
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
}
export interface ApplicationLifecycle {
  id: Id;
  jobId: Id;
  applicationId: Id | null;
  stage: string;
  status: string;
  nextActionAt: IsoDateTime | null;
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
}
export interface ApplicationFollowup {
  id: Id;
  lifecycleId: Id;
  status: string;
  dueAt: IsoDateTime | null;
  channel: string | null;
  note: string | null;
  completedAt: IsoDateTime | null;
}
export interface PortfolioItem {
  jobId: Id;
  stage: string;
  status: string;
  nextAction: string | null;
  nextActionAt: IsoDateTime | null;
  readinessScore: number | null;
}
export interface AnalyticsSnapshot {
  generatedAt: IsoDateTime | null;
  totals: Record<string, number>;
  series: JsonObject[];
  recommendations: JsonObject[];
}
export interface Campaign {
  id: Id;
  name: string;
  status: string;
  vacancyIds: Id[];
  progress: Record<string, number>;
  createdAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
}
export interface EmployerDashboard {
  employerId: Id;
  employerName: string | null;
  vacancies: JsonObject[];
  applications: JsonObject[];
  metrics: Record<string, number>;
}
export interface RecruiterDashboard {
  recruiterId: Id;
  recruiterName: string | null;
  canonicalEmployerId: Id | null;
  relationshipEvents: JsonObject[];
  metrics: Record<string, number>;
}

export interface Collection<T> {
  items: T[];
  total: number;
  nextCursor: string | null;
}
export type CommandResult<T> = { data: T; message?: string };
