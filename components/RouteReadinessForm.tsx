"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { getActiveProfileId } from "@/lib/profileStorage";
import { readableLabel, sourceStatusLabel } from "@/lib/labels";

type ChecklistItem = {
  document_name: string;
  requirement_level: string;
  details: string;
};

type BudgetItem = {
  item_name: string;
  item_category: string;
  amount_min: number;
  amount_max: number;
  currency_code: string;
};

type ReportSection = {
  section_key: string;
  section_title: string;
  section_content: string;
};

type ResultState = {
  checklist?: ChecklistItem[];
  budget?: {
    currency: string;
    items: BudgetItem[];
    estimated_total_min: number;
    estimated_total_max: number;
    note: string;
  };
  report?: {
    report_ref: string;
    report_title: string;
    risk_level: string;
    source_status: string;
    source_confidence?: string;
    stored?: boolean;
    storage_note?: string;
    readiness_score?: number;
    readiness_level?: string;
    readiness_flags?: string[];
    sections: ReportSection[];
  };
};

type AccountProfile = {
  id?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  main_goal?: string | null;
  goal?: string | null;
  route_category?: string | null;
  available_funds_amount?: number | null;
  available_funds_currency?: string | null;
  family_members_count?: number | null;
  timeline_months?: number | null;
  has_previous_refusal?: boolean | null;
  preferred_contact_channel?: string | null;
  status?: string | null;
};

type AccountSummary = {
  ok: boolean;
  session?: {
    email?: string;
  };
  latest_profile?: AccountProfile | null;
  sections?: {
    profiles?: {
      rows?: AccountProfile[];
      count?: number;
    };
  };
};

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  preferred_contact_channel: "email",
  consent_to_contact: "false",
  goal: "startup",
  route_category: "startup",
  current_country: "Kuwait",
  target_country: "Estonia",
  available_funds_amount: "12000",
  available_funds_currency: "EUR",
  family_members_count: "0",
  timeline_months: "6",
  has_previous_refusal: "false",
};

const goalToRouteCategory: Record<string, string> = {
  startup: "startup",
  business: "startup",
  study: "study",
  scholarship: "study",
  work: "work",
  family: "family",
  visit: "visit",
  digital_nomad: "digital_nomad",
  relocation: "relocation",
};

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/route-checker";
  } catch {
    return "/route-checker";
  }
}

function scoreLabel(report?: ResultState["report"]) {
  if (!report) return "Not scored";
  if (typeof report.readiness_score === "number" && report.readiness_level) return `${report.readiness_score}/100 · ${readableLabel(report.readiness_level)}`;
  if (typeof report.readiness_score === "number") return `${report.readiness_score}/100`;
  return readableLabel(report.readiness_level, "Starter report");
}

function profileName(profile?: AccountProfile | null) {
  return profile?.full_name || profile?.email || profile?.phone || "Account profile";
}

function profileGoal(profile?: AccountProfile | null) {
  return profile?.main_goal || profile?.goal || profile?.route_category || "relocation";
}

function profileRouteText(profile?: AccountProfile | null) {
  if (!profile) return "No active profile loaded yet";
  const target = profile.target_country || "target country";
  const route = readableLabel(profile.route_category || profileGoal(profile), "route");
  return `${target} · ${route}`;
}

function chooseAccountProfile(data: AccountSummary) {
  const profiles = (data.sections?.profiles?.rows || []).filter((item) => item.status !== "closed");
  const backendActive = profiles.find((item) => item.status === "active");
  const activeId = getActiveProfileId();
  const browserActive = profiles.find((item) => item.id === activeId);
  return backendActive || browserActive || profiles[0] || data.latest_profile || null;
}

