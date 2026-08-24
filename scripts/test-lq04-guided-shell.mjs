import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read=p=>readFile(new URL(`../${p}`,import.meta.url),"utf8");
const [guide,style,header,mobile,jobs,onboarding,relocation]=await Promise.all([
 read("components/LaunchJourneyGuide.tsx"),read("components/LaunchJourney.module.css"),read("components/SiteHeader.tsx"),
 read("components/MobileQuickNav.tsx"),read("components/jobs/JobsNav.tsx"),read("app/onboarding/page.tsx"),read("app/onboarding/relocation/page.tsx")
]);
for(const phase of ["FIND","QUALIFY","MOVE","SETTLE","GROW"])assert.match(guide,new RegExp(phase));
assert.match(guide,/jobsClient\.readiness\.list/);
assert.match(guide,/saved account records/);
assert.match(guide,/Sign in to save your progress/);
assert.match(guide,/Create your matching profile/);
assert.match(guide,/Find your first evidence-backed vacancy/);
assert.match(guide,/Review one vacancy before applying/);
assert.match(style,/@media\(max-width:560px\)/);
for(const label of ["Find","Qualify","Move","Settle","Grow","Dashboard"])assert.match(header,new RegExp(`label:\\s*"${label}"`));
assert.match(mobile,/Jobs/);assert.match(mobile,/Account/);
assert.match(jobs,/Discover/);assert.match(jobs,/Applications/);assert.match(jobs,/Readiness/);
assert.match(onboarding,/LaunchJourneyGuide/);assert.match(relocation,/GuidedOnboarding/);
console.log("LQ04 guided onboarding and product shell contract: PASS");
