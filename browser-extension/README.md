# MoveReady Safe Application Assistant

Chrome Manifest V3 extension for the LQ09 launch support list: Greenhouse, Lever, Workday and SmartRecruiters.

## Local install

1. Run `npm run build:extension`.
2. Open `chrome://extensions`, enable Developer mode and choose **Load unpacked**.
3. Select `dist/moveready-extension`.

The packaged store upload is `dist/moveready-extension.zip`.

## Boundaries

The extension has only `storage` plus the four declared ATS host patterns. It never reads or stores passwords/OTPs, never logs in for the user, never submits a form, and never sends outreach. Autofill is user-triggered and fills only a narrow set of non-sensitive empty fields.
