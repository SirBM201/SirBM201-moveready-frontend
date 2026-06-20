import SiteHeader from "@/components/SiteHeader";
import AccountLogin from "@/components/AccountLogin";

const loginBenefits = [
  {
    title: "Connect your records",
    detail: "Profiles, saved routes, reports, alerts, timeline events, and service requests can sit under one verified email session.",
  },
  {
    title: "Reduce repeated lookup",
    detail: "After signing in, Account Center can load your connected records without asking for email or phone on every page.",
  },
  {
    title: "Stay consent-first",
    detail: "Login does not approve a route or send your details to providers. It only helps protect and connect your own records.",
  },
];

export default function LoginPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Account login" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Secure account access</span>
          <h1>Sign in once, then continue your MoveReady journey.</h1>
          <p className="lede">
            Use email login to connect your MoveReady records on this device. You can still use email or phone lookup, but signing in makes the account workspace easier to use.
          </p>
          <div className="actions">
            <a className="btn primary" href="#login-form">Sign in with email</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {loginBenefits.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="login-form">
        <AccountLogin />
      </section>
    </main>
  );
}
