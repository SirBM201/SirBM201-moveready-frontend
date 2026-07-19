const labelMap: Record<string, string> = {
  startup: "Startup / entrepreneur",
  business: "Business / entrepreneur",
  study: "Study",
  scholarship: "Scholarship",
  work: "Work abroad",
  digital_nomad: "Digital nomad / remote work",
  family: "Family relocation",
  visit: "Visit",
  opportunity: "Official opportunity",
  relocation: "General relocation",
  strong_start: "Strong start",
  needs_detail: "Needs more detail",
  early_stage: "Early stage",
  mvp_or_early_traction: "MVP or early traction",
  starter_rules_pending_official_review: "Starter guidance · official source review needed",
  database_backed: "Reviewed database record",
  generated: "Generated",
  active: "Active",
  new: "New",
  closed: "Hidden",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function readableLabel(value?: string | null, fallback = "Not recorded") {
  if (!value) return fallback;
  const key = String(value).trim();
  if (!key) return fallback;
  if (labelMap[key]) return labelMap[key];
  return key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sourceStatusLabel(value?: string | null) {
  if (!value) return "Official source review needed";
  if (value.includes("starter_rules") || value.includes("pending_official")) {
    return "Starter guidance · official source review needed";
  }
  return readableLabel(value, "Official source review needed");
}

export function plainRiskLabel(value?: string | null) {
  if (!value) return "Not labelled";
  return readableLabel(value);
}
