import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [evidence, applications, links, evidencePage, applicationsPage, styles, workflow, packageJson] = await Promise.all([
  readFile(new URL("../components/EvidencePackWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/ApplicationCaseWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/ApplicationLinkChoices.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/evidence-pack/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/applications/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

for (const source of [evidence, applications, links]) {
  assert.match(source, /b12-v1/, "B12 workspaces must reject an older deployed contract");
  assert.match(source, /"loading"/);
  assert.match(source, /"signed_out"/);
  assert.match(source, /"error"/);
  assert.match(source, /aria-live="polite"/);
}

assert.match(evidence, /evidence\/documents/);
assert.match(evidence, /evidence\/packs/);
assert.match(evidence, /metadata only/i);
assert.match(evidence, /No file upload is needed/);
assert.match(evidence, /href="\/applications#application-links"/);
assert.match(evidence, /Use this pack in an application case/);

assert.match(links, /apiJson<LinkResponse>\("applications\/links"/);
assert.match(links, /response\.errors/);
assert.match(links, /Use in new case/);
assert.match(links, /Link to new case/);
assert.match(links, /id="application-links"/);

assert.match(applicationsPage, /ApplicationLinkChoices/);
assert.match(applicationsPage, /<ApplicationLinkChoices \/>/);
assert.match(applications, /Linked evidence pack/);
assert.match(applications, /readOnly/);
assert.match(applications, /you do not need to copy a private UUID/i);
assert.match(applications, /additional_documents_requested/);
assert.match(applications, /Record a short lifecycle event/);
assert.match(applications, /Save appointment\/deadline tasks/);
assert.match(applications, /No application case yet/);

assert.match(evidencePage, /B12 · DOCUMENTS → EVIDENCE/);
assert.match(applicationsPage, /B12 · PREPARE → APPLY/);
assert.match(styles, /\.b12-pack-field small/);
assert.match(workflow, /npm run test:b12/);
assert.match(packageJson, /"test:b12"/);

console.log("B12 Documents, Evidence and Applications frontend contract: PASS");
