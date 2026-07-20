import SiteHeader from "@/components/SiteHeader";
import AccountLogin from "@/components/AccountLogin";

const loginBenefits = [
  {
    title: "Connect your records",
    detail: "Profiles, saved routes, reports, alerts, timeline events, and support requests can sit under one verified email session.",
  },
  {
    title: "Reduce repeated lookup",
    detail: "After signing in, Account can load your connected records without asking for email or phone on every page.",
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

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Email login</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Sign in, then continue in Account.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Use your email code to connect your MoveReady records on this device. After login, the app opens Account automatically.
              </p>
            </div>
            <span className="status-dot">Secure code</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#login-form">Go to login form</a>
            <a className="btn" href="/dashboard">Open Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="login-form">
        <AccountLogin />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Why sign in?</p>
            <h2>Login keeps your records together</h2>
            <p className="section-intro">
              You can still use simple email or phone lookup, but a verified session makes the app easier for returning users.
            </p>
          </div>
          <span className="status-dot">Private records</span>
        </div>
        <div className="grid">
          {loginBenefits.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
