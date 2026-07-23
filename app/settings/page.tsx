import AccountSettingsWorkspace from "@/components/AccountSettingsWorkspace";
import SiteHeader from "@/components/SiteHeader";

const controls = [
  ["Preferences", "Language, currency, time zone, date format, reminder timing, and onboarding progress."],
  ["Notification consent", "In-app, email, WhatsApp, source, deadline, document-expiry, opportunity, and marketing choices remain separate."],
  ["Accessibility", "Reduced motion, higher contrast, larger text, and simpler-language preferences."],
  ["Security", "Review active sessions, revoke another device, or sign out the current session."],
  ["Privacy", "Download a safe JSON export or open a reviewed access, correction, restriction, consent-withdrawal, or deletion request."],
];

export default function SettingsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Account Settings and Privacy" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Verified account controls</span>
          <h1>Control how MoveReady works for you and how your private account data is handled.</h1>
          <p className="lede">
            Preferences and consent are recorded separately. Turning on an external channel does not make it operational until its provider, template, opt-in, unsubscribe, audit, and production tests have passed.
          </p>
          <div className="actions">
            <a className="btn primary" href="#settings-workspace">Open settings</a>
            <a className="btn" href="/activity">Activity history</a>
            <a className="btn" href="/onboarding">Guided setup</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {controls.map(([title, detail]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section no-top-pad" id="settings-workspace">
        <AccountSettingsWorkspace />
      </section>
    </main>
  );
}
