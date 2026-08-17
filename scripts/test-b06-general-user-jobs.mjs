import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [setup, dashboard, automation, profile, jobProfile, styles] = await Promise.all([
  readFile(new URL("../components/jobs/JobSetupWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/jobs/JobsDashboard.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/jobs/JobAutomationWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/jobs/JobProfileWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/jobProfile.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

for (const field of ["search_scope", "current_country", "work_authorized_countries"]) {
  assert.match(setup, new RegExp(`${field}:`), `guided setup must persist ${field}`);
  assert.match(profile, new RegExp(`${field}:`), `profile editor must persist ${field}`);
}

assert.doesNotMatch(setup, /jobs\/profile\/search-scope/, "guided setup must save the profile and scope atomically");
assert.doesNotMatch(profile, /jobs\/profile\/search-scope/, "profile editor must save the profile and scope atomically");

for (const scope of ["local", "international", "both"]) {
  assert.match(jobProfile, new RegExp(`value: "${scope}"`), `guided setup must expose ${scope} search`);
}

assert.match(setup, /does not prove citizenship, residence, or a right to work/i);
assert.match(setup, /Living in a country does not automatically prove work authorization/i);
assert.match(dashboard, /Career match \+ application viability/);
assert.match(dashboard, /application_viability_score/);
assert.match(automation, /search_contract/);
assert.match(automation, /application_priority/);
assert.match(automation, /No automatic submission/);
assert.match(automation, /I confirm that I personally completed and submitted/);
assert.match(styles, /@media \(max-width: 760px\)/);
assert.match(styles, /\.jobs-scope-choices/);
assert.match(styles, /\.jobs-scope-contract/);

console.log("B06 frontend contract: PASS");
