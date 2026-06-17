"use client";

import { useState } from "react";

import { apiJson } from "@/lib/api";

type Result = Record<string, any> | null;

function ResultPanel({ title, result }: { title: string; result: Result }) {
  return (
    <article className="result-block">
      <h3>{title}</h3>
      {!result ? <p>Run a check to see results here.</p> : <pre className="json-result">{JSON.stringify(result, null, 2)}</pre>}
    </article>
  );
}

export default function ReadinessTools() {
  const [nameResult, setNameResult] = useState<Result>(null);
  const [documentResult, setDocumentResult] = useState<Result>(null);
  const [fundsResult, setFundsResult] = useState<Result>(null);
  const [refusalResult, setRefusalResult] = useState<Result>(null);
  const [status, setStatus] = useState("Ready.");

  async function runNameCheck(formData: FormData) {
    const records = [
      { label: "Passport", name: String(formData.get("passport_name") || "") },
      { label: "Certificate", name: String(formData.get("certificate_name") || "") },
      { label: "Bank statement", name: String(formData.get("bank_name") || "") },
    ];
    const data = await apiJson("readiness/name-consistency", { method: "POST", body: { records }, useAuthToken: false });
    setNameResult(data);
  }

  async function runDocumentCheck(formData: FormData) {
    const documents = String(formData.get("documents") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const data = await apiJson("readiness/document-readiness", {
      method: "POST",
      body: { route_category: String(formData.get("route_category") || "startup"), documents },
      useAuthToken: false,
    });
    setDocumentResult(data);
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
      },
      useAuthToken: false,
    });
    setFundsResult(data);
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
    const data = await apiJson("readiness/refusal-risk", { method: "POST", body: { indicators }, useAuthToken: false });
    setRefusalResult(data);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>, runner: (formData: FormData) => Promise<void>) {
    event.preventDefault();
    setStatus("Running check...");
    try {
      await runner(new FormData(event.currentTarget));
      setStatus("Check completed.");
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
        .json-result { margin: 0; max-height: 360px; overflow: auto; white-space: pre-wrap; font-size: 13px; line-height: 1.5; color: var(--ink); }
        .check-list { display: grid; gap: 8px; color: var(--muted); }
        .check-list label { display: flex; gap: 8px; align-items: flex-start; }
        @media (max-width: 980px) { .tool-layout { grid-template-columns: 1fr; } }
      `}</style>

      <p className="form-status">{status}</p>

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
          <ResultPanel title="Name result" result={nameResult} />
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
          <ResultPanel title="Document result" result={documentResult} />
        </div>
      </article>

      <article className="tool-card">
        <div>
          <h3>Proof-of-funds planner</h3>
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
          <ResultPanel title="Funds result" result={fundsResult} />
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
          <ResultPanel title="Risk result" result={refusalResult} />
        </div>
      </article>
    </div>
  );
}
