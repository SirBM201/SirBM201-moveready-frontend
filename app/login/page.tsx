import SiteHeader from "@/components/SiteHeader";
import AccountLogin from "@/components/AccountLogin";

const loginPhases = [
  {
    title: "Today: contact lookup",
    detail: "Users can already save and retrieve profiles, routes, reports, alerts, timelines, and requests by email or phone.",
  },
  {
    title: "Next: verified session",
    detail: "Email OTP login verifies the user before joining all account-owned records into one workspace.",
  },
  {
    title: "Later: paid account",
    detail: "Paid reports, premium monitoring, expert review, provider handoff, and report refresh history can sit behind verified login.",
  },
];

export default function LoginPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Account login" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account login foundation</span>
          <h1>Sign in once, then continue your MoveReady journey.</h1>
          <p className="lede">
            Email OTP login is the bridge from simple contact lookup to a proper account. It should connect user-owned records while keeping MoveReady consent-first, private, and advisory.
          </p>
          <div className="actions">
            <a className="btn primary" href="#login-form">Sign in with email</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {loginPhases.map((item) => (
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
