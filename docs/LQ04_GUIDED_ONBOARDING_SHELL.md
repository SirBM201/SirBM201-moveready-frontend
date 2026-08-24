# LQ04 — Guided onboarding and simplified product shell

## Main journey

MoveReady’s primary user model is:

**FIND → QUALIFY → MOVE → SETTLE → GROW**

The onboarding page derives progress from saved account records:

- matching profile;
- recorded vacancies;
- B19 readiness;
- tracked applications.

The browser does not invent completion and does not become the source of truth.

## Navigation policy

Desktop primary navigation contains the five journey phases plus Dashboard. Jobs, onboarding, evidence and specialist tools remain in the secondary menu.

The Jobs sub-navigation prioritizes Discover, Readiness, Applications and Career documents. Employer, recruiter, automation and interview tools remain available under More tools.

Mobile navigation prioritizes Start, Jobs, Actions, Alerts and Account.

## Recovery rules

- Signed out → sign in and return to onboarding.
- Missing matching profile → five-step job setup.
- No vacancy → automatic discovery.
- No readiness → open a vacancy and start B19 readiness.
- No application → application workspace.
- Established journey → ranked dashboard action centre.
- API failure → retry without changing records.

## Acceptance

- Main journey is understandable without internal B-codes.
- Incomplete requirements explain exactly what to do next.
- Progress survives browsers because it is server-record-derived.
- No primary navigation dead ends.
- Mobile navigation exposes the main launch actions.
- Existing relocation onboarding remains at `/onboarding/relocation`.
