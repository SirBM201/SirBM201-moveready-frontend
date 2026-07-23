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
  };
  sections?: {
    evidence_documents?: EvidenceSection;
    evidence_packs?: EvidenceSection;
  };
};

export default function AccountEvidenceSummary() {
  const [data, setData] = useState<AccountEvidenceResponse | null>(null);
  const [message, setMessage] = useState("Checking private evidence records...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Loading evidence inventory and pack counts...");
    try {
      const response = await apiJson<AccountEvidenceResponse>("account/summary", { timeoutMs: 20000 });
      setData(response);
      const documentsReady = response.sections?.evidence_documents?.ok !== false;
      const packsReady = response.sections?.evidence_packs?.ok !== false;
      setMessage(documentsReady && packsReady
        ? "Evidence records are connected to this verified account."
        : "Evidence storage is not fully available yet. Apply migration 027 and refresh.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setMessage(apiError?.status === 401 ? "Sign in to see private evidence records." : "Unable to load evidence counts yet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const documentCount = data?.counts?.evidence_documents ?? data?.sections?.evidence_documents?.count ?? 0;
  const packCount = data?.counts?.evidence_packs ?? data?.sections?.evidence_packs?.count ?? 0;

  return (
    <article className="result-block soft">
      <div className="panel-heading">
        <div>
          <p className="overline">Private evidence workspace</p>
          <h3>Documents and evidence packs</h3>
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
      </div>
      <div className="actions">
        <a className="btn primary" href="/evidence-pack">Open Evidence Center</a>
        <a className="btn" href="/source-health">Check source health</a>
        <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh evidence counts"}</button>
      </div>
    </article>
  );
}
