"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type LinkOption = {
  id?: string;
  label?: string;
  status?: string;
  target_country?: string | null;
  route_category?: string | null;
  risk_level?: string | null;
  completeness_score?: number | null;
  application_stage?: string | null;
};

type LinkResponse = {
  ok: boolean;
  account_email?: string;
  profiles?: LinkOption[];
  saved_routes?: LinkOption[];
  evidence_packs?: LinkOption[];
  errors?: Record<string, string>;
  privacy_note?: string;
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function setInputValue(id: string, value?: string | null) {
  if (!value) return;
  const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!element) return;
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
  if (setter) setter.call(element, value);
  else element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

export default function ApplicationLinkChoices() {
  const [data, setData] = useState<LinkResponse | null>(null);
  const [message, setMessage] = useState("Sign in to load profiles, saved routes, and evidence packs you can link.");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Loading account-owned application links...");
    try {
      const response = await apiJson<LinkResponse>("applications/links", { timeoutMs: 20000 });
      setData(response);
      setMessage("Account-owned link choices loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setMessage(apiError?.status === 401 ? "Sign in to load private link choices." : apiError?.message || "Unable to load application link choices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function useSavedRoute(item: LinkOption) {
    setInputValue("case_target_country", item.target_country);
    setInputValue("case_route_category", item.route_category);
    setInputValue("case_route_name", item.label);
    setMessage(`Saved route “${item.label || "route"}” was applied to the new-case form. Review every field before saving.`);
    document.getElementById("application-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function useEvidencePack(item: LinkOption) {
    setInputValue("case_evidence_pack", item.id);
    setInputValue("case_target_country", item.target_country);
    setInputValue("case_route_category", item.route_category);
    setMessage(`Evidence pack ${item.label || "selected"} was linked to the new-case form. Confirm that it matches this route and application stage.`);
    document.getElementById("application-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const profiles = data?.profiles || [];
  const routes = data?.saved_routes || [];
  const packs = data?.evidence_packs || [];

  return (
    <section className="result-block soft">
      <div className="panel-heading">
        <div><p className="overline">Account-owned links</p><h2>Use a saved route or evidence pack</h2></div>
        <span className="status-dot">{data?.account_email ? "Verified" : "Sign in"}</span>
      </div>
      <p>{data?.privacy_note || "Only private account-owned identifiers and short labels are loaded. Raw documents and sensitive references are not exposed."}</p>
      <div className="actions"><button className="btn primary" type="button" disabled={loading} onClick={load}>{loading ? "Loading..." : "Refresh link choices"}</button><a className="btn" href="/saved-routes">Saved routes</a><a className="btn" href="/evidence-pack">Evidence packs</a></div>
      <p className="form-status">{message}</p>
      <div className="live-workspace">
        <article className="workflow-panel live-form">
          <p className="overline">Saved routes</p>
          <div className="mini-list">
            {routes.map((item) => <div key={item.id}><strong>{item.label}</strong><span>{item.target_country || "Country not set"} · {readable(item.route_category)} · {readable(item.status)}</span><div className="actions compact-actions"><button className="btn" type="button" onClick={() => useSavedRoute(item)}>Use in new case</button></div></div>)}
            {!routes.length ? <div><strong>No saved route choice</strong><span>Save a serious route first, or enter the case details manually.</span></div> : null}
          </div>
        </article>
        <article className="result-panel">
          <div className="result-block">
            <p className="overline">Evidence packs</p>
            <div className="mini-list">
              {packs.map((item) => <div key={item.id}><strong>{item.label}</strong><span>{item.target_country || "Country not set"} · {readable(item.route_category)} · {item.completeness_score ?? 0}% · risk {readable(item.risk_level)} · {readable(item.status)}</span><div className="actions compact-actions"><button className="btn" type="button" onClick={() => useEvidencePack(item)}>Link to new case</button></div></div>)}
              {!packs.length ? <div><strong>No evidence pack choice</strong><span>Generate a private evidence pack first, or create the application case without one.</span></div> : null}
            </div>
          </div>
        </article>
      </div>
      {profiles.length ? <p className="form-status">{profiles.length} verified profile{profiles.length === 1 ? "" : "s"} are available in Account Center. Application cases remain owned by the signed-in email even when no profile is linked.</p> : null}
    </section>
  );
}
