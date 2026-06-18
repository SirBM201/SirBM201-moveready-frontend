"use client";

import { FormEvent, useState } from "react";

import { apiJson } from "@/lib/api";

type ReviewTask = Record<string, any>;

type SourceResponse = {
  ok: boolean;
  source?: Record<string, any>;
};

function adminHeaders(adminKey: string) {
  return { "X-MoveReady-Admin-Key": adminKey };
}

export default function AdminReviewTasks() {
  const [adminKey, setAdminKey] = useState("");
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [createdSource, setCreatedSource] = useState<Record<string, any> | null>(null);
  const [status, setStatus] = useState("Enter admin key to load review tasks or add a trusted source.");

  async function loadTasks() {
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }
    setStatus("Loading review tasks...");
    try {
      const data = await apiJson<{ review_tasks: ReviewTask[] }>("admin/review-tasks", {
        headers: adminHeaders(adminKey),
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setTasks(data.review_tasks || []);
      setStatus(data.review_tasks?.length ? "Review tasks loaded." : "No review tasks found.");
    } catch {
      setStatus("Unable to load review tasks. Check admin key and backend deployment.");
    }
  }

  async function createSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      source_name: String(data.get("source_name") || "").trim(),
      source_url: String(data.get("source_url") || "").trim(),
      source_type: String(data.get("source_type") || "government"),
      owner_organization: String(data.get("owner_organization") || "").trim(),
      reliability_level: String(data.get("reliability_level") || "high"),
      status: String(data.get("status") || "active"),
      notes: String(data.get("notes") || "").trim(),
    };

    if (!payload.source_name || !payload.source_url) {
      setStatus("Source name and source URL are required.");
      return;
    }

    setStatus("Creating trusted source...");
    try {
      const response = await apiJson<SourceResponse>("admin/trusted-sources", {
        method: "POST",
        headers: adminHeaders(adminKey),
        body: payload,
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setCreatedSource(response.source || null);
      setStatus("Trusted source saved.");
      form.reset();
    } catch {
      setStatus("Unable to create trusted source. Check admin key, required fields, and backend deployment.");
    }
  }

  return (
    <div className="readiness-grid">
      <style>{`
        .admin-review-layout { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 16px; align-items: start; }
        .admin-source-form { display: grid; gap: 14px; }
        .task-list { display: grid; gap: 12px; }
        .task-card { border: 1px solid var(--line); border-radius: 8px; padding: 16px; background: var(--panel); }
        .task-card h3 { margin: 0 0 8px; }
        .task-card p { margin: 0; color: var(--muted); line-height: 1.55; }
        .json-result { margin: 0; max-height: 340px; overflow: auto; white-space: pre-wrap; font-size: 13px; line-height: 1.45; }
        @media (max-width: 980px) { .admin-review-layout { grid-template-columns: 1fr; } }
      `}</style>

      <article className="card">
        <h3>Admin access</h3>
        <p>Use the protected admin key only in trusted environments. Do not share it publicly.</p>
        <div className="form-grid two-col">
          <div className="field">
            <label>Admin key</label>
            <input value={adminKey} onChange={(event) => setAdminKey(event.target.value)} type="password" placeholder="X-MoveReady-Admin-Key" />
          </div>
          <button className="btn primary" type="button" onClick={loadTasks}>Load review tasks</button>
        </div>
        <p className="form-status">{status}</p>
      </article>

      <div className="admin-review-layout">
        <article className="card">
          <h3>Review task queue</h3>
          <p>Source-change alerts and route review tasks should be cleared before promoting sensitive route guidance.</p>
          <div className="task-list">
            {tasks.length ? tasks.map((task) => (
              <div className="task-card" key={task.id || task.task_title || JSON.stringify(task)}>
                <h3>{task.task_title || task.title || task.review_type || "Review task"}</h3>
                <p>{task.description || task.summary || task.notes || "No task description provided."}</p>
                <div className="badge-row">
                  {task.status ? <span className="badge">{task.status}</span> : null}
                  {task.priority ? <span className="badge">Priority: {task.priority}</span> : null}
                  {task.country_code ? <span className="badge">{task.country_code}</span> : null}
                </div>
              </div>
            )) : <p className="form-status">No loaded tasks yet.</p>}
          </div>
        </article>

        <form className="interest-form admin-source-form" onSubmit={createSource}>
          <div>
            <span className="overline">Trusted source</span>
            <h3>Add source record</h3>
            <p>Add official source records for route facts, opportunity windows, document rules, or provider requirements.</p>
          </div>
          <div className="form-grid two-col">
            <div className="field"><label>Source name</label><input name="source_name" placeholder="Example: Finnish Immigration Service - D visa" /></div>
            <div className="field"><label>Source URL</label><input name="source_url" placeholder="https://..." /></div>
            <div className="field"><label>Source type</label><select name="source_type" defaultValue="government"><option value="government">Government</option><option value="embassy">Embassy</option><option value="institution">Institution</option><option value="provider">Provider</option><option value="other">Other</option></select></div>
            <div className="field"><label>Reliability</label><select name="reliability_level" defaultValue="high"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            <div className="field"><label>Owner organization</label><input name="owner_organization" placeholder="Organization name" /></div>
            <div className="field"><label>Status</label><select name="status" defaultValue="active"><option value="active">Active</option><option value="monitoring">Monitoring</option><option value="retired">Retired</option></select></div>
          </div>
          <div className="field"><label>Notes</label><textarea name="notes" rows={4} placeholder="What this source controls and how often it should be reviewed." /></div>
          <button className="btn primary" type="submit">Save trusted source</button>
          {createdSource ? <pre className="json-result">{JSON.stringify(createdSource, null, 2)}</pre> : null}
        </form>
      </div>
    </div>
  );
}
