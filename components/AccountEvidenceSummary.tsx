"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type EvidenceSection = {
  ok?: boolean;
  count?: number;
  error?: string;
};

type AccountEvidenceResponse = {
  ok: boolean;
  counts?: {
    evidence_documents?: number;
    evidence_packs?: number;
    application_cases?: number;
  };
  sections?: {
    evidence_documents?: EvidenceSection;
    evidence_packs?: EvidenceSection;
    application_cases?: EvidenceSection;
  };
};

type ActionResponse = {
  ok: boolean;
  action_count?: number;
  counts_by_priority?: {
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
  partial_errors?: Record<string, string>;
};

export default function AccountEvidenceSummary() {
  const [data, setData] = useState<AccountEvidenceResponse | null>(null);
  const [actions, setActions] = useState<ActionResponse | null>(null);
  const [message, setMessage] = useState("Checking private evidence and next actions...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Loading evidence, application, and Action Center counts...");
    try {
      const [summaryResponse, actionResponse] = await Promise.all([
        apiJson<AccountEvidenceResponse>("account/summary", { timeoutMs: 25000 }),
        apiJson<ActionResponse>("account/action-center", { query: { limit: 250 }, timeoutMs: 40000 }),
      ]);
      setData(summaryResponse);
      setActions(actionResponse);
      const documentsReady = summaryResponse.sections?.evidence_documents?.ok !== false;
      const packsReady = summaryResponse.sections?.evidence_packs?.ok !== false;
      const actionErrors = Object.keys(actionResponse.partial_errors || {}).length;
      setMessage(documentsReady && packsReady && actionErrors === 0
        ? "Evidence, applications, and ranked next actions are connected to this verified account."
        : "Some private sections are unavailable. Apply the required migrations through 030 and refresh after backend deployment.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setActions(null);
      setMessage(apiError?.status === 401
        ? "Sign in to see private evidence, applications, and next actions."
        : "Unable to load private evidence and Action Center counts yet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const documentCount = data?.counts?.evidence_documents ?? data?.sections?.evidence_documents?.count ?? 0;
  const packCount = data?.counts?.evidence_packs ?? data?.sections?.evidence_packs?.count ?? 0;
  const applicationCount = data?.counts?.application_cases ?? data?.sections?.application_cases?.count ?? 0;
  const criticalCount = actions?.counts_by_priority?.critical ?? 0;
  const highCount = actions?.counts_by_priority?.high ?? 0;
  const totalActions = actions?.action_count ?? 0;

  return (
    <article className="result-block soft">
      <div className="panel-heading">
        <div>
          <p className="overline">Private execution summary</p>
          <h3>Evidence, applications, and next actions</h3>
        </div>
        <span className="status-dot">Verified account</span>
      </div>
      <p>{message}</p>
      <div className="grid">
        <a className="card" href="/evidence-pack">
          <h3>{documentCount}</h3>
          <p><strong>Document metadata records</strong><br />No raw file or full document number is stored.</p>
        </a>
        <a className="card" href="/evidence-pack">
          <h3>{packCount}</h3>
          <p><strong>Evidence packs</strong><br />Route-specific completeness, expiry, and missing-item checks.</p>
        </a>
        <a className="card" href="/applications">
          <h3>{applicationCount}</h3>
          <p><strong>Application cases</strong><br />Stages, deadlines, official sources, events, fees, and decisions.</p>
        </a>
        <a className="card" href="/action-center">
          <h3>{totalActions}</h3>
          <p><strong>Ranked next actions</strong><br />{criticalCount} critical · {highCount} high priority.</p>
        </a>
      </div>
      <div className="actions">
        <a className="btn primary" href="/action-center">Open Action Center</a>
        <a className="btn" href="/evidence-pack">Evidence Center</a>
        <a className="btn" href="/applications">Application Center</a>
        <a className="btn" href="/source-health">Source health</a>
        <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh private summary"}</button>
      </div>
    </article>
  );
}
