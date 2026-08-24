import type {
  AnalyticsSnapshot, ApplicationDraft, ApplicationFollowup, ApplicationHandoff,
  ApplicationLifecycle, Campaign, Collection, EmployerDashboard, JobReadiness,
  JsonObject, PortfolioItem, RecruiterDashboard,
} from "./domain";

const object = (value: unknown): JsonObject =>
  value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
const text = (value: unknown): string => typeof value === "string" ? value : "";
const nullableText = (value: unknown): string | null => typeof value === "string" && value ? value : null;
const numberOrNull = (value: unknown): number | null => typeof value === "number" && Number.isFinite(value) ? value : null;
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const recordNumbers = (value: unknown): Record<string, number> => Object.fromEntries(
  Object.entries(object(value)).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
);
const first = (raw: JsonObject, ...keys: string[]): unknown => keys.map(key => raw[key]).find(value => value !== undefined);
const payload = (value: unknown): JsonObject => {
  const raw = object(value);
  const nested = first(raw, "data", "result");
  return nested && typeof nested === "object" && !Array.isArray(nested) ? object(nested) : raw;
};
const items = (value: unknown, ...keys: string[]): unknown[] => {
  const raw = object(value);
  for (const key of ["items", ...keys, "data", "results"]) {
    const candidate = raw[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

export const adaptReadiness = (value: unknown): JobReadiness => {
  const raw = payload(value);
  return {
    jobId: text(first(raw, "job_id", "jobId")),
    state: text(first(raw, "state", "status")) || "not_started",
    score: numberOrNull(first(raw, "score", "readiness_score")),
    materials: list(raw.materials).map(item => {
      const material = object(item);
      return {
        kind: text(first(material, "kind", "type")),
        status: text(material.status),
        documentId: nullableText(first(material, "document_id", "documentId")),
        note: nullableText(material.note),
      };
    }),
    blockers: list(raw.blockers).map(text).filter(Boolean),
    updatedAt: nullableText(first(raw, "updated_at", "updatedAt")),
  };
};
export const adaptDraft = (value: unknown): ApplicationDraft => {
  const raw = payload(value);
  return {
    id: text(raw.id), jobId: text(first(raw, "job_id", "jobId")),
    status: text(raw.status), resumeId: nullableText(first(raw, "resume_id", "resumeId")),
    coverLetterId: nullableText(first(raw, "cover_letter_id", "coverLetterId")),
    reviewNotes: list(first(raw, "review_notes", "reviewNotes")).map(text).filter(Boolean),
    createdAt: nullableText(first(raw, "created_at", "createdAt")),
    updatedAt: nullableText(first(raw, "updated_at", "updatedAt")),
  };
};
export const adaptHandoff = (value: unknown): ApplicationHandoff => {
  const raw = payload(value);
  return {
    id: text(raw.id), jobId: text(first(raw, "job_id", "jobId")),
    draftId: text(first(raw, "draft_id", "draftId")), status: text(raw.status),
    destination: nullableText(raw.destination), externalUrl: nullableText(first(raw, "external_url", "externalUrl")),
    createdAt: nullableText(first(raw, "created_at", "createdAt")),
    updatedAt: nullableText(first(raw, "updated_at", "updatedAt")),
  };
};
export const adaptLifecycle = (value: unknown): ApplicationLifecycle => {
  const raw = payload(value);
  return {
    id: text(raw.id), jobId: text(first(raw, "job_id", "jobId")),
    applicationId: nullableText(first(raw, "application_id", "applicationId")),
    stage: text(raw.stage), status: text(raw.status),
    nextActionAt: nullableText(first(raw, "next_action_at", "nextActionAt")),
    createdAt: nullableText(first(raw, "created_at", "createdAt")),
    updatedAt: nullableText(first(raw, "updated_at", "updatedAt")),
  };
};
export const adaptFollowup = (value: unknown): ApplicationFollowup => {
  const raw = payload(value);
  return {
    id: text(raw.id), lifecycleId: text(first(raw, "lifecycle_id", "lifecycleId")),
    status: text(raw.status), dueAt: nullableText(first(raw, "due_at", "dueAt")),
    channel: nullableText(raw.channel), note: nullableText(raw.note),
    completedAt: nullableText(first(raw, "completed_at", "completedAt")),
  };
};
export const adaptPortfolioItem = (value: unknown): PortfolioItem => {
  const raw = payload(value);
  return {
    jobId: text(first(raw, "job_id", "jobId")), stage: text(raw.stage), status: text(raw.status),
    nextAction: nullableText(first(raw, "next_action", "nextAction")),
    nextActionAt: nullableText(first(raw, "next_action_at", "nextActionAt")),
    readinessScore: numberOrNull(first(raw, "readiness_score", "readinessScore")),
  };
};
export const adaptCollection = <T>(value: unknown, adapter: (item: unknown) => T, ...keys: string[]): Collection<T> => {
  const raw = object(value);
  const collection = items(value, ...keys);
  return {
    items: collection.map(adapter),
    total: typeof raw.total === "number" ? raw.total : collection.length,
    nextCursor: nullableText(first(raw, "next_cursor", "nextCursor")),
  };
};
export const adaptAnalytics = (value: unknown): AnalyticsSnapshot => {
  const raw = payload(value);
  return {
    generatedAt: nullableText(first(raw, "generated_at", "generatedAt")),
    totals: recordNumbers(first(raw, "totals", "metrics")),
    series: list(first(raw, "series", "data")).map(object),
    recommendations: list(raw.recommendations).map(object),
  };
};
export const adaptCampaign = (value: unknown): Campaign => {
  const raw = payload(value);
  return {
    id: text(raw.id), name: text(raw.name), status: text(raw.status),
    vacancyIds: list(first(raw, "vacancy_ids", "vacancyIds")).map(text).filter(Boolean),
    progress: recordNumbers(raw.progress),
    createdAt: nullableText(first(raw, "created_at", "createdAt")),
    updatedAt: nullableText(first(raw, "updated_at", "updatedAt")),
  };
};
export const adaptEmployerDashboard = (value: unknown): EmployerDashboard => {
  const raw = payload(value);
  return {
    employerId: text(first(raw, "employer_id", "employerId")),
    employerName: nullableText(first(raw, "employer_name", "employerName")),
    vacancies: list(raw.vacancies).map(object), applications: list(raw.applications).map(object),
    metrics: recordNumbers(raw.metrics),
  };
};
export const adaptRecruiterDashboard = (value: unknown): RecruiterDashboard => {
  const raw = payload(value);
  return {
    recruiterId: text(first(raw, "recruiter_id", "recruiterId")),
    recruiterName: nullableText(first(raw, "recruiter_name", "recruiterName")),
    canonicalEmployerId: nullableText(first(raw, "canonical_employer_id", "canonicalEmployerId")),
    relationshipEvents: list(first(raw, "relationship_events", "events")).map(object),
    metrics: recordNumbers(raw.metrics),
  };
};
