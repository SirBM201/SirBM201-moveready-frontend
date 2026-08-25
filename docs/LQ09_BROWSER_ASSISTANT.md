# LQ09 — Browser Capture and Safe Application Assistant

## Launch support list

- Greenhouse: `boards.greenhouse.io`, `job-boards.greenhouse.io`
- Lever: `jobs.lever.co`
- Workday: `*.myworkdayjobs.com`
- SmartRecruiters: `jobs.smartrecruiters.com`

Unsupported sites fail safely and do not receive content-script access.

## Permissions

The Manifest V3 extension requests only Chrome `storage` and the five explicit ATS host patterns. It does not request browsing history, cookies, identity, downloads, clipboard, tabs, all-sites access or background execution.

## Controlled journey

1. User opens the popup on a supported vacancy.
2. Visible JSON-LD/DOM metadata is previewed and remains editable.
3. User opens the authenticated MoveReady review screen.
4. MoveReady shows transparent profile overlap and active private documents.
5. Reusable non-sensitive answers stay in local extension storage.
6. Autofill runs only after the user presses the button and fills a narrow allowlist of empty fields.
7. Sensitive/unknown questions remain for direct user action.
8. The extension never presses Submit.
9. After the user submits personally, a separate confirmation opens MoveReady for explicit recording and tracking.

## Store package

Run `npm run build:extension`. The unpacked directory is `dist/moveready-extension`; the Chrome Web Store upload is `dist/moveready-extension.zip`. Store copy must reproduce the privacy page and cannot advertise auto-apply.

## Manual acceptance

Load the unpacked build and test one real public vacancy from each supported ATS. Confirm capture/correction, local-profile persistence, allowlisted autofill, sensitive-field exclusion, unsupported-site failure, no submit action, post-submit confirmation and 375px MoveReady review layout. Use synthetic candidate details during testing.
