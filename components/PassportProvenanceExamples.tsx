import PassportProvenanceStatus from "@/components/PassportProvenanceStatus";

export default function PassportProvenanceExamples() {
  return (
    <details className="result-block soft" style={{ marginTop: 14 }}>
      <summary><strong>How source status will appear on destination details</strong></summary>
      <div className="grid" style={{ marginTop: 14 }}>
        <article className="card"><PassportProvenanceStatus status="verified" verifiedAt="2026-08-17" reviewDueAt="2026-11-15" /></article>
        <article className="card"><PassportProvenanceStatus status="pending_review" /></article>
        <article className="card"><PassportProvenanceStatus status="needs_review" /></article>
      </div>
      <p className="form-status">Dates above illustrate the labels only. Actual destination details must use backend review metadata; the UI never promotes a source itself.</p>
    </details>
  );
}
