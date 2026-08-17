import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [workspace, page, readinessTools, qualify, hub, launchReadiness, styles, workflow] = await Promise.all([
  readFile(new URL("../components/financial/FinancialReadinessWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/budget-calculator/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/ReadinessTools.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/qualify/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/readiness-hub/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/launch-readiness/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
]);

assert.match(workspace, /apiJson<FinancialReadinessResponse>\("financial-readiness\/check"/);
assert.doesNotMatch(workspace, /api\/v1\/financial-readiness/);
assert.match(workspace, /response\.contract_version !== "b09-v1"/);
assert.match(workspace, /response\.financial_plan\?\.contract_version !== "b09-v1"/);

for (const requestField of [
  "country_code",
  "route_code",
  "currency",
  "savings",
  "expected_funding",
  "family_size",
  "proof_of_funds",
  "source_url",
  "source_title",
  "source_checked_at",
  "costs",
  "target_date",
]) {
  assert.match(workspace, new RegExp(`\\b${requestField}\\b`), `B10 must submit ${requestField}`);
}

for (const category of ["fees", "tuition", "relocation", "flight", "accommodation", "settlement_reserve"]) {
  assert.match(workspace, new RegExp(`key: "${category}"`), `B10 must expose ${category}`);
}

for (const status of [
  "requirements_needed",
  "source_review_required",
  "currency_mismatch",
  "ready_on_entered_figures",
  "funding_gap",
]) {
  assert.match(workspace, new RegExp(`${status}:`), `B10 must explain ${status}`);
}

assert.match(workspace, /User-supplied reference, not MoveReady verification/);
assert.match(workspace, /applies no multiplier/);
assert.match(workspace, /does not invent family multipliers, exchange rates or approval chances/);
assert.match(workspace, /Do not paste bank statements, account numbers or transaction histories/);
assert.match(workspace, /target="_blank" rel="noreferrer"/);
assert.match(workspace, /aria-live="polite"/);
assert.match(workspace, /role="alert"/);
assert.match(workspace, /funding gap/i);
assert.match(workspace, /monthly target/i);

assert.match(page, /FinancialReadinessWorkspace/);
assert.match(qualify, /'Financial readiness','\/budget-calculator'/);
assert.match(hub, /status:"B10 ready"/);
assert.match(launchReadiness, /status:"B10 implemented"/);
assert.match(launchReadiness, /contract_versions\.financial_readiness = b09-v1/);

assert.doesNotMatch(readinessTools, /readiness\/funds-plan/);
assert.doesNotMatch(readinessTools, /family adjustment/i);
assert.match(readinessTools, /href="\/budget-calculator"/);
assert.match(readinessTools, /Family size is recorded as context only/);

assert.match(styles, /\.financial-shell/);
assert.match(styles, /\.financial-result:focus-visible/);
assert.match(styles, /@media \(max-width: 760px\)/);
assert.match(workflow, /npm run test:b10/);

console.log("B10 Financial Readiness frontend contract: PASS");
