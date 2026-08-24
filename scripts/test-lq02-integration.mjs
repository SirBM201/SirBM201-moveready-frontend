import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const contractsSource = await readFile(new URL("../lib/jobs/contracts.ts", import.meta.url), "utf8");
const clientSource = await readFile(new URL("../lib/jobs/client.ts", import.meta.url), "utf8");
const adaptersSource = await readFile(new URL("../lib/jobs/adapters.ts", import.meta.url), "utf8");
const stateSource = await readFile(new URL("../components/ui/RequestState.tsx", import.meta.url), "utf8");
const fixtureSource = await readFile(new URL("../tests/fixtures/jobs.mjs", import.meta.url), "utf8");

const expected = [
  "readiness.get","readiness.materials","readiness.transition","readiness.reconcile","readiness.list",
  "drafts.create","drafts.list","drafts.review","handoffs.create","handoffs.list","handoffs.get","handoffs.status",
  "lifecycle.create","lifecycle.list","lifecycle.get","lifecycle.transition","lifecycle.reconcile",
  "followups.create","followups.due","followups.reconcile","followups.complete",
  "portfolio.list","portfolio.actions","portfolio.next","portfolio.get","portfolio.reconcile",
  "analytics.summary","analytics.dashboard","analytics.attribution","analytics.funnel","analytics.performance",
  "analytics.dimension","analytics.recommendations","campaigns.create","campaigns.list","campaigns.get",
  "campaigns.update","campaigns.delete","campaigns.addVacancy","campaigns.removeVacancy","campaigns.progress",
  "employers.dashboard","recruiters.dashboard","recruiters.event",
];
for (const key of expected) {
  assert.match(contractsSource, new RegExp(`["']${key.replace(".","\\.")}["']`), `missing contract ${key}`);
}
assert.equal(new Set(expected).size, expected.length);
assert.match(clientSource, /useAuthToken:\s*true/, "B19 client must request auth");
assert.match(clientSource, /encodeURIComponent/, "client path parameters must be encoded");
for (const adapter of ["adaptReadiness","adaptDraft","adaptHandoff","adaptLifecycle","adaptFollowup","adaptPortfolioItem","adaptAnalytics","adaptCampaign","adaptEmployerDashboard","adaptRecruiterDashboard"]) {
  assert.match(adaptersSource, new RegExp(`export const ${adapter}`), `missing adapter ${adapter}`);
}
for (const state of ["LoadingState","EmptyState","AuthExpiredState","RecoverableErrorState"]) {
  assert.match(stateSource, new RegExp(`export const ${state}`), `missing shared state ${state}`);
}
assert.match(fixtureSource, /Synthetic launch fixtures only/);
assert.doesNotMatch(fixtureSource, /@|\+\d{8,}|SirBM201/i, "fixtures must not include personal contact or account data");
console.log(`LQ02 integration contract passed: ${expected.length} authenticated B19 routes, adapters, request states, and sanitized fixtures.`);
