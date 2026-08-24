import assert from"node:assert/strict";import{readFile}from"node:fs/promises";const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const[client,ui,css,page,nav]=await Promise.all([read("lib/jobs/executionClient.ts"),read("components/jobs/ApplicationExecutionWorkspace.tsx"),read("components/jobs/ApplicationExecution.module.css"),read("app/jobs/execution/page.tsx"),read("components/jobs/JobsNav.tsx")]);
for(const path of ["readiness/materials","application-drafts","application-handoffs","application-lifecycles","application-followups","application-portfolio"])assert.match(client,new RegExp(path));
for(const action of ["reviewed","approved","opened","submitted_manual","withdrawn"])assert.match(client,new RegExp(action));
assert.match(client,/user_confirmed:true/);assert.match(ui,/I completed the employer submission myself/);assert.match(ui,/No automatic submission/);assert.match(ui,/employer evidence/);
assert.match(ui,/Bind active documents/);assert.match(ui,/Create application package/);assert.match(ui,/Prepare controlled handoff/);assert.match(ui,/Schedule follow-up/);
assert.match(css,/@media\(max-width:560px\)/);assert.match(page,/ApplicationExecutionWorkspace/);assert.match(nav,/Execution/);
console.log("LQ07 application execution and portfolio contract: PASS");
