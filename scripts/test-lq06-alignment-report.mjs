import assert from"node:assert/strict";import{readFile}from"node:fs/promises";const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const[engine,report,css,page,detail]=await Promise.all([read("lib/vacancyAlignment.ts"),read("components/jobs/VacancyAlignmentReport.tsx"),read("components/jobs/VacancyAlignment.module.css"),read("app/jobs/vacancies/[jobId]/alignment/page.tsx"),read("components/jobs/VacancyDetail.tsx")]);
for(const part of ["Skills alignment","Responsibilities and qualifications","Title and seniority alignment","Achievement evidence","Structure and readability"])assert.match(engine,new RegExp(part));
assert.match(engine,/not an ATS pass probability/);assert.match(engine,/résumé similarity cannot override/);assert.match(engine,/missing information remains unknown/);
assert.match(engine,/matched_with_evidence/);assert.match(engine,/mentioned_only/);assert.match(engine,/missing/);assert.match(engine,/potential after truthful improvements/i);
assert.match(report,/Before truthful improvements/);assert.match(report,/Prioritized improvements/);assert.match(report,/jobs\/vacancies\/\$\{encodeURIComponent\(jobId\)\}/);
assert.match(css,/@media\(max-width:560px\)/);assert.match(page,/VacancyAlignmentReport/);assert.match(detail,/alignment/);
console.log("LQ06 Vacancy Alignment Report contract: PASS");
