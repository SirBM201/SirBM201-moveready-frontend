import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [dashboard, commandCenter, actionCenter, actionPage, workflow, packageJson] = await Promise.all([
  readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/DashboardCommandCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/AccountActionCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/action-center/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

assert.match(commandCenter, /b13-v1/, "Dashboard must reject an older orchestration contract");
for (const state of ["loading", "signed_out", "older_contract", "error"]) {
  assert.match(commandCenter, new RegExp(`"${state}"`));
}
assert.match(commandCenter, /primary_action/);
assert.match(commandCenter, /engine_statuses/);
assert.match(commandCenter, /Do this next/);
assert.match(commandCenter, /aria-live="polite"/);

for (const phase of ["FIND", "QUALIFY", "MOVE"]) {
  assert.match(commandCenter, new RegExp(phase));
}
for (const engine of ["Jobs", "Route Finder", "Passport", "Language", "Financial Readiness", "Documents", "Applications"]) {
  assert.match(actionPage + dashboard + commandCenter, new RegExp(engine));
}

assert.match(dashboard, /One profile\. Seven connected engines\. One clear next action\./);
assert.match(dashboard, /<details/);
assert.match(dashboard, /secondary tools and account controls/i);
assert.doesNotMatch(dashboard + commandCenter + actionCenter, /Moses|SirBM|founder/i);
assert.match(actionCenter, /One next best action/);
assert.match(actionCenter, /View FIND → QUALIFY → MOVE engine status/);
assert.match(workflow, /npm run test:b13/);
assert.match(packageJson, /"test:b13"/);

console.log("B13 Dashboard Orchestration frontend contract: PASS");
