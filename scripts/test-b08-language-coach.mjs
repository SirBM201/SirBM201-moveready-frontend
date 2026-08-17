import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [workspace, page, readiness, api, styles, workflow] = await Promise.all([
  readFile(new URL("../components/language/LanguageCoachWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/language-coach/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/launch-readiness/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/api.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
]);

assert.match(workspace, /language-coach\/options/);
assert.match(workspace, /contract_version !== "b07-v1"/);

for (const route of [
  "language-coach/profile",
  "language-coach/diagnostic",
  "language-coach/diagnostic/complete",
  "language-coach/adaptive-practice",
  "language-coach/daily-challenge",
  "language-coach/attempts",
  "language-coach/mistakes",
  "language-coach/review",
  "language-coach/progress",
  "language-coach/qualification-actions",
]) {
  assert.match(workspace, new RegExp(route.replaceAll("/", "\\/")), `B08 must use ${route}`);
}

assert.match(workspace, /\/login\?next=\/language-coach/);
assert.match(workspace, /verified MoveReady account/);
assert.match(workspace, /setAccess\("signed-out"\)/);

for (const allocation of [
  /english: 50, french: 50/,
  /english: 70, french: 30/,
  /english: 30, french: 70/,
]) {
  assert.match(workspace, allocation, "B08 must preserve the supported Both-language allocations");
}

assert.match(workspace, /response_seconds: responseSeconds/);
assert.match(workspace, /questionStartedAt/);
assert.match(workspace, /nextQuestions\.length < required/);
assert.match(workspace, /answer_key_policy/);
assert.match(workspace, /Answers and explanations remain hidden until your answer is recorded/);
assert.match(workspace, /content_origin === "official_released"/);
assert.match(workspace, /source_url\?\.startsWith\("https:\/\/"\)/);

const questionType = workspace.slice(workspace.indexOf("type Question ="), workspace.indexOf("type AttemptFeedback ="));
assert.doesNotMatch(questionType, /correct_answer|explanation/, "fetched questions must not contain answer keys");
assert.match(workspace, /feedback\.correct_answer/, "answer keys may be shown only from recorded-attempt feedback");

const savePlan = workspace.slice(workspace.indexOf("async function savePlan"), workspace.indexOf("async function loadOutcomeData"));
assert.doesNotMatch(savePlan, /diagnostic\s*:/, "the plan form must not self-award diagnostic placement");
assert.match(savePlan, /language_selection: choice/);
assert.match(savePlan, /targets/);

assert.match(workspace, /Mistakes Bank/);
assert.match(workspace, /Missing one day does not erase/);
assert.match(workspace, /not official IELTS, TEF, CLB, or NCLC results/i);
assert.match(workspace, /leaked, recalled, or reconstructed live exam content/i);

for (const tokenKey of ["moveready_access_token", "moveready_session_token"]) {
  assert.match(api, new RegExp(tokenKey), `API client must attach ${tokenKey}`);
}

assert.match(page, /Private IELTS General and TEF Canada preparation/);
assert.match(readiness, /Implemented after migration 039/);
assert.match(readiness, /migrations? through 039/i);
assert.match(styles, /\.language-shell/);
assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /\.language-answer-grid button:focus-visible/);
assert.match(workflow, /npm run test:b08/);

console.log("B08 Language Coach frontend contract: PASS");
