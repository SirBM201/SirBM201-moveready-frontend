"use client";

import { FormEvent, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  nationality?: string | null;
  residence_country?: string | null;
  target_country?: string | null;
  target_city?: string | null;
  main_goal: string;
  route_category?: string | null;
  timeline_months?: number | null;
  family_members_count?: number | null;
  available_funds_amount?: number | null;
  available_funds_currency?: string | null;
  education_level?: string | null;
  work_experience_years?: number | null;
  business_stage?: string | null;
  has_previous_refusal?: boolean;
  preferred_contact_channel?: string;
  readiness_snapshot?: {
    readiness_score?: number;
    readiness_level?: string;
    risk_flags?: string[];
    next_actions?: string[];
  };
  status?: string;
  created_at?: string;
};

type SavedRoute = {
  id: string;
  email?: string | null;
  phone?: string | null;
  saved_title?: string | null;
};

type GeneratedReport = {
  report_ref: string;
  report_title?: string;
  stored?: boolean;
};

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  current_country: "Kuwait",
  nationality: "",
  residence_country: "Kuwait",
  target_country: "Estonia",
  target_city: "",
  main_goal: "startup",
  route_category: "startup",
  timeline_months: "6",
  family_members_count: "0",
  available_funds_amount: "12000",
  available_funds_currency: "EUR",
  education_level: "",
  work_experience_years: "",
  business_stage: "mvp_or_early_traction",
  preferred_contact_channel: "email",
  notes: "",
};

const goalOptions = [
  { value: "startup", label: "Startup founder" },
  { value: "business", label: "Business or entrepreneur" },
  { value: "study", label: "Study" },
  { value: "scholarship", label: "Scholarship" },
  { value: "work", label: "Work" },
  { value: "digital_nomad", label: "Digital nomad / remote work" },
  { value: "family", label: "Family relocation" },
  { value: "visit", label: "Visit" },
  { value: "opportunity", label: "Lottery / ballot opportunity" },
  { value: "relocation", label: "General relocation" },
];

const routeOptions = [
  { value: "startup", label: "Startup / entrepreneur" },
  { value: "study", label: "Study / scholarship" },
  { value: "work", label: "Work" },
  { value: "digital_nomad", label: "Digital nomad" },
  { value: "family", label: "Family" },
  { value: "visit", label: "Visit" },
  { value: "relocation", label: "General relocation" },
];

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

function routeFromGoal(goal: string) {
  if (["startup", "business"].includes(goal)) return "startup";
  if (["study", "scholarship"].includes(goal)) return "study";
  if (goal === "work") return "work";
  if (goal === "digital_nomad") return "digital_nomad";
  if (goal === "family") return "family";
  if (goal === "visit") return "visit";
  return "relocation";
}

function readable(value?: string | null) {
  return (value || "").replace(/_/g, " ") || "Not selected";
}

function routeTitle(profile: Profile) {
  const target = profile.target_country || "Selected country";
  const route = readable(profile.route_category || profile.main_goal || "relocation route");
  return `${target} ${route} pathway`;
}

function countryCodeFor(target?: string | null) {
  const clean = String(target || "").trim().toLowerCase();
  if (clean === "estonia") return "EE";
  if (clean === "portugal") return "PT";
  if (clean === "canada") return "CA";
  if (clean === "finland") return "FI";
  return undefined;
}

