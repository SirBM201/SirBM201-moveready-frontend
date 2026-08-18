import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [page, center, settings, header, dashboard, workflow, packageJson] = await Promise.all([
  readFile(new URL("../app/alerts/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/SmartAlertsCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/AccountSettingsWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/SiteHeader.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

assert.match(center, /b14-v1/, "Alert center must reject an older backend contract");
for (const state of ["loading", "signed_out", "older_contract", "error"]) {
  assert.match(center, new RegExp(`"${state}"`));
}

for (const category of ["Jobs", "Applications", "Documents", "Verified changes", "Language", "Evidence refresh"]) {
  assert.match(center, new RegExp(category));
}

for (const control of [
  "jobs_enabled",
  "application_followups_enabled",
  "language_reminders_enabled",
  "evidence_refresh_enabled",
  "critical_only",
  "document_expiry_lead_days",
  "language_inactive_days",
  "evidence_refresh_days",
]) {
  assert.match(center + settings, new RegExp(control));
}

assert.match(center, /primary_alert/);
assert.match(center, /counts_by_priority/);
assert.match(center, /partial_errors/);
assert.match(center, /aria-live="polite"/);
assert.match(center, /Verify official source/);
assert.match(center, /email, WhatsApp, SMS, Telegram and push delivery remain disabled/i);
assert.match(page, /Smart alerts and critical monitoring/);
assert.match(page, /alert noise/i);
assert.match(header, /href: "\/alerts"/);
assert.match(dashboard, /Open smart alerts/);
assert.match(workflow, /npm run test:b14/);
assert.match(packageJson, /"test:b14"/);
assert.doesNotMatch(page + center, /Moses|SirBM|founder/i);

console.log("B14 Smart Alerts frontend contract: PASS");
