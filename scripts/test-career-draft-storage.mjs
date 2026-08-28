import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

const read = p => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const url = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const modelUrl = url(stripTypeScriptTypes(await read("lib/careerStudio.ts")));
const source = stripTypeScriptTypes(await read("lib/careerDraftStorage.ts")).replace('"./careerStudio"', JSON.stringify(modelUrl));
const { emptyCareerDocument } = await import(modelUrl);
const { careerDraftKey, readCareerDraft, saveCareerDraft } = await import(url(source));
const values = new Map();
globalThis.localStorage = {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
const a=careerDraftKey("profile-a"),b=careerDraftKey("profile-b");
assert.notEqual(a,b);
assert.equal(careerDraftKey(),null);
const draft={...emptyCareerDocument(),fullName:"Synthetic Test",truthConfirmed:true};
assert.equal(saveCareerDraft(a,draft),true);
assert.equal(readCareerDraft(a).fullName,"Synthetic Test");
assert.equal(readCareerDraft(a).truthConfirmed,false);
assert.equal(readCareerDraft(b),null);
values.set("moveready_career_studio_v1",JSON.stringify(draft));
assert.equal(readCareerDraft(b),null);
assert.ok(values.has("moveready_career_studio_v1"));
for(const bad of ["{", "null", "[]", JSON.stringify({...draft,experiences:null}),JSON.stringify({...draft,skills:[42]}),JSON.stringify({...draft,experiences:[{achievements:null}]})]){
 values.set(b,bad);assert.equal(readCareerDraft(b),null);
}
globalThis.localStorage={getItem(){throw Error("blocked")},setItem(){throw Error("quota")}};
assert.equal(readCareerDraft(a),null);
assert.equal(saveCareerDraft(a,draft),false);
console.log("Career draft isolation, malformed data and storage-failure tests: PASS");
