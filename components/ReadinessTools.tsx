"use client";

import { FormEvent, useState } from "react";

import { apiJson } from "@/lib/api";

type Result = Record<string, any> | null;
type ResultKind = "name" | "document" | "funds" | "refusal";

function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/readiness";
  } catch {
    return "/readiness";
  }
}

function readableStatus(value: any) {
  return String(value || "not checked").replace(/_/g, " ");
}

function ResultPanel({ title, result, kind }: { title: string; result: Result; kind: ResultKind }) {
  if (!result) {
    return (
      <article className="result-block soft">
        <p className="overline">Result</p>
        <h3>{title}</h3>
        <p>Run this check to see the result here in simple language.</p>
      </article>
    );
  }

  const risk = readableStatus(result.risk_level);
  const status = readableStatus(result.readiness_status);

  return (
    <article className="result-block featured">
      <div className="panel-heading">
        <div>
          <p className="overline">Result</p>
          <h3>{title}</h3>
        </div>
        <span className="status-dot">Risk: {risk}</span>
      </div>

      {result.summary ? <p>{result.summary}</p> : null}
      <div className="badge-row">
        <span className="badge">Readiness: {status}</span>
        {result.stored ? <span className="badge">Saved: yes</span> : <span className="badge">Saved: local/API result</span>}
      </div>

      {kind === "name" ? (
        <div className="mini-list">
          {(result.issues || []).length ? (
            result.issues.map((issue: any, index: number) => (
              <div key={index}>
                <strong>{issue.label || "Document"}: {issue.issue || "Name issue"}</strong>
                <span>{issue.suggestion || "Check the spelling, order, abbreviation, or supporting affidavit need."}</span>
              </div>
            ))
          ) : (
            <div><strong>No obvious name issue</strong><span>Still compare all documents against the exact official application checklist.</span></div>
          )}
        </div>
      ) : null}

      {kind === "document" ? (
        <div className="mini-list two-col-list">
          <div><strong>Missing required</strong><span>{(result.missing_required || []).length ? result.missing_required.join(", ") : "No required starter document gap detected."}</span></div>
          <div><strong>Recommended checks</strong><span>{(result.recommended_checks || []).length ? result.recommended_checks.join(", ") : "No extra recommended checks shown."}</span></div>
          <div><strong>Next action</strong><span>Compare this with the official checklist before paying or submitting.</span></div>
          <div><strong>Important</strong><span>{result.note || "Starter categories are not the final official document list."}</span></div>
        </div>
      ) : null}

      {kind === "funds" ? (
        <div className="mini-list two-col-list">
          <div><strong>Available funds</strong><span>{result.currency} {Number(result.available_funds || 0).toLocaleString()}</span></div>
          <div><strong>Planning requirement</strong><span>{result.currency} {Number(result.required_funds_adjusted || 0).toLocaleString()}</span></div>
          <div><strong>Shortfall</strong><span>{result.currency} {Number(result.shortfall || 0).toLocaleString()}</span></div>
          <div><strong>Monthly savings target</strong><span>{result.currency} {Number(result.monthly_savings_target || 0).toLocaleString()}</span></div>
          <div><strong>Warnings</strong><span>{(result.warnings || []).length ? result.warnings.join(" ") : "No major funds warning from the entered values."}</span></div>
          <div><strong>Important</strong><span>{result.note || "Use official proof-of-funds rules before applying."}</span></div>
        </div>
      ) : null}

      {kind === "refusal" ? (
        <div className="mini-list">
          {(result.findings || []).length ? (
            result.findings.map((finding: any, index: number) => (
              <div key={index}>
                <strong>{finding.indicator ? readableStatus(finding.indicator) : "Risk finding"}</strong>
                <span>{finding.issue}</span>
              </div>
            ))
          ) : (
            <div><strong>No selected risk indicator</strong><span>No risk box was ticked. Still review your full profile before applying.</span></div>
          )}
          <div><strong>Repair plan</strong><span>{(result.repair_plan || []).join(" ")}</span></div>
        </div>
      ) : null}
    </article>
  );
}

