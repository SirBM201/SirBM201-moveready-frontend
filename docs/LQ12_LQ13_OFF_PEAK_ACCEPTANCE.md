# LQ12/LQ13 remaining acceptance batch — 28 August 2026

## Scope and numbering

Use the later delivered block names: LQ12 production/beta validation and LQ13 Career Studio quality repair. The original V1 backlog uses different names for these numbers and is not an instruction to restart subscriptions. Payments, external messaging and the shared vacancy catalogue remain deferred. No new SQL is required for this frontend batch.

## Implemented, awaiting deployed acceptance

- Career Studio and Alignment use the authenticated profile id to separate device drafts.
- Legacy unassigned device drafts are preserved but not automatically displayed to another account. Existing vault documents are unchanged. Do not clear browser storage while recovering any old work.
- Malformed/blocked device storage cannot crash document loading. Saving failures show a warning instead of promising persistence.
- Slow Career Studio and vacancy loading have visible status and safe return navigation.
- Earlier scan repair is tracked separately: backend PR #60 and frontend PR #35. Do not restart employer experiments.

## Off-peak test order

Record exact frontend/backend revisions and each result as PASS, FAIL, BLOCKED or NOT TESTED. An HTTP success or static contract test is not a browser acceptance pass.

1. Deployment: confirm the latest intended revisions at /deployment-status. Do not deploy an old revision merely to wake a service.
2. Account A: sign in privately, open Career Studio, create a synthetic draft, refresh, verify recovery. Reconfirm truth before export.
3. Account B: sign out of A, sign into B in the same browser, verify A's draft is not loaded in Career Studio or Alignment. Use separate test profiles. Do not paste OTPs or session tokens into reports.
4. Storage recovery: test blocked storage with a synthetic account; editing must remain usable and saving must warn. Do not delete real draft storage.
5. Documents: complete essentials; confirm incomplete exports are blocked; download fresh PDF and DOCX, open each and inspect fonts, bullets, page breaks, contact details and clipping. Upload artifacts for visual review if needed.
6. Cover letter: open a known vacancy's Alignment Report, choose Tailor cover letter, verify exact employer/title, supply truthful evidence, and inspect both exports.
7. Lush: click Check now on the existing monitor once. Capture the stage counts and vacancy results. Related roles are not guaranteed eligibility or sponsorship.
8. Application journey: verify draft/readiness/handoff/recorded outcome with synthetic data. Never submit a real employer application merely for testing.
9. Mobile/accessibility: 320px, 390px, tablet and desktop; keyboard, 200% zoom, visible focus, horizontal overflow, editor/preview and export controls.
10. Console/network: check the earlier hydration #418 warning, slow/offline recovery, auth expiry and duplicate requests. The hydration cause remains unconfirmed; do not record it fixed without a clean reproduction.
11. Alerts: inspect private in-app results and duplication. External delivery remains disabled, not passed.
12. Beta: record supervised pilot observations. Real user completion/usefulness and the 10–20-user beta are not replaceable by automated tests.

## Stop conditions

Cross-account content, corrupted exports, unauthorized actions or data loss block the pilot. Record less severe defects with evidence and a clear repair owner. No public-launch declaration until outstanding gates are reviewed.
