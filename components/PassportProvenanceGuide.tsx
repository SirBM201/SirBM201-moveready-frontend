import PassportProvenanceExamples from "@/components/PassportProvenanceExamples";

export default function PassportProvenanceGuide() {
  return (
    <section className="section no-top-pad" aria-labelledby="passport-provenance-title">
      <article className="result-block soft">
        <div className="panel-heading"><div><p className="overline">Source provenance</p><h2 id="passport-provenance-title">Know what MoveReady has verified</h2></div><span className="status-dot">Fail-closed</span></div>
        <p className="section-intro">Travel-access data can come from a Passport data provider or from an official government/embassy source reviewed by MoveReady. They are deliberately kept separate.</p>
        <div className="mini-list two-col-list">
          <div><strong>Provider / discovery data</strong><span>Useful for finding and comparing destinations. It is not automatically government-verified and must not be presented as official truth.</span></div>
          <div><strong>MoveReady verified official source</strong><span>A government or embassy source whose mapped URL and authority have passed MoveReady&apos;s controlled review workflow. Review dates show freshness.</span></div>
          <div><strong>Pending review</strong><span>An official-source candidate exists, but MoveReady has not completed verification. Treat the provider rule as discovery information and confirm independently.</span></div>
          <div><strong>Needs review</strong><span>A previous verification is no longer current or requires re-checking. MoveReady fails closed and does not continue to call it verified.</span></div>
        </div>
        <PassportProvenanceExamples />
        <p className="form-status" style={{ marginTop: 14 }}>A source link is evidence, not a visa guarantee. Always check the destination authority before booking, applying, or paying money.</p>
      </article>
    </section>
  );
}
