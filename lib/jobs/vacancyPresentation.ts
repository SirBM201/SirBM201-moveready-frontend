import type { JobLead } from "@/lib/jobs";

export type FreshnessTone = "current" | "aging" | "stale" | "unknown" | "closed";
export interface FreshnessView {
  tone: FreshnessTone;
  label: string;
  detail: string;
  referenceAt: string | null;
}

const DAY = 86_400_000;
const validDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

export function vacancyFreshness(job: JobLead, now = new Date()): FreshnessView {
  const status = String(job.status || "").toLowerCase();
  if (["closed", "expired", "removed", "inactive"].includes(status)) {
    return { tone: "closed", label: "Closed or unavailable", detail: "This vacancy should not be treated as open.", referenceAt: job.last_checked_at || job.last_seen_at || null };
  }
  const expiry = validDate(job.expires_at);
  if (expiry && expiry.getTime() < now.getTime()) {
    return { tone: "closed", label: "Past stated closing date", detail: "Verify on the original source before taking any action.", referenceAt: job.expires_at || null };
  }
  const checked = validDate(job.last_checked_at) || validDate(job.last_seen_at) || validDate(job.first_seen_at) || validDate(job.posted_at);
  if (!checked) return { tone: "unknown", label: "Freshness unknown", detail: "No reliable observed or checked date is recorded.", referenceAt: null };
  const age = Math.max(0, Math.floor((now.getTime() - checked.getTime()) / DAY));
  if (age <= 7) return { tone: "current", label: age === 0 ? "Checked today" : `Checked ${age} day${age === 1 ? "" : "s"} ago`, detail: "Recently observed; always confirm on the original source.", referenceAt: checked.toISOString() };
  if (age <= 30) return { tone: "aging", label: `Checked ${age} days ago`, detail: "This listing is aging. Confirm availability before preparing documents.", referenceAt: checked.toISOString() };
  return { tone: "stale", label: `Not checked for ${age} days`, detail: "Treat as stale until the original source confirms it is open.", referenceAt: checked.toISOString() };
}
export function sourceView(job: JobLead) {
  const hasUrl = /^https?:\/\//i.test(job.job_url || "");
  const name = String(job.source_name || "").trim();
  const status = String(job.source_status || "").toLowerCase();
  return {
    name: name || (hasUrl ? "Original vacancy link" : "Source not recorded"),
    hasUrl,
    verified: hasUrl && ["verified", "active", "official", "healthy"].includes(status),
    warning: !hasUrl ? "No original source URL is recorded." : status ? `Source status: ${status.replace(/_/g, " ")}.` : "The link is recorded but its publisher has not been verified.",
  };
}
export function suitabilityView(job: JobLead) {
  const match = job.match_score ?? 0;
  const viability = job.application_viability_score ?? job.application_priority_score ?? 0;
  const priority = String(job.application_priority || "review").replace(/_/g, " ");
  return {
    match, viability, priority,
    matchReasons: (job.match_reasons || []).filter(Boolean),
    viabilityReasons: (job.application_priority_reasons || job.viability_reasons || []).filter(Boolean),
  };
}
export function vacancyLocation(job: JobLead) {
  return [job.city, job.province, job.country].filter(Boolean).join(", ") || "Location not recorded";
}