export default function ReadinessTools() {
  const [nameResult, setNameResult] = useState<Result>(null);
  const [documentResult, setDocumentResult] = useState<Result>(null);
  const [fundsResult, setFundsResult] = useState<Result>(null);
  const [refusalResult, setRefusalResult] = useState<Result>(null);
  const [status, setStatus] = useState("Ready. Choose one tool and click the green button.");

  async function runNameCheck(formData: FormData) {
    const records = [
      { label: "Passport", name: String(formData.get("passport_name") || "") },
      { label: "Certificate", name: String(formData.get("certificate_name") || "") },
      { label: "Bank statement", name: String(formData.get("bank_name") || "") },
    ];
    const data = await apiJson("readiness/name-consistency", { method: "POST", body: { records, source_page: sourcePage() }, useAuthToken: false });
    setNameResult(data as Result);
  }

  async function runDocumentCheck(formData: FormData) {
    const documents = String(formData.get("documents") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const data = await apiJson("readiness/document-readiness", {
      method: "POST",
      body: { route_category: String(formData.get("route_category") || "startup"), documents, source_page: sourcePage() },
      useAuthToken: false,
    });
    setDocumentResult(data as Result);
  }

  async function runFundsPlan(formData: FormData) {
    const data = await apiJson("readiness/funds-plan", {
      method: "POST",
      body: {
        available_funds_amount: Number(formData.get("available_funds_amount") || 0),
        required_funds_amount: Number(formData.get("required_funds_amount") || 0),
        target_timeline_months: Number(formData.get("target_timeline_months") || 1),
        family_members_count: Number(formData.get("family_members_count") || 0),
        currency: String(formData.get("currency") || "EUR"),
        recent_large_deposits: formData.get("recent_large_deposits") === "on",
        source_page: sourcePage(),
      },
      useAuthToken: false,
    });
    setFundsResult(data as Result);
  }

  async function runRefusalRisk(formData: FormData) {
    const indicators = {
      previous_refusal: formData.get("previous_refusal") === "on",
      low_funds: formData.get("low_funds") === "on",
      unclear_purpose: formData.get("unclear_purpose") === "on",
      weak_home_ties: formData.get("weak_home_ties") === "on",
      incomplete_documents: formData.get("incomplete_documents") === "on",
      unexplained_deposits: formData.get("unexplained_deposits") === "on",
      weak_business_plan: formData.get("weak_business_plan") === "on",
    };
    const data = await apiJson("readiness/refusal-risk", { method: "POST", body: { indicators, source_page: sourcePage() }, useAuthToken: false });
    setRefusalResult(data as Result);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>, runner: (formData: FormData) => Promise<void>) {
    event.preventDefault();
    setStatus("Running check...");
    try {
      await runner(new FormData(event.currentTarget));
      setStatus("Check completed. Read the result card before taking action.");
    } catch {
      setStatus("Unable to run this check. Confirm backend deployment is complete.");
    }
  }

  return (
    <div className="readiness-grid">
      <style>{`
        .readiness-grid { display: grid; gap: 16px; }
        .tool-card { display: grid; gap: 16px; padding: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: var(--shadow); }
        .tool-card h3 { margin: 0; font-size: 24px; }
        .tool-card p { margin: 0; color: var(--muted); line-height: 1.6; }
        .tool-layout { display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); gap: 16px; align-items: start; }
        .check-list { display: grid; gap: 8px; color: var(--muted); }
        .check-list label { display: flex; gap: 8px; align-items: flex-start; }
        @media (max-width: 980px) { .tool-layout { grid-template-columns: 1fr; } }
      `}</style>

      <article className="result-block soft">
        <div className="panel-heading">
          <div>
            <p className="overline">Simple readiness tools</p>
            <h2>Use these before paying or submitting.</h2>
          </div>
          <span className="status-dot">No guarantee</span>
        </div>
        <p className="form-status">{status}</p>
        <div className="badge-row">
          <span className="badge">Names</span>
          <span className="badge">Documents</span>
          <span className="badge">Funds</span>
          <span className="badge">Refusal risk</span>
        </div>
      </article>

      <article className="tool-card">
        <div>
          <h3>Name consistency checker</h3>
          <p>Compare names across passport, certificate, and bank evidence before submission.</p>
        </div>
        <div className="tool-layout">
          <form className="form-grid" onSubmit={(event) => handleSubmit(event, runNameCheck)}>
            <div className="field"><label>Passport name</label><input name="passport_name" placeholder="Full name on passport" /></div>
            <div className="field"><label>Certificate name</label><input name="certificate_name" placeholder="Full name on certificate" /></div>
            <div className="field"><label>Bank statement name</label><input name="bank_name" placeholder="Full name on bank statement" /></div>
            <button className="btn primary" type="submit">Check names</button>
          </form>
          <ResultPanel title="Name result" result={nameResult} kind="name" />
        </div>
      </article>

      <article className="tool-card">
        <div>
          <h3>Document readiness checker</h3>
          <p>Check broad required and recommended document categories for the selected route type.</p>
        </div>
        <div className="tool-layout">
          <form className="form-grid" onSubmit={(event) => handleSubmit(event, runDocumentCheck)}>
            <div className="field"><label>Route category</label><select name="route_category" defaultValue="startup"><option value="startup">Startup</option><option value="study">Study</option><option value="family">Family</option><option value="work">Work</option><option value="visitor">Visitor</option></select></div>
            <div className="field"><label>Documents you have</label><textarea name="documents" rows={4} placeholder="passport, proof of funds, purpose evidence, business plan" /></div>
            <button className="btn primary" type="submit">Check documents</button>
          </form>
          <ResultPanel title="Document result" result={documentResult} kind="document" />
        </div>
      </article>

      <article className="tool-card">
        <div>
          <h3>Proof-of-funds and budget planner</h3>
          <p>Estimate shortfall, monthly savings target, family adjustment, and large-deposit risk.</p>
        </div>
        <div className="tool-layout">
          <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, runFundsPlan)}>
            <div className="field"><label>Available funds</label><input name="available_funds_amount" type="number" defaultValue="12000" /></div>
            <div className="field"><label>Required funds</label><input name="required_funds_amount" type="number" defaultValue="15000" /></div>
            <div className="field"><label>Timeline months</label><input name="target_timeline_months" type="number" defaultValue="6" /></div>
            <div className="field"><label>Family members</label><input name="family_members_count" type="number" defaultValue="0" /></div>
            <div className="field"><label>Currency</label><input name="currency" defaultValue="EUR" /></div>
            <label className="checkbox-field"><input name="recent_large_deposits" type="checkbox" />Recent large deposits</label>
            <button className="btn primary full" type="submit">Plan funds</button>
          </form>
          <ResultPanel title="Funds result" result={fundsResult} kind="funds" />
        </div>
      </article>

      <article className="tool-card">
        <div>
          <h3>Refusal risk screener</h3>
          <p>Screen common risk indicators without promising approval or refusal.</p>
        </div>
        <div className="tool-layout">
          <form className="form-grid" onSubmit={(event) => handleSubmit(event, runRefusalRisk)}>
            <div className="check-list">
              <label><input type="checkbox" name="previous_refusal" />Previous refusal</label>
              <label><input type="checkbox" name="low_funds" />Low funds</label>
              <label><input type="checkbox" name="unclear_purpose" />Unclear purpose</label>
              <label><input type="checkbox" name="weak_home_ties" />Weak home ties</label>
              <label><input type="checkbox" name="incomplete_documents" />Incomplete documents</label>
              <label><input type="checkbox" name="unexplained_deposits" />Unexplained deposits</label>
              <label><input type="checkbox" name="weak_business_plan" />Weak business plan</label>
            </div>
            <button className="btn primary" type="submit">Screen risk</button>
          </form>
          <ResultPanel title="Risk result" result={refusalResult} kind="refusal" />
        </div>
      </article>
    </div>
  );
}
