import GuidedOnboarding from "@/components/GuidedOnboarding";
import SiteHeader from "@/components/SiteHeader";

export default function OnboardingPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Guided MoveReady Setup" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Start without confusion</span>
          <h1>Set up the five foundations of a serious relocation plan.</h1>
          <p className="lede">
            Begin with one profile, verify a route, organize evidence, open an application case only when execution begins, and control the alerts you actually need.
          </p>
          <div className="actions">
            <a className="btn primary" href="#guided-setup">Start guided setup</a>
            <a className="btn" href="/dashboard">Account Center</a>
            <a className="btn" href="/settings">Settings</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="guided-setup">
        <GuidedOnboarding />
      </section>
    </main>
  );
}
