import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [discovery,detail,presentation,css,page,workspace] = await Promise.all([
  read("components/jobs/VacancyDiscovery.tsx"), read("components/jobs/VacancyDetail.tsx"),
  read("lib/jobs/vacancyPresentation.ts"), read("components/jobs/VacancyJourney.module.css"),
  read("app/jobs/page.tsx"), read("app/jobs/workspace/page.tsx"),
]);
for (const signal of ["sourceView","vacancyFreshness","suitabilityView"]) assert.match(discovery,new RegExp(signal));
for (const field of ["first_seen_at","last_checked_at","last_seen_at","posted_at","expires_at"]) assert.match(presentation,new RegExp(field));
assert.match(detail,/jobsClient\.readiness\.(get|reconcile)/);
assert.match(detail,/No automatic submission/);
assert.match(detail,/Unknown.*sponsorship available/s);
assert.match(detail,/disabled=\{working\|\|fresh\.tone===["']closed["']\}/);
assert.match(css,/@media\(max-width:850px\)/);
assert.match(css,/min-height:44px/);
assert.match(page,/VacancyDiscovery/);
assert.match(workspace,/JobsDashboard/);
assert.doesNotMatch(discovery,/guarantee|guaranteed/i);
console.log("LQ03 vacancy discovery/detail journey contract: PASS");
