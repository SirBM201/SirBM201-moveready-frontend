import { emptyCareerDocument, type CareerDocument } from "./careerStudio";

// The profile id comes from the authenticated API, never from editable contact fields.
export function careerDraftKey(profileId?: string): string | null {
  return profileId ? `moveready_career_studio_v2:${encodeURIComponent(profileId)}` : null;
}

export function readCareerDraft(key: string | null): CareerDocument | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const base = emptyCareerDocument();
    const strings = Object.keys(base).filter(k => typeof base[k as keyof CareerDocument] === "string");
    if (strings.some(k => typeof value[k] !== "string")) return null;
    if (!["resume", "cover_letter"].includes(value.kind) || !["classic", "compact"].includes(value.template)) return null;
    for (const field of ["skills", "certifications"]) {
      if (!Array.isArray(value[field]) || value[field].some((x: unknown) => typeof x !== "string")) return null;
    }
    for (const [field, keys] of [["experiences", ["id", "role", "employer", "location", "start", "end"]], ["education", ["id", "qualification", "school", "location", "year"]]] as const) {
      if (!Array.isArray(value[field]) || value[field].some((x: Record<string, unknown>) => !x || keys.some(k => typeof x[k] !== "string"))) return null;
    }
    if (value.experiences.some((x: { achievements?: unknown }) => !Array.isArray(x.achievements) || x.achievements.some((a: unknown) => typeof a !== "string"))) return null;
    return { ...base, ...value, truthConfirmed: false };
  } catch { return null; }
}

export function saveCareerDraft(key: string | null, doc: CareerDocument): boolean {
  if (!key) return false;
  try { localStorage.setItem(key, JSON.stringify({ ...doc, truthConfirmed: false })); return true; }
  catch { return false; }
}
