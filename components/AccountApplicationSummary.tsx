"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ApplicationCase = {
  case_ref?: string;
  case_title?: string;
  target_country?: string | null;
  application_stage?: string;
  status?: string;
  risk_level?: string;
  next_deadline_at?: string | null;
  source_status?: string;
};

type AccountSummary = {
  counts?: { application_cases?: number };
  sections?: { application_cases?: { ok?: boolean; count?: number; rows?: ApplicationCase[]; error?: string } };
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AccountApplicationSummary() {
  const [cases, setCases] = useState<ApplicationCase[]>([]);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Loading application cases...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 20000 });
      const section = data.sections?.application_cases;
      setCases(section?.rows || []);
      setCount(data.counts?.application_cases ?? section?.count ?? 0);
      setMessage(section?.ok === false ? "Application cases are not available until migration 028 is applied." : "Application case summary loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setCases([]);
      setCount(0);
      setMessage(apiError?.status === 401 ? "Sign in to see private application cases." : apiError?.message || "Unable to load application cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="result-block featured">
      <div className="panel-heading">
        <div><p className="overline">Application Center</p><h2>{count} active application case{count === 1 ? "" : "s"}</h2></div>
        <span className="status-dot">Verified account</span>
      </div>
      <p>Track routes, authorities, evidence packs, appointments, deadlines, fees, additional-document requests, source status, events, and decisions in one private workspace.</p>
      <div className="mini-list">
        {cases.slice(0, 5).map((item) => (
          <div key={item.case_ref}>
            <strong>{item.case_title || item.case_ref || "Application case"}</strong>
            <span>{item.target_country || "Country not set"} · {readable(item.application_stage)} · risk {readable(item.risk_level)} · source {readable(item.source_status)} · deadline {formatDate(item.next_deadline_at)}</span>
          </div>
        ))}
        {!cases.length ? <div><strong>No active case loaded</strong><span>Create a case after signing in and applying migration 028.</span></div> : null}
      </div>
      <div className="actions">
        <a className="btn primary" href="/applications">Open Application Center</a>
        <a className="btn" href="/evidence-pack">Evidence Center</a>
        <a className="btn" href="/timeline">Timeline</a>
        <button className="btn" type="button" disabled={loading} onClick={load}>{loading ? "Refreshing..." : "Refresh"}</button>
      </div>
      <p className="form-status">{message}</p>
    </section>
  );
}