export default function ProfileDashboard() {
  const [form, setForm] = useState(defaultForm);
  const [hasPreviousRefusal, setHasPreviousRefusal] = useState(false);
  const [consent, setConsent] = useState(false);
  const [lookupContact, setLookupContact] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestReportRef, setLatestReportRef] = useState("");
  const [message, setMessage] = useState("Create a profile or load one with the same email or phone you used before.");
  const [loading, setLoading] = useState(false);
  const [routeSaving, setRouteSaving] = useState(false);
  const [watchSaving, setWatchSaving] = useState(false);
  const [reportSaving, setReportSaving] = useState(false);
  const [serviceSaving, setServiceSaving] = useState(false);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateGoal(value: string) {
    setForm((current) => ({ ...current, main_goal: value, route_category: routeFromGoal(value) }));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) {
      setMessage("Enter an email or phone number so you can retrieve this profile later.");
      return;
    }
    if (!consent) {
      setMessage("Confirm contact consent before saving. MoveReady needs this before storing account actions.");
      return;
    }

    setLoading(true);
    setMessage("Saving your relocation profile...");
    try {
      const payload = {
        ...form,
        timeline_months: Number(form.timeline_months || 0),
        family_members_count: Number(form.family_members_count || 0),
        available_funds_amount: Number(form.available_funds_amount || 0),
        work_experience_years: form.work_experience_years ? Number(form.work_experience_years) : null,
        has_previous_refusal: hasPreviousRefusal,
        consent_to_contact: consent,
        source_page: sourcePage(),
      };
      const data = await apiJson<{ profile: Profile }>("profiles", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setProfile(data.profile);
      setLatestReportRef("");
      setLookupContact(data.profile.email || data.profile.phone || "");
      setMessage("Profile saved. Use the profile summary to generate a report, save the route, create an alert, or request support.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to save profile: ${apiError.data.error}` : "Unable to save profile right now.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    if (!lookupContact.trim()) {
      setMessage("Enter the email or phone used on the profile.");
      return;
    }
    setLoading(true);
    setMessage("Loading the latest matching profile...");
    try {
      const isEmail = lookupContact.includes("@");
      const data = await apiJson<{ profile: Profile }>("profiles", {
        query: isEmail ? { email: lookupContact.trim() } : { phone: lookupContact.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setProfile(data.profile);
      setLatestReportRef("");
      setMessage("Profile loaded. You can now continue from the profile summary.");
    } catch {
      setMessage("No matching profile found. Check the email or phone, or create a new profile.");
    } finally {
      setLoading(false);
    }
  }

  async function generateCurrentReport() {
    if (!profile) {
      setMessage("Save or load a profile before generating a readiness report.");
      return;
    }

    setReportSaving(true);
    setMessage("Generating readiness report for this profile...");
    try {
      const data = await apiJson<{ report: GeneratedReport }>("relocation/reports", {
        method: "POST",
        body: {
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          preferred_contact_channel: profile.preferred_contact_channel || "email",
          consent_to_contact: true,
          goal: profile.main_goal,
          main_goal: profile.main_goal,
          route_category: profile.route_category || profile.main_goal,
          current_country: profile.current_country,
          target_country: profile.target_country,
          available_funds_amount: Number(profile.available_funds_amount || 0),
          available_funds_currency: profile.available_funds_currency || "EUR",
          family_members_count: Number(profile.family_members_count || 0),
          timeline_months: Number(profile.timeline_months || 0),
          has_previous_refusal: Boolean(profile.has_previous_refusal),
          source_page: sourcePage(),
          metadata: {
            profile_id: profile.id,
            generated_from: "account_center_profile_summary",
          },
        },
        timeoutMs: 20000,
        useAuthToken: false,
      });
      const ref = data.report?.report_ref || "";
      setLatestReportRef(ref);
      setMessage(ref ? `Readiness report generated and saved. Reference: ${ref}.` : "Readiness report generated and saved.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to generate report: ${apiError.data.error}` : "Unable to generate readiness report.");
    } finally {
      setReportSaving(false);
    }
  }

  async function saveCurrentRoute() {
    if (!profile) {
      setMessage("Save or load a profile before saving a route.");
      return;
    }

    setRouteSaving(true);
    setMessage("Saving this route...");
    try {
      const data = await apiJson<{ saved_route: SavedRoute }>("saved-routes", {
        method: "POST",
        body: {
          save_type: "route",
          saved_title: routeTitle(profile),
          route_code: profile.route_category || profile.main_goal || "relocation",
          country_code: countryCodeFor(profile.target_country),
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          current_country: profile.current_country,
          target_country: profile.target_country,
          main_goal: profile.main_goal,
          route_category: profile.route_category,
          notes: "Saved from the MoveReady Account Center profile summary.",
          notify_on_changes: true,
          consent_to_contact: true,
          source_page: sourcePage(),
        },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setLookupContact(data.saved_route.email || data.saved_route.phone || lookupContact);
      setMessage("Route saved. Open Saved Routes when you want to review or generate a route-based report.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to save route: ${apiError.data.error}` : "Unable to save route.");
    } finally {
      setRouteSaving(false);
    }
  }

  async function createWatchlistAlert() {
    if (!profile) {
      setMessage("Save or load a profile before creating a watchlist alert.");
      return;
    }

    setWatchSaving(true);
    setMessage("Creating watchlist alert...");
    try {
      await apiJson("watchlist/subscriptions", {
        method: "POST",
        body: {
          watch_type: "route",
          watch_code: profile.route_category || profile.main_goal || "relocation",
          watch_title: routeTitle(profile),
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          preferred_channel: profile.preferred_contact_channel || "email",
          current_country: profile.current_country,
          target_country: profile.target_country,
          route_or_goal: profile.main_goal,
          alert_types: ["opens", "closing_soon", "eligibility_change", "document_change", "funds_change", "review_due"],
          consent_to_contact: true,
          source_page: sourcePage(),
        },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setMessage("Watchlist alert created. Open Watchlist to review alert details.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to create watchlist alert: ${apiError.data.error}` : "Unable to create watchlist alert.");
    } finally {
      setWatchSaving(false);
    }
  }

  async function requestExpertReview() {
    if (!profile) {
      setMessage("Save or load a profile before requesting service support.");
      return;
    }

    setServiceSaving(true);
    setMessage("Creating service request for review...");
    try {
      await apiJson("platform/service-interest", {
        method: "POST",
        body: {
          service_slug: "expert_review",
          service_title: "Expert or document review",
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          preferred_channel: profile.preferred_contact_channel || "email",
          current_country: profile.current_country,
          target_country: profile.target_country,
          route_or_goal: profile.route_category || profile.main_goal,
          message: `Please review my ${routeTitle(profile)} profile, readiness report, route evidence, funds plan, and risk flags before any provider handoff.`,
          consent_to_contact: true,
          source_page: sourcePage(),
          metadata: {
            profile_id: profile.id,
            requested_from: "account_center_profile_summary",
            trust_rule: "admin_review_before_provider_handoff",
          },
        },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setMessage("Service request saved for review. Open Service Requests to view it.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to create service request: ${apiError.data.error}` : "Unable to create service request.");
    } finally {
      setServiceSaving(false);
    }
  }

  const snapshot = profile?.readiness_snapshot || {};

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={saveProfile}>
        <div className="panel-heading">
          <div>
            <p className="overline">Relocation profile</p>
            <h2>Save your profile</h2>
          </div>
          <span className="status-dot">{profile ? "Saved" : "New"}</span>
        </div>
        <p className="form-status">Fill what you know now. You can create a starter profile first and improve the details later.</p>

        <div className="form-grid two-col">
          <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} placeholder="Your full name" /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="phone">WhatsApp / phone</label><input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+965 ..." /></div>
          <div className="field"><label htmlFor="preferred_contact_channel">Preferred contact</label><select id="preferred_contact_channel" value={form.preferred_contact_channel} onChange={(event) => update("preferred_contact_channel", event.target.value)}><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option><option value="phone">Phone</option></select></div>
          <div className="field"><label htmlFor="current_country">Current country</label><input id="current_country" value={form.current_country} onChange={(event) => update("current_country", event.target.value)} placeholder="Example: Kuwait" /></div>
          <div className="field"><label htmlFor="nationality">Nationality</label><input id="nationality" value={form.nationality} onChange={(event) => update("nationality", event.target.value)} placeholder="Example: Nigeria" /></div>
          <div className="field"><label htmlFor="residence_country">Residence country</label><input id="residence_country" value={form.residence_country} onChange={(event) => update("residence_country", event.target.value)} placeholder="Where you legally live now" /></div>
          <div className="field"><label htmlFor="target_country">Target country</label><input id="target_country" value={form.target_country} onChange={(event) => update("target_country", event.target.value)} placeholder="Example: Estonia" /></div>
          <div className="field"><label htmlFor="target_city">Target city</label><input id="target_city" value={form.target_city} onChange={(event) => update("target_city", event.target.value)} placeholder="Optional" /></div>
          <div className="field"><label htmlFor="main_goal">Main goal</label><select id="main_goal" value={form.main_goal} onChange={(event) => updateGoal(event.target.value)}>{goalOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
          <div className="field"><label htmlFor="route_category">Route category</label><select id="route_category" value={form.route_category} onChange={(event) => update("route_category", event.target.value)}>{routeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>
          <div className="field"><label htmlFor="timeline_months">Timeline in months</label><input id="timeline_months" inputMode="numeric" value={form.timeline_months} onChange={(event) => update("timeline_months", event.target.value)} /></div>
          <div className="field"><label htmlFor="family_members_count">Family members joining</label><input id="family_members_count" inputMode="numeric" value={form.family_members_count} onChange={(event) => update("family_members_count", event.target.value)} /></div>
          <div className="field"><label htmlFor="available_funds_amount">Available funds</label><input id="available_funds_amount" inputMode="decimal" value={form.available_funds_amount} onChange={(event) => update("available_funds_amount", event.target.value)} /></div>
          <div className="field"><label htmlFor="available_funds_currency">Currency</label><select id="available_funds_currency" value={form.available_funds_currency} onChange={(event) => update("available_funds_currency", event.target.value)}><option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="KWD">KWD</option><option value="NGN">NGN</option></select></div>
          <div className="field"><label htmlFor="education_level">Education level</label><input id="education_level" value={form.education_level} onChange={(event) => update("education_level", event.target.value)} placeholder="Example: BSc, OND, MSc" /></div>
          <div className="field"><label htmlFor="work_experience_years">Work experience years</label><input id="work_experience_years" inputMode="decimal" value={form.work_experience_years} onChange={(event) => update("work_experience_years", event.target.value)} /></div>
          <div className="field"><label htmlFor="business_stage">Business stage</label><select id="business_stage" value={form.business_stage} onChange={(event) => update("business_stage", event.target.value)}><option value="idea">Idea</option><option value="mvp_or_early_traction">MVP or early traction</option><option value="revenue">Revenue</option><option value="scaling">Scaling</option><option value="not_applicable">Not applicable</option></select></div>
          <div className="field"><label htmlFor="notes">Notes</label><input id="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Anything important about your route" /></div>
        </div>

        <label className="checkbox-field"><input type="checkbox" checked={hasPreviousRefusal} onChange={(event) => setHasPreviousRefusal(event.target.checked)} /><span>I have had a previous refusal</span></label>
        <label className="checkbox-field"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that MoveReady may contact me about this profile.</span></label>
        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Saving..." : "Save profile"}</button>
      </form>

      <section className="result-panel">
        <div className="result-stack">
          <article className="result-block featured">
            <p className="overline">Saved profile lookup</p>
            <h2>Continue from a saved profile</h2>
            <p>Enter the same email or phone used when the profile was saved.</p>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="lookup_contact">Email or phone</label><input id="lookup_contact" value={lookupContact} onChange={(event) => setLookupContact(event.target.value)} placeholder="you@example.com or +965..." /></div>
              <button className="btn primary" type="button" onClick={loadProfile} disabled={loading}>{loading ? "Loading..." : "Load profile"}</button>
            </div>
            <p className="form-status">{message}</p>
          </article>

          {profile ? (
            <article className="result-block">
              <div className="panel-heading">
                <div>
                  <p className="overline">Profile summary</p>
                  <h2>{profile.full_name || profile.email || profile.phone || "Saved profile"}</h2>
                </div>
                <span className="status-dot">Score: {snapshot.readiness_score ?? 0}</span>
              </div>
              <div className="badge-row">
                <span className="badge">Goal: {readable(profile.main_goal)}</span>
                <span className="badge">Target: {profile.target_country || "Not set"}</span>
                <span className="badge">Status: {profile.status || "new"}</span>
                <span className="badge">{readable(snapshot.readiness_level || "early_stage")}</span>
              </div>
              <div className="mini-list">
                <div><strong>Route</strong><span>{readable(profile.route_category)}</span></div>
                <div><strong>Funds</strong><span>{profile.available_funds_currency || ""} {(profile.available_funds_amount || 0).toLocaleString()}</span></div>
                <div><strong>Family members</strong><span>{profile.family_members_count || 0}</span></div>
                <div><strong>Risk flags</strong><span>{snapshot.risk_flags?.length ? snapshot.risk_flags.join(", ") : "No starter flags"}</span></div>
                {latestReportRef ? <div><strong>Latest report</strong><span>{latestReportRef}</span></div> : null}
              </div>
              <div className="actions">
                <button className="btn primary" type="button" onClick={generateCurrentReport} disabled={reportSaving}>{reportSaving ? "Generating report..." : "Generate readiness report"}</button>
                <button className="btn" type="button" onClick={saveCurrentRoute} disabled={routeSaving}>{routeSaving ? "Saving route..." : "Save route"}</button>
                <button className="btn" type="button" onClick={createWatchlistAlert} disabled={watchSaving}>{watchSaving ? "Creating alert..." : "Create watchlist alert"}</button>
                <button className="btn" type="button" onClick={requestExpertReview} disabled={serviceSaving}>{serviceSaving ? "Requesting support..." : "Request expert review"}</button>
                {latestReportRef ? <a className="btn" href={`/report-detail?ref=${encodeURIComponent(latestReportRef)}`}>Open latest report</a> : null}
                <a className="btn" href="/my-reports">My reports</a>
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  );
}
