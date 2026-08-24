import GuidedOnboarding from "@/components/GuidedOnboarding";
import SiteHeader from "@/components/SiteHeader";

export default function RelocationOnboardingPage() {
  return <main className="page-shell"><SiteHeader sectionLabel="Relocation foundation setup" /><section className="hero-band compact-hero"><div className="hero-copy"><span className="eyebrow">Route and relocation setup</span><h1>Set up the foundations of a serious relocation plan.</h1><p className="lede">Create a route profile, organize evidence and control the alerts you need.</p><div className="actions"><a className="btn primary" href="#guided-setup">Start relocation setup</a><a className="btn" href="/onboarding">Main journey</a></div></div></section><section className="section no-top-pad" id="guided-setup"><GuidedOnboarding /></section></main>;
}
