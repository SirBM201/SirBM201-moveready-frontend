# LQ03 — Vacancy discovery and detail journey

## Contract

The launch Jobs entry point is discovery-first. Existing setup, manual capture, employer, recruiter, résumé and application tools remain available through `/jobs/workspace`.

Every displayed vacancy must:

- identify its recorded source or state that the source is missing;
- show freshness derived from checked/seen/observed/posted evidence;
- treat expired, closed and stale records conservatively;
- separate career match from application viability;
- explain work-rights, sponsorship and relocation uncertainty;
- link to a dedicated detail page;
- provide a real B19 readiness read/reconcile action;
- never imply automatic submission or immigration/employment guarantees.

## Routes

| Route | Purpose |
|---|---|
| `/jobs` | Search, filter, sort and assess vacancy results |
| `/jobs/vacancies/[jobId]` | Full source, freshness, suitability and evidence review |
| `/jobs/workspace` | Existing setup, capture and action-centre workspace |

## Freshness policy

- 0–7 days since last reliable evidence: recently checked.
- 8–30 days: aging; verification requested.
- More than 30 days: stale until source confirmation.
- Missing evidence dates: freshness unknown.
- Closed/expired status or a past closing date: action disabled.

Dates are evidence timestamps, not a claim that the employer is still hiring.

## Manual acceptance

1. Test a current, stale, missing-date and closed fixture/record.
2. Confirm filters and sorting remain operable at 375px width.
3. Open a vacancy detail, then open its original source.
4. Confirm missing sponsorship evidence reads as unknown.
5. Start or reconcile B19 readiness and verify the response is visible.
6. Confirm a closed/expired vacancy cannot start readiness.
7. Complete the journey using keyboard only.
