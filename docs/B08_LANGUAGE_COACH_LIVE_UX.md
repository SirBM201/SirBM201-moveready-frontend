# MoveReady B08 — Language Coach live frontend integration

Status: implementation and automated acceptance contract.

## Batch boundary

B08 connects the existing `/language-coach` page to the verified B07 backend contract and turns the earlier prototype into a clear, private, mobile-ready user flow. It does not add another database model, change migration 039, or claim that MoveReady issues official language-test results.

## User flow

1. A public contract check confirms the backend exposes `contract_version=b07-v1`.
2. Private Language Coach endpoints determine whether the visitor has a verified account session.
3. Signed-out visitors receive a direct email-login action that returns to `/language-coach`.
4. Signed-in users choose English, French, or Both.
5. Both-language plans use only 50/50, 70/30, or 30/70 allocations.
6. Saving the plan preserves diagnostic placement; the plan form cannot self-award a level.
7. The learner can complete an internal diagnostic, adaptive practice, a 1–5 minute challenge, or due Mistakes Bank review.
8. Answers and explanations appear only after the attempt is recorded.
9. Progress, momentum, qualification priorities, and spaced review refresh from the private account.

## Privacy and truth boundaries

- The learning plan, attempts, mistakes, placement, and progress require a verified session.
- A wrong answer is added to the private Mistakes Bank.
- Missing a day does not erase accumulated practice or reset progress to zero.
- Only MoveReady-original or permitted official-release questions are eligible.
- An official-release source link is shown only when it uses HTTPS.
- Recalled, leaked, or reconstructed live exam content is prohibited.
- Internal placement, accuracy, readiness, and planning targets are not official IELTS, TEF, CLB, or NCLC results.

## Automated acceptance

Run:

```bash
npm run test:b08
npm run build
```

The B08 contract test verifies:

- all required B07 Language Coach routes are connected;
- signed-out users receive the private-account gate;
- supported language and allocation choices are preserved;
- response time is recorded with an attempt;
- diagnostics fail closed when too few eligible questions are available;
- fetched questions do not contain answer keys;
- recorded-attempt feedback may expose the correct answer and explanation;
- the plan form does not submit diagnostic placement;
- content provenance, score boundaries, focus treatment, and mobile layout are present.

GitHub Actions runs the B06 regression contract, B08 contract, and full Next.js production build.

## Production acceptance to perform later

1. Sign in with a controlled verified account and confirm the page returns from `/login?next=/language-coach`.
2. Save English, French, and each supported Both allocation.
3. Complete at least six distinct diagnostic questions and confirm the internal 0–5 placement appears.
4. Confirm no answer key or explanation appears before an answer is submitted.
5. Record one wrong answer and confirm it appears in the Mistakes Bank.
6. Open a due review, answer correctly, and confirm the review streak advances.
7. Confirm adaptive practice, the daily challenge, momentum, and qualification actions update.
8. Repeat the main flow on a phone-sized screen.

Do not paste OTPs, session tokens, answer history, or private account data into chat, screenshots, issues, logs, or repository files.
