// Synthetic launch fixtures only. Never copy production accounts or vacancy records here.
export const ids = Object.freeze({
  job: "00000000-0000-4000-8000-000000000101",
  draft: "00000000-0000-4000-8000-000000000102",
  lifecycle: "00000000-0000-4000-8000-000000000103",
  recruiter: "00000000-0000-4000-8000-000000000104",
});
export const readinessWire = Object.freeze({
  job_id: ids.job,
  status: "in_progress",
  readiness_score: 72,
  materials: [{ type: "resume", status: "ready", document_id: null }],
  blockers: ["Add a tailored cover letter"],
  updated_at: "2030-01-01T12:00:00Z",
});
