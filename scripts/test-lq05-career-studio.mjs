import assert from "node:assert/strict";import{readFile}from"node:fs/promises";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const [studio,model,exports,css,page,vault,nav]=await Promise.all([read("components/jobs/CareerStudio.tsx"),read("lib/careerStudio.ts"),read("lib/documentExport.ts"),read("components/jobs/CareerStudio.module.css"),read("app/jobs/career-studio/page.tsx"),read("components/jobs/ResumeVaultWorkspace.tsx"),read("components/jobs/JobsNav.tsx")]);
for(const section of ["summary","skills","experiences","education","certifications"])assert.match(model,new RegExp(section));
assert.match(model,/cover_letter/);assert.match(studio,/Live ATS-safe preview/);assert.match(studio,/truthConfirmed/);
assert.match(exports,/pdfBlob/);assert.match(exports,/docxBlob/);assert.match(exports,/application\/vnd\.openxmlformats/);assert.match(exports,/PROFESSIONAL EXPERIENCE/);
assert.match(studio,/jobs\/resume-vault/);assert.match(studio,/localStorage/);assert.match(studio,/application_priority_reasons|career_facts/);
assert.match(css,/@media\(max-width:560px\)/);assert.match(page,/CareerStudio/);assert.match(vault,/Career Studio/);assert.match(nav,/Career Studio/);
console.log("LQ05 Career Studio contract: PASS");