export default function RouteReadinessForm() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<ResultState | null>(null);
  const [status, setStatus] = useState("Step 1: check the details on the left. Step 2: tick the save box. Step 3: generate your report.");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [activeProfileId, setActiveProfileId] = useState("");
  const [activeProfileName, setActiveProfileName] = useState("");
  const [activeProfileRoute, setActiveProfileRoute] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  function updateField(name: string, value: string) {
    setForm((current) => {
      if (name === "goal") {
        return { ...current, goal: value, route_category: goalToRouteCategory[value] || current.route_category };
      }
      return { ...current, [name]: value };
    });
  }

  function applyProfile(profile: AccountProfile | null, emailFromSession = "") {
    if (!profile && !emailFromSession) return;
    const goal = profileGoal(profile);
    setActiveProfileId(profile?.id || "");
    setActiveProfileName(profile ? profileName(profile) : "");
    setActiveProfileRoute(profile ? profileRouteText(profile) : "");
    setForm((current) => ({
      ...current,
      full_name: profile?.full_name || current.full_name,
      email: emailFromSession || profile?.email || current.email,
      phone: profile?.phone || current.phone,
      preferred_contact_channel: profile?.preferred_contact_channel || current.preferred_contact_channel,
      current_country: profile?.current_country || current.current_country,
      target_country: profile?.target_country || current.target_country,
      goal: goal || current.goal,
      route_category: profile?.route_category || goalToRouteCategory[goal] || current.route_category,
      available_funds_amount: profile?.available_funds_amount !== undefined && profile?.available_funds_amount !== null ? String(profile.available_funds_amount) : current.available_funds_amount,
      available_funds_currency: profile?.available_funds_currency || current.available_funds_currency,
      family_members_count: profile?.family_members_count !== undefined && profile?.family_members_count !== null ? String(profile.family_members_count) : current.family_members_count,
      timeline_months: profile?.timeline_months !== undefined && profile?.timeline_months !== null ? String(profile.timeline_months) : current.timeline_months,
      has_previous_refusal: profile?.has_previous_refusal ? "true" : current.has_previous_refusal,
      consent_to_contact: emailFromSession || profile?.email || profile?.phone ? "true" : current.consent_to_contact,
    }));
  }

  async function loadAccountDefaults(showMessage = false) {
    setProfileLoading(true);
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 10000 });
      const email = data.session?.email || data.latest_profile?.email || "";
      const profile = chooseAccountProfile(data);
      setAccountEmail(email);
      applyProfile(profile, email);
      if (profile) {
        const routeText = profileRouteText(profile);
        setStatus(`${showMessage ? "Loaded" : "Using"} active profile: ${profileName(profile)} (${routeText}). Check the details, then generate a report.`);
      } else if (email) {
        setStatus("Signed in. Your account email has been added so the report can be saved and found later.");
      } else if (showMessage) {
        setStatus("No signed-in profile was found. Open My Account, choose a profile, then return here.");
      }
    } catch {
      if (showMessage) setStatus("Could not load your active profile. Please refresh or open My Account to confirm your profile.");
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    loadAccountDefaults(false);
  }, []);

  function downloadReport() {
    if (!result?.report) return;
    const payload = {
      exported_at: new Date().toISOString(),
      input: form,
      checklist: result.checklist || [],
      budget: result.budget || null,
      report: result.report,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.report.report_ref || "moveready-report"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    if (typeof window !== "undefined") window.print();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Generating checklist, budget estimate, and readiness report...");

    const contactConsent = form.consent_to_contact === "true";
    const payload = {
      ...form,
      full_name: contactConsent ? form.full_name : "",
      email: contactConsent ? form.email : "",
      phone: contactConsent ? form.phone : "",
      preferred_contact_channel: contactConsent ? form.preferred_contact_channel : "",
      consent_to_contact: contactConsent,
      available_funds_amount: Number(form.available_funds_amount || 0),
      family_members_count: Number(form.family_members_count || 0),
      timeline_months: Number(form.timeline_months || 0),
      has_previous_refusal: form.has_previous_refusal === "true",
      source_page: sourcePage(),
      metadata: {
        active_profile_id: activeProfileId || undefined,
        active_profile_name: activeProfileName || undefined,
        generated_from: "route_checker_active_profile",
      },
    };

    try {
      const [checklistResponse, budgetResponse, reportResponse] = await Promise.all([
        apiJson<{ checklist: ChecklistItem[] }>("relocation/checklist", { method: "POST", body: payload }),
        apiJson<{ currency: string; items: BudgetItem[]; estimated_total_min: number; estimated_total_max: number; note: string }>("relocation/budget-estimate", { method: "POST", body: payload }),
        apiJson<{ report: ResultState["report"] }>("relocation/reports", { method: "POST", body: payload }),
      ]);

      setResult({
        checklist: checklistResponse.checklist,
        budget: budgetResponse,
        report: reportResponse.report,
      });
      if (reportResponse.report?.stored) {
        setStatus(`Report generated and saved. Reference: ${reportResponse.report.report_ref}.`);
      } else {
        setStatus(`Report generated. Keep this reference: ${reportResponse.report?.report_ref || "not available"}.`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.message} (${err.status})`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to generate readiness plan.");
      }
      setStatus("Generation failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const reportRef = result?.report?.report_ref || "";

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={onSubmit}>
        <div className="panel-heading">
          <div>
            <p className="overline">Route checker</p>
            <h2>Check this route</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Signed in" : loading ? "Working" : "Ready"}</span>
        </div>

        {accountEmail ? (
          <div className="mini-list">
            <div>
              <strong>Signed in as {accountEmail}</strong>
              <span>{activeProfileName ? `Using active profile: ${activeProfileName} (${activeProfileRoute}).` : "No active profile loaded yet. Open My Account and choose one profile."}</span>
            </div>
          </div>
        ) : null}

        <div className="actions">
          <button className="btn" type="button" onClick={() => loadAccountDefaults(true)} disabled={profileLoading || loading}>
            {profileLoading ? "Loading profile..." : "Load my active profile"}
          </button>
          <a className="btn" href="/dashboard#profile-chooser">Choose profile in My Account</a>
        </div>

        <p className="form-status">Simple guide: choose your goal, country, funds, family count, then click the green button.</p>

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="full_name">Your name</label>
            <input id="full_name" value={form.full_name} onChange={(event) => updateField("full_name", event.target.value)} placeholder="Optional" />
          </div>

          <div className="field">
            <label htmlFor="email">Email to find this report later</label>
            <input id="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Optional" type="email" />
          </div>

          <div className="field">
            <label htmlFor="phone">WhatsApp / phone</label>
            <input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Optional" />
          </div>

          <div className="field">
            <label htmlFor="preferred_contact_channel">Best way to contact you</label>
            <select id="preferred_contact_channel" value={form.preferred_contact_channel} onChange={(event) => updateField("preferred_contact_channel", event.target.value)}>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="goal">Why do you want to move?</label>
            <select id="goal" value={form.goal} onChange={(event) => updateField("goal", event.target.value)}>
              <option value="startup">Startup founder</option>
              <option value="business">Business or entrepreneur</option>
              <option value="study">Study</option>
              <option value="scholarship">Scholarship</option>
              <option value="work">Work abroad</option>
              <option value="family">Family relocation</option>
              <option value="visit">Visitor route</option>
              <option value="digital_nomad">Digital nomad / remote work</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="route_category">Route type</label>
            <select id="route_category" value={form.route_category} onChange={(event) => updateField("route_category", event.target.value)}>
              <option value="startup">Startup / entrepreneur</option>
              <option value="study">Study / scholarship</option>
              <option value="work">Work</option>
              <option value="family">Family</option>
              <option value="visit">Visit</option>
              <option value="digital_nomad">Digital nomad</option>
              <option value="relocation">General relocation</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="current_country">Where are you now?</label>
            <input id="current_country" value={form.current_country} onChange={(event) => updateField("current_country", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="target_country">Where do you want to move?</label>
            <input id="target_country" value={form.target_country} onChange={(event) => updateField("target_country", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="available_funds_amount">Money available for the move</label>
            <input id="available_funds_amount" inputMode="decimal" value={form.available_funds_amount} onChange={(event) => updateField("available_funds_amount", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="available_funds_currency">Currency</label>
            <select id="available_funds_currency" value={form.available_funds_currency} onChange={(event) => updateField("available_funds_currency", event.target.value)}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="KWD">KWD</option>
              <option value="NGN">NGN</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="family_members_count">How many family members will join?</label>
            <input id="family_members_count" inputMode="numeric" value={form.family_members_count} onChange={(event) => updateField("family_members_count", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="timeline_months">When do you want to move? (months)</label>
            <input id="timeline_months" inputMode="numeric" value={form.timeline_months} onChange={(event) => updateField("timeline_months", event.target.value)} />
          </div>
        </div>

        <label className="checkbox-field" htmlFor="has_previous_refusal">
          <input id="has_previous_refusal" type="checkbox" checked={form.has_previous_refusal === "true"} onChange={(event) => updateField("has_previous_refusal", event.target.checked ? "true" : "false")} />
          <span>I have had a previous refusal or serious immigration issue.</span>
        </label>

        <label className="checkbox-field" htmlFor="report_contact_consent">
          <input id="report_contact_consent" type="checkbox" checked={form.consent_to_contact === "true"} onChange={(event) => updateField("consent_to_contact", event.target.checked ? "true" : "false")} />
          <span>Save my contact details with this report so I can find it later.</span>
        </label>

        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Check my route and save report"}
        </button>
        <p className="form-status">{status}</p>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      <section className="result-panel" aria-live="polite">
        {!result ? (
          <div className="empty-result">
            <p className="overline">What you will get</p>
            <h2>Your checklist, budget, and report will appear here.</h2>
            <p>MoveReady will show the documents to prepare, a starter budget range, risk level, report reference, and whether official source review is still needed.</p>
          </div>
        ) : (
          <div className="result-stack">
            {result.report ? (
              <article className="result-block featured">
                <div className="panel-heading">
                  <div>
                    <p className="overline">Readiness report</p>
                    <h2>{result.report.report_title}</h2>
                  </div>
                  <span className="status-dot">{scoreLabel(result.report)}</span>
                </div>
                <div className="badge-row">
                  <span className="badge">Reference: {result.report.report_ref}</span>
                  <span className="badge">Risk: {readableLabel(result.report.risk_level)}</span>
                  <span className="badge">Saved: {result.report.stored ? "yes" : "reference only"}</span>
                  <span className="badge">{sourceStatusLabel(result.report.source_status)}</span>
                </div>
                <div className="actions report-actions">
                  {reportRef ? <a className="btn primary" href={`/report-detail?ref=${encodeURIComponent(reportRef)}`}>Open report</a> : null}
                  <a className="btn" href="/my-reports">My reports</a>
                  <button className="btn" type="button" onClick={printReport}>Print report</button>
                  <button className="btn" type="button" onClick={downloadReport}>Download report data</button>
                </div>
                {result.report.storage_note ? <p className="note">{result.report.storage_note}</p> : null}
                <div className="mini-list">
                  {result.report.sections.map((section) => (
                    <div key={section.section_key}>
                      <strong>{section.section_title}</strong>
                      <span>{section.section_content}</span>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {result.budget ? (
              <article className="result-block">
                <p className="overline">Budget estimate</p>
                <h2>
                  {result.budget.currency} {result.budget.estimated_total_min.toLocaleString()} - {result.budget.estimated_total_max.toLocaleString()}
                </h2>
                <p>{result.budget.note}</p>
              </article>
            ) : null}

            {result.checklist ? (
              <article className="result-block">
                <p className="overline">Document checklist</p>
                <div className="mini-list">
                  {result.checklist.map((item) => (
                    <div key={item.document_name}>
                      <strong>{item.document_name}</strong>
                      <span>{readableLabel(item.requirement_level)}: {item.details}</span>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
