"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ReviewTask = Record<string, any>;
type TrustedSource = Record<string, any>;

type SourceResponse = {
  ok: boolean;
  source?: TrustedSource;
  trusted_source?: TrustedSource;
};

const sourceStatuses = ["active", "watching", "needs_review", "retired"];
const sourceTypes = ["government", "embassy", "visa_center", "university", "scholarship_body", "insurance", "courier", "news", "partner", "other"];
const reliabilityLevels = ["high", "medium", "low"];
const reviewTaskStatuses = ["open", "in_progress", "approved", "rejected", "dismissed"];
const reviewTaskPriorities = ["low", "medium", "high", "urgent"];

function adminHeaders(adminKey: string) {
  return { "X-MoveReady-Admin-Key": adminKey };
}

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminReviewTasks() {
  const [adminKey, setAdminKey] = useState("");
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [sources, setSources] = useState<TrustedSource[]>([]);
  const [createdSource, setCreatedSource] = useState<TrustedSource | null>(null);
  const [taskStatusFilter, setTaskStatusFilter] = useState("");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("");
  const [sourceStatusFilter, setSourceStatusFilter] = useState("");
  const [sourceReliabilityFilter, setSourceReliabilityFilter] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");
  const [status, setStatus] = useState("Enter admin key to load review tasks or add a trusted source.");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // ignore storage failure
    }
  }, []);

  const taskCounts = useMemo(() => tasks.reduce<Record<string, number>>((acc, task) => {
    const key = task.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}), [tasks]);

  const sourceCounts = useMemo(() => sources.reduce<Record<string, number>>((acc, source) => {
    const key = source.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}), [sources]);

  function persistAdminKey() {
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
    } catch {
      // ignore storage failure
    }
  }

  async function loadTasks() {
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }
    setStatus("Loading review tasks...");
    try {
      persistAdminKey();
      const data = await apiJson<{ review_tasks: ReviewTask[] }>("admin/review-tasks", {
        query: {
          status: taskStatusFilter || undefined,
          priority: taskPriorityFilter || undefined,
          limit: 75,
        },
        headers: adminHeaders(adminKey.trim()),
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setTasks(data.review_tasks || []);
      setStatus(data.review_tasks?.length ? "Review tasks loaded." : "No review tasks found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setStatus(apiError?.status === 401 ? "Admin key rejected." : "Unable to load review tasks. Check admin key and backend deployment.");
    }
  }

  async function loadSources(reviewDue = false) {
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }
    setStatus("Loading trusted sources...");
    try {
      persistAdminKey();
      const data = await apiJson<{ trusted_sources: TrustedSource[] }>("admin/trusted-sources", {
        query: {
          status: sourceStatusFilter || undefined,
          reliability_level: sourceReliabilityFilter || undefined,
          q: sourceSearch || undefined,
          review_due: reviewDue || undefined,
          limit: 75,
        },
        headers: adminHeaders(adminKey.trim()),
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setSources(data.trusted_sources || []);
      setStatus(data.trusted_sources?.length ? "Trusted sources loaded." : "No trusted sources found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setStatus(apiError?.status === 401 ? "Admin key rejected." : "Unable to load trusted sources. Redeploy backend if this endpoint is not live yet.");
    }
  }

  async function updateTask(taskId: string, payload: Record<string, any>) {
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }
    setStatus("Updating review task...");
    try {
      const data = await apiJson<{ review_task: ReviewTask }>(`admin/review-tasks/${taskId}`, {
        method: "PATCH",
        body: payload,
        headers: adminHeaders(adminKey.trim()),
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setTasks((rows) => rows.map((task) => (task.id === taskId ? data.review_task : task)));
      setStatus("Review task updated.");
    } catch {
      setStatus("Unable to update review task. Confirm backend has redeployed.");
    }
  }

  async function updateSource(sourceId: string, payload: Record<string, any>) {
    if (!adminKey.trim()) {
      setStatus("Admin key is required.");
      return;
    }
    setStatus("Updating trusted source...");
    try {
      const data = await apiJson<{ trusted_source: TrustedSource }>(`admin/trusted-sources/${sourceId}`, {
        method: "PATCH",
        body: payload,
        headers: adminHeaders(adminKey.trim()),
        useAuthToken: false,
        timeoutMs: 15000,
      });
      setSources((rows) => rows.map((source) => (source.id === sourceId ? data.trusted_source : source)));
      setStatus("Trusted source updated.");
    } catch {
      setStatus("Unable to update trusted source. Confirm backend has redeployed.");
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
      review_frequency_days: Number(data.get("review_frequency_days") || 30),
      mark_checked: data.get("mark_checked") === "on",
      notes: String(data.get("notes") || "").trim(),
    };

    if (!payload.source_name || !payload.source_url) {
      setStatus("Source name and source URL are required.");
      return;
    }

    setStatus("Creating trusted source...");
    try {
      persistAdminKey();
      const response = await apiJson<SourceResponse>("admin/trusted-sources", {
        method: "POST",
        headers: adminHeaders(adminKey.trim()),
        body: payload,
        useAuthToken: false,
        timeoutMs: 15000,
      });
      const source = response.source || response.trusted_source || null;
      setCreatedSource(source);
      if (source) setSources((rows) => [source, ...rows]);
      setStatus("Trusted source saved.");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setStatus(apiError?.data?.details ? `Unable to create trusted source: ${apiError.data.details}` : "Unable to create trusted source. Check admin key, required fields, and backend deployment.");
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
        .source-review-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
        .source-list { display: grid; gap: 12px; }
        .source-card { border: 1px solid var(--line); border-radius: 8px; padding: 16px; background: #fff; }
        .source-card h3 { margin: 6px 0 8px; overflow-wrap: anywhere; }
        .source-card p { margin: 0; color: var(--muted); overflow-wrap: anywhere; }
        .source-meta { display: grid; gap: 6px; margin: 12px 0; color: var(--muted); }
        .json-result { margin: 0; max-height: 220px; overflow: auto; white-space: pre-wrap; font-size: 13px; line-height: 1.45; }
        .inline-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .status-button { border: 1px solid var(--line); background: #f7fafc; border-radius: 999px; padding: 9px 12px; cursor: pointer; font-weight: 800; color: var(--muted); }
        .status-button:disabled { opacity: 0.45; cursor: not-allowed; }
        @media (max-width: 1100px) { .source-review-grid { grid-template-columns: 1fr; } }
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
          <button className="btn primary" type="button" onClick={() => { loadTasks(); loadSources(); }}>Load review workspace</button>
        </div>
        <p className="form-status">{status}</p>
      </article>

      <div className="source-review-grid">
        <article className="card">
          <div className="section-heading-row">
            <div>
              <h3>Trusted sources</h3>
              <p>List official sources, filter review status, and mark sources checked after verification.</p>
            </div>
            <div className="badge-row">
              {sourceStatuses.map((item) => <span className="badge" key={item}>{item}: {sourceCounts[item] || 0}</span>)}
            </div>
          </div>
          <div className="admin-toolbar">
            <div className="field"><label>Status</label><select value={sourceStatusFilter} onChange={(event) => setSourceStatusFilter(event.target.value)}><option value="">All statuses</option>{sourceStatuses.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="field"><label>Reliability</label><select value={sourceReliabilityFilter} onChange={(event) => setSourceReliabilityFilter(event.target.value)}><option value="">All levels</option>{reliabilityLevels.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="field"><label>Search</label><input value={sourceSearch} onChange={(event) => setSourceSearch(event.target.value)} placeholder="Source, owner, or URL" /></div>
            <button className="btn primary" type="button" onClick={() => loadSources(false)}>Load sources</button>
            <button className="btn" type="button" onClick={() => loadSources(true)}>Review due</button>
          </div>
          <div className="source-list">
            {sources.length ? sources.map((source) => (
              <article className="source-card" key={source.id || source.source_url}>
                <span className="overline">{source.source_type || "source"}</span>
                <h3>{source.source_name || "Trusted source"}</h3>
                <p>{source.source_url}</p>
                <div className="badge-row">
                  <span className="badge">{source.status || "status not set"}</span>
                  <span className="badge">Reliability: {source.reliability_level || "not set"}</span>
                </div>
                <div className="source-meta">
                  <span><strong>Owner:</strong> {source.owner_organization || "Not set"}</span>
                  <span><strong>Last checked:</strong> {formatDate(source.last_checked_at)}</span>
                  <span><strong>Next review:</strong> {formatDate(source.next_review_due_at)}</span>
                </div>
                <div className="inline-actions">
                  <button className="status-button" type="button" onClick={() => updateSource(source.id, { mark_checked: true, status: "active", review_frequency_days: source.review_frequency_days || 30 })}>Mark checked</button>
                  <button className="status-button" type="button" onClick={() => updateSource(source.id, { status: "needs_review" })}>Needs review</button>
                  <button className="status-button" type="button" onClick={() => updateSource(source.id, { status: "watching" })}>Watching</button>
                  <button className="status-button" type="button" onClick={() => updateSource(source.id, { status: "retired" })}>Retire</button>
                </div>
              </article>
            )) : <p className="form-status">No loaded sources yet.</p>}
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
            <div className="field"><label>Source type</label><select name="source_type" defaultValue="government">{sourceTypes.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="field"><label>Reliability</label><select name="reliability_level" defaultValue="high">{reliabilityLevels.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="field"><label>Owner organization</label><input name="owner_organization" placeholder="Organization name" /></div>
            <div className="field"><label>Status</label><select name="status" defaultValue="active">{sourceStatuses.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
            <div className="field"><label>Review frequency</label><input name="review_frequency_days" type="number" min="1" max="365" defaultValue="30" /></div>
            <label className="checkbox-line"><input name="mark_checked" type="checkbox" defaultChecked /> Mark checked now</label>
          </div>
          <div className="field"><label>Notes</label><textarea name="notes" rows={4} placeholder="What this source controls and how often it should be reviewed." /></div>
          <button className="btn primary" type="submit">Save trusted source</button>
          {createdSource ? <pre className="json-result">{JSON.stringify(createdSource, null, 2)}</pre> : null}
        </form>
      </div>

      <article className="card">
        <div className="section-heading-row">
          <div>
            <h3>Review task queue</h3>
            <p>Source-change alerts and route review tasks should be cleared before promoting sensitive route guidance.</p>
          </div>
          <div className="badge-row">
            {reviewTaskStatuses.map((item) => <span className="badge" key={item}>{item}: {taskCounts[item] || 0}</span>)}
          </div>
        </div>
        <div className="admin-toolbar">
          <div className="field"><label>Status</label><select value={taskStatusFilter} onChange={(event) => setTaskStatusFilter(event.target.value)}><option value="">All statuses</option>{reviewTaskStatuses.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Priority</label><select value={taskPriorityFilter} onChange={(event) => setTaskPriorityFilter(event.target.value)}><option value="">All priorities</option>{reviewTaskPriorities.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
          <button className="btn primary" type="button" onClick={loadTasks}>Load tasks</button>
        </div>
        <div className="task-list">
          {tasks.length ? tasks.map((task) => (
            <div className="task-card" key={task.id || task.title || JSON.stringify(task)}>
              <h3>{task.title || task.task_title || task.review_type || "Review task"}</h3>
              <p>{task.description || task.summary || task.notes || "No task description provided."}</p>
              <div className="badge-row">
                {task.status ? <span className="badge">{task.status}</span> : null}
                {task.priority ? <span className="badge">Priority: {task.priority}</span> : null}
                {task.task_type ? <span className="badge">{task.task_type}</span> : null}
                {task.assigned_to ? <span className="badge">Assigned: {task.assigned_to}</span> : null}
              </div>
              <div className="inline-actions">
                {reviewTaskStatuses.map((item) => (
                  <button className="status-button" key={item} type="button" disabled={task.status === item} onClick={() => updateTask(task.id, { status: item })}>{item}</button>
                ))}
              </div>
            </div>
          )) : <p className="form-status">No loaded tasks yet.</p>}
        </div>
      </article>
    </div>
  );
}