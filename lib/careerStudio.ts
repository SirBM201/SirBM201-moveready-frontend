import type { JobProfile } from "./jobs";

export type Experience = { id: string; role: string; employer: string; location: string; start: string; end: string; achievements: string[] };
export type Education = { id: string; qualification: string; school: string; location: string; year: string };
export type CareerDocument = {
  kind: "resume" | "cover_letter"; template: "classic" | "compact"; title: string;
  fullName: string; headline: string; email: string; phone: string; location: string; linkedIn: string;
  summary: string; skills: string[]; experiences: Experience[]; education: Education[]; certifications: string[];
  recipient: string; company: string; jobTitle: string; letterOpening: string; letterBody: string; letterClosing: string;
  truthConfirmed: boolean; updatedAt: string;
};
export type ReadinessIssue = { field: string; message: string };

export const newId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `item-${Date.now()}-${Math.random()}`;
export const emptyCareerDocument = (): CareerDocument => ({kind:"resume",template:"classic",title:"My professional resume",fullName:"",headline:"",email:"",phone:"",location:"",linkedIn:"",summary:"",skills:[],experiences:[{id:newId(),role:"",employer:"",location:"",start:"",end:"",achievements:[""]}],education:[{id:newId(),qualification:"",school:"",location:"",year:""}],certifications:[],recipient:"Hiring Manager",company:"",jobTitle:"",letterOpening:"I am applying for the role described above.",letterBody:"",letterClosing:"Thank you for considering my application. I would welcome the opportunity to discuss how my verified experience can support your team.",truthConfirmed:false,updatedAt:new Date().toISOString()});
export const lines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
export const safeFilename = (value: string) => value.trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase() || "moveready-document";

const isNoiseFragment = (value: string) => /^(and|or|with|including|plus|also)$/i.test(value.trim());
const tidyFacts = (facts: string[] = []) => facts.map((fact) => fact.trim()).filter((fact) => fact && !isNoiseFragment(fact));

export function careerDocumentFromProfile(profile: JobProfile): CareerDocument {
  const base = emptyCareerDocument();
  return {...base,fullName:profile.display_name||"",headline:profile.headline||"",location:profile.current_country||"",summary:"",skills:tidyFacts(profile.skills),experiences:[{id:newId(),role:profile.headline||"",employer:profile.current_employer||"",location:profile.current_country||"",start:"",end:"Present",achievements:tidyFacts(profile.career_facts)}],education:[{id:newId(),qualification:profile.education_level||"",school:"",location:"",year:""}]};
}

const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const usableAchievement = (value: string) => wordCount(value) >= 5 && !isNoiseFragment(value);

export function documentReadiness(doc: CareerDocument): ReadinessIssue[] {
  const issues: ReadinessIssue[] = [];
  if (!doc.fullName.trim()) issues.push({field:"fullName",message:"Add your full name."});
  if (!doc.headline.trim()) issues.push({field:"headline",message:"Add a professional headline."});
  if (!doc.email.trim() && !doc.phone.trim()) issues.push({field:"contact",message:"Add at least an email address or phone number."});
  if (!doc.location.trim()) issues.push({field:"location",message:"Add your current location."});
  if (doc.kind === "cover_letter") {
    if (!doc.company.trim()) issues.push({field:"company",message:"Add the employer name so the letter is genuinely targeted."});
    if (!doc.jobTitle.trim()) issues.push({field:"jobTitle",message:"Add the exact job title."});
    if (wordCount(doc.letterOpening) < 8) issues.push({field:"letterOpening",message:"Write a specific opening of at least eight words."});
    if (wordCount(doc.letterBody) < 45) issues.push({field:"letterBody",message:"Add an evidence-based body of at least 45 words linking verified experience to the vacancy."});
    if (wordCount(doc.letterClosing) < 8) issues.push({field:"letterClosing",message:"Add a professional closing."});
    return issues;
  }
  if (wordCount(doc.summary) < 20) issues.push({field:"summary",message:"Write a focused professional summary of at least 20 words."});
  if (doc.skills.filter(Boolean).length < 3) issues.push({field:"skills",message:"Add at least three relevant core skills."});
  const positions = doc.experiences.filter((item) => item.role.trim() || item.employer.trim());
  if (!positions.length) issues.push({field:"experiences",message:"Add at least one position."});
  positions.forEach((item,index)=>{
    if (!item.role.trim() || !item.employer.trim()) issues.push({field:`experience-${index}`,message:`Complete the role and employer for position ${index+1}.`});
    if (!item.start.trim() || !item.end.trim()) issues.push({field:`experience-dates-${index}`,message:`Complete the start and end dates for position ${index+1}.`});
    if (!item.achievements.some(usableAchievement)) issues.push({field:`achievements-${index}`,message:`Add at least one clear, evidence-based achievement for position ${index+1}.`});
  });
  doc.education.filter((item)=>item.qualification.trim()||item.school.trim()).forEach((item,index)=>{
    if (!item.qualification.trim() || !item.school.trim()) issues.push({field:`education-${index}`,message:`Complete the qualification and school for education ${index+1}.`});
  });
  return issues;
}
