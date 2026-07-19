export const ACTIVE_PROFILE_KEY = "moveready_active_profile_id";
export const ACTIVE_PROFILE_NAME_KEY = "moveready_active_profile_name";

export function getActiveProfileId() {
  try {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || "";
  } catch {
    return "";
  }
}

export function setActiveProfile(profileId: string, profileName?: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (profileId) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
      if (profileName) localStorage.setItem(ACTIVE_PROFILE_NAME_KEY, profileName);
      window.dispatchEvent(new CustomEvent("moveready-active-profile-changed", { detail: { profileId, profileName } }));
    }
  } catch {
    // Ignore storage failures so the app still works on restricted browsers.
  }
}

export function clearActiveProfile() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    localStorage.removeItem(ACTIVE_PROFILE_NAME_KEY);
    window.dispatchEvent(new CustomEvent("moveready-active-profile-changed", { detail: { profileId: "" } }));
  } catch {
    // Ignore storage failures.
  }
}
