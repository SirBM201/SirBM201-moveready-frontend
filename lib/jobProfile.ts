import type { JobProfile } from "@/lib/jobs";

export type JobSearchScope = "local" | "international" | "both";

export type JobProfileDraft = {
  display_name: string;
  headline: string;
  years_experience: string;
  education_level: string;
  current_employer: string;
  previous_employer: string;
  target_roles: string;
  skills: string;
  career_facts: string;
  search_scope: JobSearchScope;
  current_country: string;
  work_authorized_countries: string;
  primary_country: string;
  later_countries: string;
  preferred_provinces: string;
  work_authorization_status: string;
};

export const searchScopeChoices = [
  { value: "local" as const, label: "Local", help: "Find better opportunities in the country where I currently live or work." },
  { value: "international" as const, label: "International", help: "Find opportunities in other countries and check work authorization or sponsorship." },
  { value: "both" as const, label: "Both", help: "Show me strong local opportunities and realistic international opportunities together." },
];

export const workAuthorizationChoices = [
  { value: "citizen", label: "Citizen", help: "I am a citizen of the target country and can work there." },
  { value: "permanent_resident", label: "Permanent resident", help: "I already have permanent residence and can work there." },
  { value: "open_permit", label: "Open work permit", help: "I can work for different employers under my current permit." },
  { value: "employer_specific_permit", label: "Employer-specific permit", help: "My current permission is tied to one employer." },
  { value: "requires_sponsorship", label: "I need employer support", help: "I need an employer-supported visa, permit, or sponsorship route." },
  { value: "not_recorded", label: "I am not sure yet", help: "MoveReady will flag authorization questions that need verification before applying." },
];

export function emptyJobProfileDraft(): JobProfileDraft {
  return {
    display_name: "", headline: "", years_experience: "", education_level: "", current_employer: "", previous_employer: "",
    target_roles: "", skills: "", career_facts: "", search_scope: "both", current_country: "", work_authorized_countries: "",
    primary_country: "", later_countries: "", preferred_provinces: "", work_authorization_status: "not_recorded",
  };
}

export function founderJobProfileDraft(): JobProfileDraft {
  return {
    display_name: "Moses",
    headline: "Production Supervisor and PET Injection Moulding Specialist",
    years_experience: "19",
    education_level: "OND, Mechanical Engineering Technology",
    current_employer: "Genoa Plastic Industries",
    previous_employer: "Sonnex Packaging",
    target_roles: ["Production Supervisor", "Shift Supervisor", "PET Injection Moulding Specialist", "Injection Moulding Process Technician", "Manufacturing Production Lead"].join("\n"),
    skills: ["PET preforms", "Injection moulding", "Production supervision", "Process troubleshooting", "Husky", "SIPA", "Netstal", "Ferromatik", "Demark", "Sacmi", "Operator training", "Startup and restart optimization"].join("\n"),
    career_facts: "",
    search_scope: "both",
    current_country: "Kuwait",
    work_authorized_countries: "Kuwait",
    primary_country: "Canada",
    later_countries: ["Portugal", "Finland", "Germany", "Australia", "New Zealand"].join("\n"),
    preferred_provinces: ["Ontario", "Manitoba"].join("\n"),
    work_authorization_status: "requires_sponsorship",
  };
}

export function jobProfileListText(value?: string[]) { return (value || []).join("\n"); }

export function parseJobProfileList(value: string) {
  return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}

export function jobProfileToDraft(profile: JobProfile | null): JobProfileDraft {
  if (!profile) return emptyJobProfileDraft();
  return {
    display_name: profile.display_name || "", headline: profile.headline || "",
    years_experience: profile.years_experience === undefined ? "" : String(profile.years_experience),
    education_level: profile.education_level || "", current_employer: profile.current_employer || "", previous_employer: profile.previous_employer || "",
    target_roles: jobProfileListText(profile.target_roles), skills: jobProfileListText(profile.skills), career_facts: jobProfileListText(profile.career_facts),
    search_scope: profile.search_scope || "international", current_country: profile.current_country || "",
    work_authorized_countries: jobProfileListText(profile.work_authorized_countries), primary_country: profile.primary_country || "",
    later_countries: jobProfileListText(profile.later_countries), preferred_provinces: jobProfileListText(profile.preferred_provinces),
    work_authorization_status: profile.work_authorization_status || "not_recorded",
  };
}
