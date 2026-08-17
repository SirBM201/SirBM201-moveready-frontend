type Props = {
  status?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  verifiedAt?: string | null;
  reviewDueAt?: string | null;
};

function dateText(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function PassportProvenanceStatus({ status, sourceName, sourceUrl, verifiedAt, reviewDueAt }: Props) {
  const normalized = String(status || "pending_review").toLowerCase();
  const verified = normalized === "verified";
  const title = verified ? "MoveReady-reviewed official source" : normalized === "needs_review" ? "Official source needs review" : normalized === "retired" ? "Official source retired" : "Official source pending review";
  return (
    <div className="mini-list" aria-label="Passport source provenance">
      <div><strong>{title}</strong><span>{verified ? "Government/embassy mapping passed controlled review." : "Do not treat this mapping as currently verified official evidence."}</span></div>
      {sourceName ? <div><strong>Authority</strong><span>{sourceName}</span></div> : null}
      <div><strong>Verified</strong><span>{verified ? dateText(verifiedAt) : "No current verification"}</span></div>
      <div><strong>Review due</strong><span>{verified ? dateText(reviewDueAt) : "Not applicable until verified"}</span></div>
      {sourceUrl ? <div><strong>Authority link</strong><span><a href={sourceUrl} target="_blank" rel="noreferrer">Open source</a></span></div> : null}
    </div>
  );
}
