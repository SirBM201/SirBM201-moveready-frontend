# MoveReady B10 — Financial Readiness UX

Status: implementation and automated acceptance contract.

## Batch boundary

B10 connects the `/budget-calculator` frontend to the B09 `POST /api/financial-readiness/check` contract. It replaces the older generic funds calculator with a source-aware, mobile-ready planning workspace. It does not add a database migration, change production environment variables, convert currencies, invent family-size multipliers, determine financial eligibility, or predict approval.

## User flow

1. Choose one supported country and route.
2. Enter the scenario currency and family size, including the applicant.
3. Enter current savings, expected funding, and an optional target date.
4. Enter the current proof-of-funds requirement only when it has been confirmed for the exact route and household.
5. Record the authority/source title, checked date, and HTTPS URL. The reference remains labelled user supplied; MoveReady does not represent it as verified.
6. Leave a cost category blank to use the route estimate where available, or enter an override for that category.
7. Review the combined target, funding gap, surplus, and monthly savings target.
8. Review route provenance, proof-of-funds provenance, category totals, detailed cost origins, currency mismatches, and backend warnings before acting.

## Fail-closed and privacy boundaries

- Both top-level and nested response contracts must be `b09-v1`.
- An unconfirmed proof-of-funds amount remains `requirements_needed`; it is never treated as zero.
- An amount without a current HTTPS source remains `source_review_required`.
- Mismatched currencies remain `currency_mismatch`; MoveReady does not guess an exchange rate.
- Family size is preserved as route/source context only. The B10 interface applies no automatic multiplier.
- A covered scenario is labelled only `ready_on_entered_figures`, not eligible, approved, or guaranteed.
- The form accepts planning totals and source metadata only. Users are told not to paste bank statements, account numbers, or transaction histories.

## Accessibility and responsive behaviour

- Native labelled inputs, fieldsets, legends, and buttons support keyboard and assistive-technology use.
- Loading and error states are announced through a focused `aria-live` result region.
- Submitted results move keyboard focus to the result region; errors provide a return-to-form action.
- The two-column workspace, metrics, cost categories, facts, and buttons collapse into a single-column phone layout.
- Focus-visible treatment remains present for the interactive form and result region.

## Automated acceptance

Run:

```bash
npm run test:b06
npm run test:b08
npm run test:b10
npm run build
```

The B10 contract test verifies the B09 endpoint and response versions, all request fields, all six cost categories, the five controlled assessment states, provenance language, privacy and truth boundaries, removal of the legacy funds endpoint, direct B10 navigation, keyboard focus treatment, mobile layout, and CI execution.

## Production acceptance to perform later

1. Confirm `/api/build-info` reports the expected backend deployment commit and `contract_versions.financial_readiness = b09-v1`.
2. Run a scenario without a requirement and confirm the result remains unresolved.
3. Add an amount without a source and confirm source review remains required.
4. Add a current HTTPS authority reference and confirm it is labelled user supplied, not MoveReady verified.
5. Override one cost category and confirm other available route estimates remain separate.
6. Confirm a funding gap and future target date produce an understandable monthly savings target.
7. Repeat the scenario with a currency mismatch and confirm no combined financial result or exchange-rate guess is shown.
8. Repeat the main flow with keyboard-only navigation and on a phone-sized screen.

Do not paste OTPs, session tokens, bank documents, account numbers, transaction histories, or private financial evidence into chat, screenshots, issues, logs, or repository files.
