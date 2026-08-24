import type{CareerDocument}from"./careerStudio";import type{JobLead}from"./jobs";
export type AlignmentBand="strong"|"competitive"|"developing"|"insufficient";
export type ScorePart={key:string;label:string;score:number;max:number;explanation:string};
export type SkillFinding={skill:string;state:"matched_with_evidence"|"mentioned_only"|"missing"|"unknown";evidence:string[]};
export type Improvement={priority:"critical"|"high"|"medium";title:string;detail:string;action:string};
export type AlignmentReport={score:number;band:AlignmentBand;parts:ScorePart[];skills:SkillFinding[];strengths:string[];gaps:string[];improvements:Improvement[];warnings:string[];workRightsBlockers:string[];before:{score:number;summary:string};after:{potential:number;summary:string}};
const clean=(v:string)=>v.toLowerCase().replace(/[^a-z0-9+#. ]/g," ").replace(/\s+/g," ").trim();
const words=(v:string)=>new Set(clean(v).split(" ").filter(x=>x.length>2));
const overlap=(a:Set<string>,b:Set<string>)=>[...a].filter(x=>b.has(x));
const clamp=(n:number,max:number)=>Math.max(0,Math.min(max,Math.round(n)));
const candidateText=(d:CareerDocument)=>[d.headline,d.summary,...d.skills,...d.experiences.flatMap(e=>[e.role,e.employer,...e.achievements]),...d.education.flatMap(e=>[e.qualification,e.school]),...d.certifications].join(" ");
const evidenceText=(d:CareerDocument)=>d.experiences.flatMap(e=>e.achievements).join(" ");
const phrasePresent=(text:string,phrase:string)=>{const t=clean(text),p=clean(phrase);if(!p)return false;return t.includes(p)||overlap(words(t),words(p)).length>=Math.max(1,Math.ceil(words(p).size*.7));};
export function analyzeVacancyAlignment(job:JobLead,doc:CareerDocument):AlignmentReport{
 const candidate=candidateText(doc),evidence=evidenceText(doc),description=job.description_summary||"";
 const required=(job.skills||[]).map(x=>x.trim()).filter(Boolean);
 const skills:SkillFinding[]=required.map(skill=>{const mentioned=phrasePresent(candidate,skill),proved=phrasePresent(evidence,skill);return{skill,state:proved?"matched_with_evidence":mentioned?"mentioned_only":"missing",evidence:proved?doc.experiences.flatMap(e=>e.achievements.filter(a=>phrasePresent(a,skill))).slice(0,2):[]};});
 const matched=skills.filter(x=>x.state==="matched_with_evidence").length,mentioned=skills.filter(x=>x.state==="mentioned_only").length;
 const skillScore=required.length?clamp(((matched+mentioned*.55)/required.length)*40,40):0;
 const candidateWords=words(candidate),responsibilityWords=words(description),shared=overlap(candidateWords,responsibilityWords);
 const responsibilityScore=description?clamp((shared.length/Math.max(8,Math.min(35,responsibilityWords.size)))*25,25):0;
 const titleShared=overlap(words(doc.headline+" "+doc.experiences.map(e=>e.role).join(" ")),words(job.job_title));
 const titleScore=job.job_title?clamp((titleShared.length/Math.max(1,words(job.job_title).size))*15,15):0;
 const achievements=doc.experiences.flatMap(e=>e.achievements).filter(Boolean),metricCount=achievements.filter(x=>/\b\d+(?:[.,]\d+)?%?\b/.test(x)).length;
 const evidenceScore=clamp((Math.min(achievements.length,4)/4)*6+(Math.min(metricCount,2)/2)*4,10);
 const summaryWords=doc.summary.trim().split(/\s+/).filter(Boolean).length;
 const readabilityScore=clamp((doc.fullName?2:0)+(doc.headline?2:0)+(summaryWords>=25&&summaryWords<=100?2:summaryWords?1:0)+(doc.experiences.some(e=>e.role&&e.employer)?2:0)+(doc.skills.length?2:0),10);
 const parts:ScorePart[]=[
  {key:"skills",label:"Skills alignment",score:skillScore,max:40,explanation:required.length?`${matched} evidenced, ${mentioned} mentioned and ${required.length-matched-mentioned} missing of ${required.length} recorded vacancy skills.`:"The vacancy has no structured skill list; this component remains unknown rather than inferred."},
  {key:"responsibilities",label:"Responsibilities and qualifications",score:responsibilityScore,max:25,explanation:description?`${shared.length} meaningful terms overlap with the recorded vacancy summary.`:"No vacancy summary is recorded, so responsibility comparison is incomplete."},
  {key:"title",label:"Title and seniority alignment",score:titleScore,max:15,explanation:titleShared.length?`Shared role language: ${titleShared.join(", ")}.`:"The résumé headline and experience titles do not clearly align with the vacancy title."},
  {key:"evidence",label:"Achievement evidence",score:evidenceScore,max:10,explanation:`${achievements.length} achievement statement(s), including ${metricCount} with a recorded number.`},
  {key:"readability",label:"Structure and readability",score:readabilityScore,max:10,explanation:"Checks presence and practical length of essential ATS-safe sections; it does not simulate an employer ATS."},
 ];
 const score=parts.reduce((n,p)=>n+p.score,0),band:AlignmentBand=score>=80?"strong":score>=65?"competitive":score>=45?"developing":"insufficient";
 const workRightsBlockers=[...(job.application_priority_reasons||job.viability_reasons||[])].filter(Boolean);
 if(job.work_authorization_requirement==="existing_required")workRightsBlockers.unshift("The vacancy requires existing work authorization; résumé similarity cannot override this requirement.");
 if(["not_available","not_verified"].includes(job.visa_sponsorship_status||""))workRightsBlockers.push("Sponsorship is unavailable or unverified in the recorded vacancy evidence.");
 const gaps:string[]=[];if(!required.length)gaps.push("Vacancy skills are not structured; confirm requirements on the original source.");skills.filter(x=>x.state==="missing").forEach(x=>gaps.push(`No résumé evidence found for ${x.skill}.`));if(!description)gaps.push("Vacancy responsibilities are missing from the recorded summary.");if(!doc.summary)gaps.push("Professional summary is empty.");if(!metricCount)gaps.push("Achievements do not currently include any confirmed measurable result.");
 const strengths=skills.filter(x=>x.state==="matched_with_evidence").map(x=>`${x.skill} is supported by an achievement statement.`);if(titleScore>=10)strengths.push("Role-title language aligns clearly.");if(readabilityScore>=8)strengths.push("Core sections use a readable single-column structure.");
 const improvements:Improvement[]=[];if(workRightsBlockers.length)improvements.push({priority:"critical",title:"Resolve application viability first",detail:workRightsBlockers[0],action:"Verify the original vacancy and your right-to-work evidence before tailoring."});skills.filter(x=>x.state==="missing").slice(0,4).forEach(x=>improvements.push({priority:"high",title:`Address ${x.skill} only if true`,detail:"The vacancy records this skill, but the résumé has no matching evidence.",action:"Add a specific experience bullet only when you can support it; otherwise leave it as a genuine gap."}));skills.filter(x=>x.state==="mentioned_only").slice(0,3).forEach(x=>improvements.push({priority:"medium",title:`Strengthen evidence for ${x.skill}`,detail:"The skill is listed but not demonstrated in an achievement.",action:"Connect it to a real task, scale, result or responsibility."}));if(!doc.summary)improvements.push({priority:"high",title:"Add a focused professional summary",detail:"The résumé does not explain role, experience and relevant strengths at the top.",action:"Write 3–5 factual lines tailored to the role."});if(!metricCount)improvements.push({priority:"medium",title:"Add verified scale or results",detail:"Specific numbers can make evidence clearer when they are true.",action:"Use confirmed production volume, team size, time, quality or cost figures—never estimates presented as facts."});
 const recoverable=parts.reduce((n,p)=>n+(p.max-p.score),0),potential=Math.min(100,score+Math.round(recoverable*.65));
 const warnings=["This alignment score is not an ATS pass probability, interview prediction or employment guarantee.","Keyword context matters. Repetition without evidence does not improve the evidence score.",...(!required.length||!description?["The vacancy record is incomplete; missing information remains unknown."]:[])];
 return{score,band,parts,skills,strengths,gaps,improvements,warnings,workRightsBlockers,before:{score,summary:`${gaps.length} gap(s) and ${workRightsBlockers.length} viability blocker(s) are currently visible.`},after:{potential,summary:"Potential after truthful improvements to recorded gaps; this is not a promised outcome."}};
}
