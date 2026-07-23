"use client";

import { FormEvent, useState } from "react";

import { apiJson } from "@/lib/api";


type StudyPlanResult = {
  ok?: boolean;
  stored?: boolean;
  risk_level?: string;
  readiness_status?: string;
  summary?: string;
  target_country?: string;
  desired_level?: string;
  desired_field?: string;
  qualification_field?: string;
  grade_band?: string;
  target_intake_date?: string | null;
  months_until_intake?: number | null;
  currency?: string;
  available_funds_amount?: number;
  estimated_annual_budget?: number | null;
  planning_funding_gap?: number | null;
  programme_strategy?: string[];
  warnings?: string[];
  stages?: Array<{ stage?: string; actions?: string[] }>;
  evidence_checklist?: string[];
  official_checks?: string[];
  safety_note?: string;
};


function readable(value: unknown) {
  return String(value || "not available").replace(/_/g, " ");
}


function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/study-planner";
  } catch {
    return "/study-planner";
  }
}


function money(value: unknown, currency?: string) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "Not available";
  return `${currency || ""} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`.trim();
}


export default function StudyAdmissionPlanner() {
  const [result, setResult] = useState<StudyPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter the applicant's academic, funding, intake, and family details.");

  async function runPlanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      current_country: String(data.get("current_country") || ""),
      nationality: String(data.get("nationality") || ""),
      target_country: String(data.get("target_country") || ""),
      desired_level: String(data.get("desired_level") || "masters"),
      highest_qualification: String(data.get("highest_qualification") || ""),
      qualification_field: String(data.get("qualification_field") || ""),
      graduation_year: Number(data.get("graduation_year") || 0),
      grade_band: String(data.get("grade_band") || "gpa_not_sure"),
      desired_field: String(data.get("desired_field") || ""),
      field_change: data.get("field_change") === "on",
      regulated_profession: data.get("regulated_profession") === "on",
      language_evidence: String(data.get("language_evidence") || "none"),
      work_experience_years: Number(data.get("work_experience_years") || 0),
      available_funds_amount: Number(data.get("available_funds_amount") || 0),
      annual_tuition_budget: Number(data.get("annual_tuition_budget") || 0),
      annual_living_budget: Number(data.get("annual_living_budget") || 0),
      currency: String(data.get("currency") || "EUR"),
      scholarship_required: data.get("scholarship_required") === "on",
      family_members_count: Number(data.get("family_members_count") || 0),
      prior_admission_refusal: data.get("prior_admission_refusal") === "on",
      prior_visa_refusal: data.get("prior_visa_refusal") === "on",
      target_intake_date: String(data.get("target_intake_date") || ""),
      source_page: sourcePage(),
    };

    setLoading(true);
    setMessage("Building a source-first admission and study-visa plan...");
    try {
      const response = await apiJson<StudyPlanResult>("education/study-plan", {
        method: "POST",
        body: payload,
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setResult(response);
      setMessage(response.stored ? "Study plan generated and connected to the verified account." : "Study plan generated. Sign in before running it again if you want account recovery.");
    } catch (error: any) {
      setResult(null);
      setMessage(error?.message || "The study planner could not run. Confirm the latest deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace" id="study-admission-planner">
      <form className="workflow-panel live-form" onSubmit={runPlanner}>
        <div className="panel-heading">
          <div>
            <p className="overline">Education pathway</p>
            <h2>Build an admission and study-visa preparation plan</h2>
          </div>
          <span className="status-dot">No guarantee</span>
        </div>
        <p>
          This planner evaluates preparation pressure. It does not recommend a guaranteed school, admission, scholarship, visa, job, professional licence, post-study work right, or permanent-residence outcome.
        </p>

        <div className="form-grid two-col">
          <div className="field"><label htmlFor="study_current_country">Current country</label><input id="study_current_country" name="current_country" placeholder="Example: Kuwait" /></div>
          <div className="field"><label htmlFor="study_nationality">Nationality</label><input id="study_nationality" name="nationality" placeholder="Example: Nigeria" /></div>
          <div className="field"><label htmlFor="study_target_country">Target country</label><input id="study_target_country" name="target_country" placeholder="Example: Finland" required /></div>
          <div className="field">
            <label htmlFor="desired_level">Desired study level</label>
            <select id="desired_level" name="desired_level" defaultValue="masters">
              <option value="foundation">Foundation</option>
              <option value="certificate">Certificate</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor</option>
              <option value="top_up_bachelor">Top-up bachelor</option>
              <option value="postgraduate_diploma">Postgraduate diploma</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
              <option value="professional_conversion">Professional conversion</option>
              <option value="healthcare_licensing">Healthcare or licensing route</option>
            </select>
          </div>
          <div className="field"><label htmlFor="highest_qualification">Highest qualification</label><input id="highest_qualification" name="highest_qualification" placeholder="Example: BSc Computer Science" required /></div>
          <div className="field"><label htmlFor="qualification_field">Previous field</label><input id="qualification_field" name="qualification_field" placeholder="Example: Computer Science" required /></div>
          <div className="field"><label htmlFor="graduation_year">Graduation year</label><input id="graduation_year" name="graduation_year" type="number" min="1950" max="2100" placeholder="2015" /></div>
          <div className="field">
            <label htmlFor="grade_band">Grade band</label>
            <select id="grade_band" name="grade_band" defaultValue="gpa_not_sure">
              <option value="distinction_or_first">Distinction or first class</option>
              <option value="upper_second_or_credit">Upper second or credit</option>
              <option value="lower_second">Lower second</option>
              <option value="third_class">Third class</option>
              <option value="pass">Pass</option>
              <option value="gpa_not_sure">GPA or equivalence not sure</option>
              <option value="not_applicable">Not applicable</option>
            </select>
          </div>
          <div className="field"><label htmlFor="desired_field">Desired field</label><input id="desired_field" name="desired_field" placeholder="Example: Public Health, Nursing, Business" required /></div>
          <div className="field">
            <label htmlFor="language_evidence">Language evidence</label>
            <select id="language_evidence" name="language_evidence" defaultValue="none">
              <option value="none">None yet</option>
              <option value="medium_of_instruction">Medium of instruction letter</option>
              <option value="ielts">IELTS</option>
              <option value="toefl">TOEFL</option>
              <option value="pte">PTE</option>
              <option value="duolingo">Duolingo English Test</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field"><label htmlFor="work_experience_years">Relevant work experience, years</label><input id="work_experience_years" name="work_experience_years" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label htmlFor="target_intake_date">Target intake date</label><input id="target_intake_date" name="target_intake_date" type="date" /></div>
          <div className="field"><label htmlFor="study_currency">Planning currency</label><input id="study_currency" name="currency" defaultValue="EUR" /></div>
          <div className="field"><label htmlFor="available_funds_amount">Available funds now</label><input id="available_funds_amount" name="available_funds_amount" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label htmlFor="annual_tuition_budget">Expected annual tuition</label><input id="annual_tuition_budget" name="annual_tuition_budget" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label htmlFor="annual_living_budget">Expected annual living budget</label><input id="annual_living_budget" name="annual_living_budget" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label htmlFor="family_members_count">Accompanying family members</label><input id="family_members_count" name="family_members_count" type="number" min="0" defaultValue="0" /></div>
        </div>

        <div className="check-grid">
          <label className="checkbox-field"><input name="field_change" type="checkbox" /><span>This is a significant change from the previous field of study.</span></label>
          <label className="checkbox-field"><input name="regulated_profession" type="checkbox" /><span>The desired career may require licensing or professional registration.</span></label>
          <label className="checkbox-field"><input name="scholarship_required" type="checkbox" /><span>The plan depends on a scholarship or major funding award.</span></label>
          <label className="checkbox-field"><input name="prior_admission_refusal" type="checkbox" /><span>There was a previous admission refusal.</span></label>
          <label className="checkbox-field"><input name="prior_visa_refusal" type="checkbox" /><span>There was a previous visa or permit refusal.</span></label>
        </div>

        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Building plan..." : "Build study plan"}</button>
        <p className="form-status">{message}</p>
      </form>

      <section className="result-panel" aria-live="polite">
        {result ? (
          <div className="result-stack">
            <article className="result-block featured">
              <div className="panel-heading">
                <div>
                  <p className="overline">Study readiness</p>
                  <h2>{readable(result.readiness_status)}</h2>
                </div>
                <span className="status-dot">Risk: {readable(result.risk_level)}</span>
              </div>
              <p>{result.summary}</p>
              <div className="badge-row">
                <span className="badge">Target: {result.target_country || "Not set"}</span>
                <span className="badge">Level: {readable(result.desired_level)}</span>
                <span className="badge">Field: {result.desired_field || "Not set"}</span>
                <span className="badge">Intake: {result.target_intake_date || "Not set"}</span>
                <span className="badge">Stored: {result.stored ? "verified account" : "result only"}</span>
              </div>
            </article>

            <article className="result-block soft">
              <p className="overline">Affordability screen</p>
              <div className="mini-list two-col-list">
                <div><strong>Available funds</strong><span>{money(result.available_funds_amount, result.currency)}</span></div>
                <div><strong>Entered annual budget</strong><span>{result.estimated_annual_budget ? money(result.estimated_annual_budget, result.currency) : "Not entered"}</span></div>
                <div><strong>Planning gap</strong><span>{result.planning_funding_gap !== null && result.planning_funding_gap !== undefined ? money(result.planning_funding_gap, result.currency) : "Budget not complete"}</span></div>
                <div><strong>Months until intake</strong><span>{result.months_until_intake ?? "Not set"}</span></div>
              </div>
            </article>

            <article className="result-block">
              <p className="overline">Programme strategy</p>
              <div className="mini-list">
                {(result.programme_strategy || []).map((item, index) => <div key={index}><strong>Strategy {index + 1}</strong><span>{item}</span></div>)}
              </div>
              {(result.warnings || []).length ? (
                <div className="mini-list" style={{ marginTop: 14 }}>
                  {(result.warnings || []).map((warning, index) => <div key={index}><strong>Warning {index + 1}</strong><span>{warning}</span></div>)}
                </div>
              ) : null}
            </article>

            {(result.stages || []).map((stage) => (
              <article className="result-block soft" key={stage.stage}>
                <p className="overline">Application stage</p>
                <h2>{stage.stage}</h2>
                <div className="mini-list">
                  {(stage.actions || []).map((action, index) => <div key={index}><strong>{index + 1}</strong><span>{action}</span></div>)}
                </div>
              </article>
            ))}

            <article className="result-block soft">
              <p className="overline">Evidence checklist</p>
              <div className="mini-list">
                {(result.evidence_checklist || []).map((item, index) => <div key={index}><strong>Evidence {index + 1}</strong><span>{item}</span></div>)}
              </div>
            </article>

            <article className="result-block featured">
              <p className="overline">Official checks</p>
              <div className="mini-list">
                {(result.official_checks || []).map((item, index) => <div key={index}><strong>Check {index + 1}</strong><span>{item}</span></div>)}
              </div>
              <p className="form-status">{result.safety_note}</p>
              <div className="actions">
                <a className="btn primary" href="/journey-plans">Open saved planning history</a>
                <a className="btn" href="/route-checker">Check study route</a>
                <a className="btn" href="/services?service=admission">Request admission support</a>
              </div>
            </article>
          </div>
        ) : (
          <article className="result-block featured">
            <p className="overline">What you will get</p>
            <h2>Academic fit, funding pressure, application stages, evidence, visa preparation, and family warnings.</h2>
            <p>MoveReady will not claim that a programme accepts the applicant until the institution's current official entry requirements are checked.</p>
          </article>
        )}
      </section>
    </div>
  );
}
