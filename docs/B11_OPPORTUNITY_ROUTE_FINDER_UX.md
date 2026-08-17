# MoveReady B11 — Opportunity / Route Finder UX

Status: implementation and automated acceptance contract.

## Batch boundary

B11 upgrades `/find` and the existing Route Checker to consume the backend `b11-v1` recommendation contract. It does not add a profile silo, upload documents, submit applications, change the database, or begin B12 document/application UX.

## Finder experience

The signed-in Finder now presents:

- pathway profile-alignment scores explicitly labelled as non-eligibility signals;
- known profile signals and gaps;
- selectable route candidates for the target jurisdiction;
- required and conditional evidence counts and names;
- recorded planning costs without invented multipliers or exchange rates;
- recorded timeline and risk notes;
- source freshness, verified date and confidence;
- linked HTTPS official sources opening safely in a new tab;
- exact Route Checker, Compare, Financial Readiness and Evidence actions;
- reviewed public opportunity records for the target jurisdiction.

Loading, signed-out, missing-profile, deployment-version, empty-route and generic failure states are distinct. A user can retry without creating another profile.

## Exact Route Checker binding

The route action preserves `country` and `route` query parameters. Route Checker resolves `/api/relocation/routes/by-code/<country>/<route>`, displays the bound route and its source state, and sends the route `country_id` and `active_version_id` into checklist, budget and report requests.

If the lookup fails, the form stays usable but displays a warning that route-specific IDs will not be submitted. It never silently labels the generic defaults as the requested route.

## Accessibility and phone behaviour

- pathway choices are native buttons with `aria-pressed` state and visible keyboard focus;
- loading/errors use `aria-live`, and hard failures use `role=alert`;
- official links use safe new-tab attributes;
- the Finder collapses from split navigation/detail and multi-column evidence views to one column on small screens;
- action buttons become full-width where needed.

## Automated acceptance

Run:

```bash
npm run test:b06
npm run test:b08
npm run test:b10
npm run test:b11
npm run build
```

The B11 contract test verifies the version gate, truth language, route/evidence/cost/timeline/risk/provenance fields, official-source links, exact query binding, route IDs in downstream requests, loading/error accessibility, responsive styles and CI execution.

## Production acceptance to perform later

1. Confirm the deployed backend exposes `contract_versions.opportunity_finder=b11-v1`.
2. Sign in with a profile containing a goal and target country, then open `/find`.
3. Confirm alignment is never described as eligibility or approval probability.
4. Review one candidate’s evidence, cost, timing/risk and source details.
5. Follow **Check this exact route** and confirm Route Checker shows the same route and country.
6. Test signed-out and missing-profile recovery.
7. Repeat the main flow with keyboard-only navigation and a phone-sized screen.

Do not paste passports, bank documents, OTPs, session tokens, complete application references or private authority correspondence into chat, screenshots, issues, logs or repository files.
