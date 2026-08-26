import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [studio, model, exports, styles, alignment, report, dashboard, applications] = await Promise.all([
  read("components/jobs/CareerStudio.tsx"),
  read("lib/careerStudio.ts"),
  read("lib/documentExport.ts"),
  read("components/jobs/CareerStudio.module.css"),
  read("lib/vacancyAlignment.ts"),
  read("components/jobs/VacancyAlignmentReport.tsx"),
  read("app/dashboard/page.tsx"),
  read("components/ApplicationCaseWorkspace.tsx"),
]);

assert.match(model, /documentReadiness/);
assert.match(model, /at least an email address or phone number/i);
assert.match(model, /evidence-based body of at least 45 words/i);
assert.match(model, /clear, evidence-based achievement/i);
assert.match(model, /isNoiseFragment/);
assert.match(studio, /Professional-readiness checklist complete/);
assert.match(studio, /exportBlocked/);
assert.match(studio, /Preparing PDF/);
assert.match(studio, /Preparing DOCX/);
assert.match(studio, /targetJobId/);
assert.match(studio, /Loaded the verified vacancy identity/);
assert.match(exports, /setCharSpace\(0\)/);
assert.match(exports, /pdfText/);
assert.match(exports, /word\/numbering\.xml/);
assert.match(exports, /w:numPr/);
assert.doesNotMatch(exports, /paragraph\(`• \$\{x\}`\)/);
assert.match(styles, /readinessBlocked/);
assert.match(alignment, /knownParts/);
assert.match(alignment, /unknown skills or responsibilities add no potential points/i);
assert.match(report, /Potential from recorded fields/);
assert.match(report, /Retry now/);
assert.match(report, /Tailor cover letter/);
assert.doesNotMatch(dashboard, /href="\/login">Sign in/);
assert.match(applications, /workspaceState === "signed_out" \?/);

console.log("LQ13 Career Studio launch-quality repair contract: PASS");
