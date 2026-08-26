# LQ13 — Career Studio launch-quality repair

LQ13 closes the document-quality defects found during authenticated LQ12 production testing.

## Launch gate

Career Studio now blocks PDF, DOCX and vault export until the document contains the minimum professional structure for its type and the user confirms every fact.

Résumé checks cover contact details, location, headline, summary, skills, complete employment identity and dates, usable evidence statements, and complete education records when education is included.

Cover-letter checks require the employer, exact role, a specific opening, a substantive evidence-based body, and a professional closing. MoveReady does not invent missing experience or vacancy evidence.

## Export repairs

- PDF export normalizes unsupported punctuation before using jsPDF's built-in Helvetica font and explicitly resets character spacing.
- DOCX export uses a real Word numbering definition for bullets rather than bullet characters embedded in paragraph text.
- Both formats provide visible preparing, success and recoverable-failure messages.
- Every downloaded file still requires a final visual review.

## Related production repairs

- Profile facts are cleaned of standalone conjunction fragments before becoming editable Career Studio achievements.
- Alignment potential excludes unavailable vacancy skill and responsibility categories.
- Slow alignment generation exposes retry and return actions.
- Authenticated dashboard and Application Center views no longer show unconditional sign-in actions.

## Verification

Run:

```bash
npm run test:lq13
npm run test:lq05
npm run test:lq06
npm run build
```

No database migration is required.
