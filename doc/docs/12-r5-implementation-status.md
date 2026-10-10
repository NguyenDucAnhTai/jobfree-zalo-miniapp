# JobFree ZMP R5 implementation status

## Baseline and references

- Branch: `feat/zmp-r5-worker-workflows`.
- Base commit: `952f317c67c9dd406a24f3801f5d603b6978e3b5` (approved R4 head specified for this task).
- The branch was created from `feat/zmp-r4-worker-core`; local `dev` did not contain the approved R4 head.
- Inspected the Worker PNG exports in `doc/design-reference/worker-employer-wireframes/wireframes-complete-v4/`, including `Trang Việc của tôi.png`, `Lịch trình.png`, `Ví JobFree.png`, `Pop-up việc.png`, `Trang chủ JobFree.png`, and `Tài khoản.png`.
- References are static PNGs only. Figma page/frame IDs, component metadata and prototype links are unavailable. R5 screen details not visible in the exports are documented as approximations in `08-worker-figma-inventory.md`.

## R5 implementation

- Worker “Việc của tôi” includes All, upcoming, in-progress, pending-confirmation, completed and history views, with links to demo shift details.
- The new-job notification opens an accessible offer modal. Offer detail supports deterministic local success, expired, taken, withdrawn, superseded and invalid scenarios, plus decline. Only the explicit success fixture creates a synthetic assignment and shift; repeat acceptance is prevented. No real job acceptance, matching or dispatch occurs.
- Worker schedule uses a fixed 8–14 October 2026 calendar and reads shifts from the same fixture set as My Jobs. Shift details support the local sequence scheduled → en route → checked in → awaiting confirmation → completed, with demo-only incident, no-show and cancelled labels in the shared type model. No GPS, camera or backend call is made.
- Wallet totals and transaction details are derived from fixed fictional income, withdrawal and completed-shift fixtures. Payout and bank controls are disabled; no payment or money movement occurs.
- Worker profile reads the same demo verification status as Worker Home. Skill edits use a working copy, so cancel/back discards changes and Save commits them in the current in-memory demo session.
- Worker date/time sorting uses normalized date/time keys rather than sorting display strings. Employer UI and request lifecycle are not redesigned.
- Worker and Employer destinations remain role-guarded. Changing role resets navigation to that role's home. CSS regression coverage checks the main `App.css` import.

## Validation

- Lint: PASS — `npm run lint`.
- Typecheck: PASS — `npm run typecheck`.
- Tests: PASS — `node_modules/.bin/vitest run --pool=forks --maxWorkers=1 --reporter=dot`; 9 files / 48 tests.
- Focused navigation tests: PASS — AppShell and Worker lifecycle screen suites, 2 files / 12 tests. Covers Worker Home selected opportunity detail/back and Employer role isolation, offer acceptance guard, Worker jobs/schedule/wallet routes, and lifecycle interactions.
- Build: PASS — `npm run build`; Vite 8.3.4 emitted `dist/assets/index-CUjs68xi.css` (46.83 kB) and `dist/assets/index-C_7f18j2.js` (297.99 kB).
- CSS entry: PASS — `src/main.tsx` imports `App.css` once and the production build emitted the CSS asset.
- Visual viewports: NOT VERIFIED — the local app server started, but the in-app browser could not reach localhost, so no rendered screenshots at the requested viewport sizes were captured.
- Zalo runtime: NOT VERIFIED — no Zalo Mini App runtime was available.
- Git whitespace: PASS — `git diff --check` reported no whitespace errors.

## Known limitations

- No Figma file or prototype metadata was available; precise interactions and states beyond the static PNGs are documented approximations, not pixel-perfect claims.
- All data and workflow transitions are in-memory demo fixtures. There is no production API, real OTP, VNeID/eKYC, payment/payout, dispatch, job acceptance, geolocation or Zalo OA integration.
- Visual layout and responsive behavior were not screenshot-verified in a browser or Zalo runtime.
- No merge or R6 work is included. This branch is awaiting independent review.

## Delivery

- Review request: `JOBFREE-ZMP-R5`.
- PR: not created; branch push status and commit are recorded in the delivery report after publication.
