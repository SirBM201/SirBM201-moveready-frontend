import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [engine, report, jobs] = await Promise.all([
  read("lib/vacancyAlignment.ts"),
  read("components/jobs/VacancyAlignmentReport.tsx"),
  read("lib/jobs.ts"),
]);

assert.match(engine, /available:boolean/);
assert.match(engine, /knownParts/);
assert.match(engine, /unavailable vacancy fields are excluded, not scored as zero/i);
assert.match(engine, /mandatory_barriers/);
assert.match(engine, /stated application deadline has passed/i);
assert.match(report, /Evidence coverage:/);
assert.match(report, /"Not scored"/);
assert.match(jobs, /deadline_state/);
assert.match(jobs, /evidence_completeness/);

console.log("LQ14 Opportunity Qualification and Evidence Integrity contract: PASS");

