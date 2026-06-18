"use client";

import { FormEvent, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type TimelineEvent = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  route_category?: string | null;
  event_type: string;
  event_title: string;
  event_notes?: string | null;
  due_date?: string | null;
  reminder_date?: string | null;
  priority: string;
  status: string;
  preferred_channel: string;
  created_at?: string;
};

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  current_country: "Kuwait",
  target_country: "Estonia",
  route_or_goal: "Estonia startup founder pathway",
  route_category: "startup",
  event_type: "document",
  event_title: "Prepare startup route documents",
  event_notes: "Collect passport, company evidence, founder profile, funds evidence, insurance notes, and any legalized documents.",
  due_date: "",
  reminder_date: "",
  priority: "high",
  preferred_channel: "email",
};

const eventTypes = ["task", "deadline", "appointment", "document", "payment", "travel", "result", "follow_up"];
const priorities = ["low", "medium", "high", "critical"];
const statuses = ["pending", "in_progress", "done", "cancelled", "archived"];
const channels = ["email", "whatsapp", "telegram", "phone", "in_app"];

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/timeline";
  } catch {
    return "/timeline";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "No date set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

export default function TimelinePlanner() {
  const [form, setForm] = useState(defaultForm);
  const [consent, setConsent] = useState(false);
  const [lookupContact, setLookupContact] = useState("");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [message, setMessage] = useState("Create an application timeline event or load existing events.");
  const [loading, setLoading] = useState(false);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) {
      setMessage("Enter an email or phone number.");
      return;
    }
    if (!form.event_title.trim()) {
      setMessage("Enter a timeline title.");
      return;
    }
    if (!consent) {
      setMessage("Confirm contact consent before saving.");
      return;
    }

    setLoading(true);
    setMessage("Saving timeline event...");
    try {
      const data = await apiJson<{ timeline_event: TimelineEvent }>("timeline", {
        method: "POST",
        body: { ...form, consent_to_contact: consent, source_page: sourcePage() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setEvents((current) => [data.timeline_event, ...current.filter((item) => item.id !== data.timeline_event.id)]);
      setLookupContact(data.timeline_event.email || data.timeline_event.phone || "");
      setMessage("Timeline event saved.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 503 ? "Unable to save timeline. Run SQL 010 and redeploy the backend." : "Unable to save timeline event.");
    } finally {
      setLoading(false);
    }
  }

  async function loadEvents() {
    const contact = lookupContact.trim();
    if (!contact) {
      setMessage("Enter the email or phone used for timeline events.");
      return;
    }

    setLoading(true);
    setMessage("Loading timeline...");
    try {
      const isEmail = contact.includes("@");
      const data = await apiJson<{ timeline_events: TimelineEvent[] }>("timeline", {
        query: isEmail ? { email: contact, limit: 75 } : { phone: contact, limit: 75 },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setEvents(data.timeline_events || []);
      setMessage(data.timeline_events?.length ? "Timeline loaded." : "No timeline events found.");
    } catch {
      setMessage("Unable to load timeline.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(item: TimelineEvent, status: string) {
    const contact = item.email || item.phone || lookupContact;
    if (!contact) {
      setMessage("Unable to update without the original contact.");
      return;
    }

    setLoading(true);
    try {
      const isEmail = contact.includes("@");
      const data = await apiJson<{ timeline_event: TimelineEvent }>(`timeline/${item.id}`, {
        method: "PATCH",
        body: { status, email: isEmail ? contact : undefined, phone: !isEmail ? contact : undefined },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setEvents((current) => current.map((event) => (event.id === item.id ? data.timeline_event : event)));
      setMessage("Timeline status updated.");
    } catch {
      setMessage("Unable to update timeline status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={saveEvent}>
        <div className="panel-heading">
          <div>
            <p className="overline">Timeline tracker</p>
            <h2>Add an application event</h2>
          </div>
          <span className="status-dot">Available</span>
        </div>

        <div className="form-grid two-col">
          <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></div>
          <div className="field"><label htmlFor="phone">WhatsApp / phone</label><input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></div>
          <div className="field"><label htmlFor="preferred_channel">Preferred reminder channel</label><select id="preferred_channel" value={form.preferred_channel} onChange={(event) => update("preferred_channel", event.target.value)}>{channels.map((channel) => <option key={channel} value={channel}>{channel}</option>)}</select></div>
          <div className="field"><label htmlFor="current_country">Current country</label><input id="current_country" value={form.current_country} onChange={(event) => update("current_country", event.target.value)} /></div>
          <div className="field"><label htmlFor="target_country">Target country</label><input id="target_country" value={form.target_country} onChange={(event) => update("target_country", event.target.value)} /></div>
          <div className="field"><label htmlFor="route_or_goal">Route or goal</label><input id="route_or_goal" value={form.route_or_goal} onChange={(event) => update("route_or_goal", event.target.value)} /></div>
          <div className="field"><label htmlFor="route_category">Route category</label><input id="route_category" value={form.route_category} onChange={(event) => update("route_category", event.target.value)} /></div>
          <div className="field"><label htmlFor="event_type">Event type</label><select id="event_type" value={form.event_type} onChange={(event) => update("event_type", event.target.value)}>{eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
          <div className="field"><label htmlFor="priority">Priority</label><select id="priority" value={form.priority} onChange={(event) => update("priority", event.target.value)}>{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></div>
          <div className="field"><label htmlFor="event_title">Event title</label><input id="event_title" value={form.event_title} onChange={(event) => update("event_title", event.target.value)} /></div>
          <div className="field"><label htmlFor="event_notes">Notes</label><input id="event_notes" value={form.event_notes} onChange={(event) => update("event_notes", event.target.value)} /></div>
          <div className="field"><label htmlFor="due_date">Due date</label><input id="due_date" type="date" value={form.due_date} onChange={(event) => update("due_date", event.target.value)} /></div>
          <div className="field"><label htmlFor="reminder_date">Reminder date</label><input id="reminder_date" type="date" value={form.reminder_date} onChange={(event) => update("reminder_date", event.target.value)} /></div>
        </div>

        <label className="checkbox-field"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that MoveReady may contact me about this timeline event.</span></label>
        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Saving..." : "Save timeline event"}</button>
        <p className="form-status">{message}</p>
      </form>

      <section className="result-panel">
        <article className="result-block featured">
          <p className="overline">Timeline lookup</p>
          <h2>Load application timeline</h2>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="lookup_contact">Email or phone</label><input id="lookup_contact" value={lookupContact} onChange={(event) => setLookupContact(event.target.value)} placeholder="you@example.com or +965..." /></div>
            <button className="btn primary" type="button" onClick={loadEvents} disabled={loading}>{loading ? "Loading..." : "Load timeline"}</button>
          </div>
        </article>

        {events.length ? (
          <div className="result-stack compact-stack">
            {events.map((item) => (
              <article className="result-block" key={item.id}>
                <div className="panel-heading">
                  <div>
                    <p className="overline">{item.event_type}</p>
                    <h2>{item.event_title}</h2>
                  </div>
                  <span className="status-dot">{item.status}</span>
                </div>
                <p>{item.event_notes || "No notes provided."}</p>
                <div className="badge-row">
                  <span className="badge">Due: {formatDate(item.due_date)}</span>
                  <span className="badge">Reminder: {formatDate(item.reminder_date)}</span>
                  <span className="badge">Priority: {item.priority}</span>
                  {item.target_country ? <span className="badge">Target: {item.target_country}</span> : null}
                </div>
                <div className="badge-row">
                  {statuses.map((status) => (
                    <button className="status-button" key={status} type="button" disabled={item.status === status || loading} onClick={() => updateStatus(item, status)}>{status}</button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
