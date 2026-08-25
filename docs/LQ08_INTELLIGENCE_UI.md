# LQ08 — Campaign, Employer and Recruiter Intelligence UI

Status: implemented behind authenticated Jobs navigation.

## User outcomes

- Create a search campaign with countries, roles, pace and an explicit employer-support need.
- See campaign progress and plain-language daily/weekly actions.
- Review canonical employer identity, opportunity history, evidence timeline and advisory recommendation.
- Mark an employer priority, watch or excluded for a selected campaign; excluded takes precedence in the backend targeting model.
- Review recruiter relationship state, linked vacancies/applications and due follow-up.
- Record evidence events and prepare/copy outreach text without automatic contact.
- Move between discovery, intelligence and application execution.

## Safety contract

Canonical identity is not verification. Rankings are advisory. No employer interest, sponsorship, relocation support or recruiter authority is inferred. Absence of an interaction record is not evidence that none occurred. Outreach is never sent automatically.

## Acceptance gate

Run `npm run test:lq08`, the complete retained contract suite and `npm run build`. Manual deployed acceptance should create one synthetic campaign, set/remove each employer preference, record one private recruiter note and confirm the layout at 375px.
