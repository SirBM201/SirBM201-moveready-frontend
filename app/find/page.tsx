import OpportunityFinder from "@/components/OpportunityFinder";
import SiteHeader from "@/components/SiteHeader";

export default function FindPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Find realistic mobility options" />
      <section className="hero-band compact-hero finder-hero">
        <div className="hero-copy">
          <span className="eyebrow">B11 · FIND → QUALIFY</span>
          <h1>Turn your profile into route leads you can actually investigate.</h1>
          <p className="lede">See why a pathway aligns, what evidence and costs are recorded, when official sources were checked, where the gaps remain, and which exact action comes next.</p>
          <div className="finder-hero-guardrail">
            <strong>No approval prediction.</strong>
            <span>MoveReady ranks alignment and exposes source gaps. Authorities, schools and employers make the real decisions.</span>
          </div>
          <div className="actions">
            <a className="btn primary" href="#finder-workspace">Find my route leads</a>
            <a className="btn" href="/compare">Compare countries</a>
            <a className="btn" href="/route-checker">Open Route Checker</a>
          </div>
        </div>
      </section>
      <div id="finder-workspace"><OpportunityFinder /></div>
    </main>
  );
}
