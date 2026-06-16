"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type Scholarship = {
  scholarship_name: string;
  provider_name?: string;
  scholarship_url?: string;
  deadline_date?: string | null;
  funding_type?: string;
  status?: string;
  summary?: string;
  last_verified_at?: string | null;
};

export default function LiveScholarshipList() {
  const [items, setItems] = useState<Scholarship[]>([]);
  const [status, setStatus] = useState("Loading scholarship records...");

  useEffect(() => {
    let cancelled = false;
    apiJson<{ scholarships: Scholarship[] }>("relocation/scholarships", { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        setItems(data.scholarships || []);
        setStatus(data.scholarships?.length ? "Live scholarship records" : "No scholarship records added yet");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Unable to load scholarships. Check backend URL/env if this continues.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="form-status">{status}</p>
      <div className="grid">
        {items.map((item) => (
          <article className="card" key={`${item.provider_name}-${item.scholarship_name}`}>
            <h3>{item.scholarship_name}</h3>
            <p>{item.summary || "Scholarship summary pending review."}</p>
            <div className="badge-row">
              {item.provider_name ? <span className="badge">{item.provider_name}</span> : null}
              {item.funding_type ? <span className="badge">{item.funding_type}</span> : null}
              {item.deadline_date ? <span className="badge">Deadline: {item.deadline_date}</span> : null}
              {item.status ? <span className="badge">{item.status}</span> : null}
            </div>
            {item.scholarship_url ? <a className="text-link" href={item.scholarship_url} target="_blank" rel="noreferrer">Official source</a> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
