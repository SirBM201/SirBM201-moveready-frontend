# MoveReady B06 — General-user Jobs UX

Status: implementation and acceptance contract.

B06 connects the B05 backend contract to the existing Jobs setup, dashboard, vacancy monitoring, application preparation, and tracking workspaces. It is additive: official-source monitoring, truthful tailoring, the private application pipeline, and user-confirmed submission remain in place.

## User contract

- A user intentionally chooses `local`, `international`, or `both`.
- Current country defines the local search area; it never proves nationality, residence, citizenship, or work authorization.
- International search requires at least one selected foreign target country.
- Work-authorized countries are optional, user-reported facts. Blank means verification is required, not that authorization exists.
- Career match and application viability are displayed separately.
- Out-of-scope vacancies are labeled and cannot enter the assisted preparation flow from the search cards.
- Unknown sponsorship and relocation support remain unknown until supported by vacancy evidence.
- MoveReady still opens the official employer site only after readiness checks and records submission only after the user explicitly confirms it.

## Mobile contract

- The five-step setup collapses to a single-column choice and form layout at phone width.
- Search-contract facts, vacancy cards, actions, and work-rights choices stack without horizontal page scrolling.
- Primary actions remain full-width where appropriate on small screens.

## Automated acceptance

Run:

```bash
npm ci --include=dev
npm run test:b06
npm run build
```

The B06 regression check protects the three profile scope fields, atomic profile persistence, all three search modes, truthful work-rights wording, separate viability presentation, preserved user-confirmed submission, and mobile CSS hooks.

## Production acceptance

Using a verified account:

1. Save a local profile with a current country and no foreign target.
2. Save an international profile with a current country and a different foreign target.
3. Save a combined profile and confirm both local and foreign countries appear in scope.
4. Confirm a local vacancy and a foreign vacancy show separate match and viability states.
5. Confirm an out-of-scope vacancy is labeled and cannot start assisted preparation from its card.
6. Confirm an unrecorded work right produces a verification state rather than a recommendation.
7. Confirm vacancy monitoring, truthful drafts, the application pipeline, and explicit submission confirmation remain usable.
