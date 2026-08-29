# LQ15 — Evidence-backed Readiness Gap Engine

## V1 acceptance contract

- Convert vacancy, profile, work-rights, qualification, source, deadline, and application-material evidence into one explainable readiness plan.
- Separate critical blockers, qualification gaps, verification gaps, and material gaps.
- Rank the next five actions by severity without claiming that a user is eligible, employable, sponsored, or guaranteed an outcome.
- Unknown evidence is not treated as ready or scored as a confirmed failure.
- Mandatory vacancy barriers remain blocking until the user confirms supporting evidence.
- Vacancy-evidence changes invalidate previously promoted readiness states.
- The frontend must preserve the nested readiness API payload and show score, evidence coverage, gaps, and direct next actions.
- No immigration eligibility or hiring probability is produced.

## Production acceptance

After deployment, open a current vacancy, start its readiness check, and confirm that the plan groups work-rights, qualification, source, and document gaps. Resolve or verify one item, recheck, and confirm that the score and next-action order update without submitting anything externally.

