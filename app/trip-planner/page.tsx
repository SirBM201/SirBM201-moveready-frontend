import ApprovedProviderDirectory from "@/components/ApprovedProviderDirectory";
import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";
import SiteHeader from "@/components/SiteHeader";
import TripPlanner from "@/components/TripPlanner";


const principles = [
  {
    title: "Permission before payment",
    text: "Confirm passport, visa or authorization, transit, airline, border, health, insurance, funds, and personal-history conditions before buying restrictive travel products.",
  },
  {
    title: "Compare total cost",
    text: "Review baggage, seats, taxes, cleaning, resort fees, payment fees, change rules, cancellation terms, support, and refund handling—not only the headline price.",
  },
  {
    title: "Approved handoff only",
    text: "MoveReady lists a provider as trusted only after administrative approval. A service-request form can collect demand while public partner coverage grows.",
  },
  {
    title: "Referral disclosure",
    text: "Any future affiliate or referral link must be clearly labelled before the click and must not replace independent price, safety, refund, or official-rule checks.",
  },
];


export default function TripPlannerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Trip readiness and booking" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Travel planning + screened handoff</span>
          <h1>Check whether the trip is ready before comparing flights, rooms, transport, and insurance.</h1>
          <p className="lede">
            Build a neutral travel plan using passport, destination, visa status, transit, insurance, accommodation, budget, family, medical, and prior immigration-history information. MoveReady will not present an unapproved provider as trusted.
          </p>
          <div className="actions">
            <a className="btn primary" href="#trip-planner-tool">Check trip readiness</a>
            <a className="btn" href="/passport-index">Check passport</a>
            <a className="btn" href="/visa-power">Check Visa Power</a>
            <a className="btn" href="/providers">Approved providers</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {principles.map((principle) => (
            <article className="card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <TripPlanner />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Public provider directory</p>
            <h2>Only approved providers appear publicly.</h2>
            <p className="section-intro">The trip result narrows approved providers where possible. The wider approved directory remains visible here for independent review.</p>
          </div>
          <span className="status-dot">Approval required</span>
        </div>
        <ApprovedProviderDirectory />
      </section>

      <section className="section" id="request-booking-support">
        <GeneralServiceRequestForm defaultService="travel_booking" />
      </section>

      <section className="section">
        <article className="result-block soft">
          <p className="overline">Important</p>
          <h2>A booking is not entry permission.</h2>
          <p>
            Airlines and border authorities can refuse boarding or admission even when a traveller holds a ticket and accommodation. Confirm the current official rule, transit conditions, visa validity, travel purpose, funds, insurance, ticket, accommodation, and personal immigration history before relying on any booking.
          </p>
        </article>
      </section>
    </main>
  );
}
