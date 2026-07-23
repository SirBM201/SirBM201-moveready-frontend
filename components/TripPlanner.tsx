"use client";

import { FormEvent, useState } from "react";

import { apiJson } from "@/lib/api";


type TripResult = Record<string, any> | null;


const bookingNeeds = [
  ["flight", "Flight"],
  ["hotel", "Hotel"],
  ["short_stay_apartment", "Short-stay apartment"],
  ["airport_pickup", "Airport pickup"],
  ["intercity_transport", "Intercity transport"],
  ["travel_insurance", "Travel insurance"],
  ["local_sim", "Local SIM"],
  ["other", "Other"],
];


function readable(value: unknown) {
  return String(value || "not available").replace(/_/g, " ");
}


function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/trip-planner";
  } catch {
    return "/trip-planner";
  }
}


export default function TripPlanner() {
  const [result, setResult] = useState<TripResult>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Check permission and travel risks before comparing non-refundable bookings.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedNeeds = bookingNeeds.map(([code]) => code).filter((code) => data.get(code) === "on");

    const payload = {
      departure_country: String(data.get("departure_country") || ""),
      destination_country: String(data.get("destination_country") || ""),
      destination_city: String(data.get("destination_city") || ""),
      passport_country: String(data.get("passport_country") || ""),
      trip_purpose: String(data.get("trip_purpose") || "tourism"),
      departure_date: String(data.get("departure_date") || ""),
      return_date: String(data.get("return_date") || ""),
      adults: Number(data.get("adults") || 1),
      children: Number(data.get("children") || 0),
      infants: Number(data.get("infants") || 0),
      booking_needs: selectedNeeds,
      passport_valid_months: Number(data.get("passport_valid_months") || 0),
      trip_budget_amount: Number(data.get("trip_budget_amount") || 0),
      currency: String(data.get("currency") || "USD"),
      destination_entry_rule_checked: data.get("destination_entry_rule_checked") === "on",
      visa_or_authorization_confirmed: data.get("visa_or_authorization_confirmed") === "on",
      transit_rule_checked: data.get("transit_rule_checked") === "on",
      travel_insurance_confirmed: data.get("travel_insurance_confirmed") === "on",
      accommodation_confirmed: data.get("accommodation_confirmed") === "on",
      onward_or_return_ticket_planned: data.get("onward_or_return_ticket_planned") === "on",
      funds_plan_confirmed: data.get("funds_plan_confirmed") === "on",
      prior_refusal_or_denied_admission: data.get("prior_refusal_or_denied_admission") === "on",
      visa_validity_uncertain: data.get("visa_validity_uncertain") === "on",
      special_medical_or_accessibility_need: data.get("special_medical_or_accessibility_need") === "on",
      source_page: sourcePage(),
    };

    setLoading(true);
    setMessage("Building a neutral trip-readiness and booking sequence...");
    try {
      const response = await apiJson<any>("travel/trip-plan", {
        method: "POST",
        body: payload,
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setResult(response);
      setMessage(response.stored ? "Trip plan generated and connected to the verified account." : "Trip plan generated. Sign in before running it again if you want account recovery.");
    } catch (error: any) {
      setResult(null);
      setMessage(error?.message || "The trip planner could not run. Confirm the latest deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace" id="trip-planner-tool">
      <form className="workflow-panel live-form" onSubmit={submit}>
        <div className="panel-heading">
          <div>
            <p className="overline">Trip readiness</p>
            <h2>Check before booking</h2>
          </div>
          <span className="status-dot">Neutral comparison</span>
        </div>
        <p className="section-intro">
          A flight, hotel, or apartment confirmation does not grant entry. Enter only facts you have checked and keep uncertain visas or previous border problems disclosed.
        </p>

        <div className="form-grid two-col">
          <div className="field"><label>Departure country</label><input name="departure_country" placeholder="Example: Kuwait" required /></div>
          <div className="field"><label>Destination country</label><input name="destination_country" placeholder="Example: Mexico" required /></div>
          <div className="field"><label>Destination city</label><input name="destination_city" placeholder="Example: Mexico City" /></div>
          <div className="field"><label>Passport country</label><input name="passport_country" placeholder="Example: Nigeria" required /></div>
          <div className="field">
            <label>Trip purpose</label>
            <select name="trip_purpose" defaultValue="tourism">
              <option value="tourism">Tourism</option>
              <option value="family_visit">Family visit</option>
              <option value="business_visit">Business visit</option>
              <option value="conference">Conference</option>
              <option value="study_arrival">Study arrival</option>
              <option value="work_arrival">Work arrival</option>
              <option value="relocation_arrival">Relocation arrival</option>
              <option value="medical">Medical</option>
              <option value="transit">Transit</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field"><label>Passport validity remaining, months</label><input name="passport_valid_months" type="number" min="0" defaultValue="12" /></div>
          <div className="field"><label>Departure date</label><input name="departure_date" type="date" /></div>
          <div className="field"><label>Return date</label><input name="return_date" type="date" /></div>
          <div className="field"><label>Adults</label><input name="adults" type="number" min="1" defaultValue="1" /></div>
          <div className="field"><label>Children</label><input name="children" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label>Infants</label><input name="infants" type="number" min="0" defaultValue="0" /></div>
          <div className="field"><label>Planning currency</label><input name="currency" defaultValue="USD" /></div>
          <div className="field"><label>Total trip budget</label><input name="trip_budget_amount" type="number" min="0" defaultValue="0" /></div>
        </div>

        <div className="result-block soft">
          <strong>What do you need to compare or arrange?</strong>
          <div className="check-grid" style={{ marginTop: 10 }}>
            {bookingNeeds.map(([code, label]) => (
              <label className="checkbox-field" key={code}><input name={code} type="checkbox" /><span>{label}</span></label>
            ))}
          </div>
        </div>

        <div className="check-grid">
          <label className="checkbox-field"><input name="destination_entry_rule_checked" type="checkbox" /><span>I checked the current destination entry rule.</span></label>
          <label className="checkbox-field"><input name="visa_or_authorization_confirmed" type="checkbox" /><span>My required visa, authorization, exemption, or status is confirmed.</span></label>
          <label className="checkbox-field"><input name="transit_rule_checked" type="checkbox" /><span>I checked every transit country and airport rule.</span></label>
          <label className="checkbox-field"><input name="travel_insurance_confirmed" type="checkbox" /><span>Travel or route-required insurance is confirmed.</span></label>
          <label className="checkbox-field"><input name="accommodation_confirmed" type="checkbox" /><span>Accommodation is verified and confirmed.</span></label>
          <label className="checkbox-field"><input name="onward_or_return_ticket_planned" type="checkbox" /><span>Return or onward travel evidence is planned where required.</span></label>
          <label className="checkbox-field"><input name="funds_plan_confirmed" type="checkbox" /><span>Trip funds and border-evidence planning are confirmed.</span></label>
          <label className="checkbox-field"><input name="prior_refusal_or_denied_admission" type="checkbox" /><span>I have a previous refusal, denied admission, or border withdrawal.</span></label>
          <label className="checkbox-field"><input name="visa_validity_uncertain" type="checkbox" /><span>A visa or immigration status may be cancelled, revoked, limited, expired, or uncertain.</span></label>
          <label className="checkbox-field"><input name="special_medical_or_accessibility_need" type="checkbox" /><span>A traveller has medical, medication, mobility, pregnancy, dietary, or accessibility needs.</span></label>
        </div>

        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Building plan..." : "Check trip readiness"}</button>
        <p className="form-status">{message}</p>
      </form>

      <section className="result-panel" aria-live="polite">
        {result ? (
          <div className="result-stack">
            <article className="result-block featured">
              <div className="panel-heading">
                <div><p className="overline">Booking readiness</p><h2>{readable(result.readiness_status)}</h2></div>
                <span className="status-dot">Risk: {readable(result.risk_level)}</span>
              </div>
              <p>{result.summary}</p>
              <div className="badge-row">
                <span className="badge">{result.departure_country} → {result.destination_country}</span>
                <span className="badge">Travellers: {result.traveller_count}</span>
                <span className="badge">Departure: {result.departure_date || "not set"}</span>
                <span className="badge">Approved providers: {result.approved_provider_count || 0}</span>
                <span className="badge">Stored: {result.stored ? "verified account" : "result only"}</span>
              </div>
            </article>

            {(result.warnings || []).length ? (
              <article className="result-block">
                <p className="overline">Do not book yet without reviewing</p>
                <div className="mini-list">
                  {(result.warnings || []).map((warning: string, index: number) => <div key={index}><strong>Warning {index + 1}</strong><span>{warning}</span></div>)}
                </div>
              </article>
            ) : null}

            {(result.booking_sequence || []).map((stage: any) => (
              <article className="result-block soft" key={stage.stage}>
                <p className="overline">Booking stage</p>
                <h2>{stage.stage}</h2>
                <div className="mini-list">
                  {(stage.actions || []).map((action: string, index: number) => <div key={index}><strong>{index + 1}</strong><span>{action}</span></div>)}
                </div>
              </article>
            ))}

            <article className="result-block">
              <div className="panel-heading">
                <div><p className="overline">Approved handoff</p><h2>Screened travel providers</h2></div>
                <span className="status-dot">{result.approved_provider_count || 0}</span>
              </div>
              {(result.approved_providers || []).length ? (
                <div className="mini-list">
                  {(result.approved_providers || []).map((provider: any) => (
                    <div key={provider.id}>
                      <strong>{provider.business_name || provider.provider_label || "Approved provider"}</strong>
                      <span>{provider.service_summary || "Approved travel service"}</span>
                      <span>Trust notes: {provider.credentials_summary || "Admin screening completed"}</span>
                      {provider.website_url ? <a className="text-link" href={provider.website_url} target="_blank" rel="noreferrer">Visit approved provider website</a> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No approved matching travel provider is publicly listed yet. MoveReady will not show an unapproved provider as trusted.</p>
              )}
              <p className="form-status">{result.affiliate_disclosure}</p>
              <div className="actions">
                <a className="btn primary" href="/services?service=travel_booking">Request booking support</a>
                <a className="btn" href="/providers">View approved providers</a>
                <a className="btn" href="/journey-plans">Open saved plans</a>
              </div>
            </article>

            <article className="result-block featured">
              <p className="overline">Fraud and entry safety</p>
              <div className="mini-list">
                {(result.fraud_checks || []).map((item: string, index: number) => <div key={index}><strong>Check {index + 1}</strong><span>{item}</span></div>)}
              </div>
              <p className="form-status">{result.safety_note}</p>
            </article>
          </div>
        ) : (
          <article className="result-block featured">
            <p className="overline">What you will get</p>
            <h2>Permission risks, transit warnings, a booking sequence, fraud checks, and approved-provider handoff.</h2>
            <p>MoveReady does not display live inventory or price until an approved booking integration is configured.</p>
          </article>
        )}
      </section>
    </div>
  );
}
