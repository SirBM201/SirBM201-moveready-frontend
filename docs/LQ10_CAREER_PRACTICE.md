# LQ10 — LinkedIn Optimizer and Written Mock Interview

## LinkedIn boundary

Users paste or export content they control. MoveReady does not automate LinkedIn login, scrape profiles, promise reach, infer recruiter behavior or claim access to LinkedIn ranking systems. The transparent review covers headline, About, experience language, verified metrics and target-role skill alignment.

## Mock interview boundary

Questions are generated deterministically from the selected recorded vacancy and target role. They are practice prompts, not leaked employer questions. Written answers use STAR fields. Feedback scores structure, specificity and recorded-skill alignment and flags numeric claims that require evidence.

## Persistence

Migration `055_job_career_practice.sql` adds private user-scoped LinkedIn reviews and mock-interview attempts. The API requires verified session identity and explicit user confirmation. History supports repeat-attempt comparison and English/French linkage to Language Coach.

## Acceptance

- paste a synthetic LinkedIn profile and receive prioritized, evidence-safe improvements;
- save and reopen the review from private history;
- choose a real recorded vacancy and complete every STAR field;
- receive transparent feedback and unsupported-claim warnings;
- repeat the same interview and compare attempts;
- open Language Coach in the selected language;
- verify 375px and keyboard completion;
- confirm no LinkedIn credentials or automated LinkedIn access are requested.
