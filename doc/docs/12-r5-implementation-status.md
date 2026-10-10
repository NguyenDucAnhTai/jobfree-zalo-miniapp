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
- Review iteration 2: planned shift boundaries (`scheduledStartAt`, `scheduledEndAt`, and the unchanged display schedule) are now separate from lifecycle event `occurredAt` timestamps. Scheduled shifts have no lifecycle occurrence yet. Demo timestamps are derived deterministically from the fixed schedule; events render in chronological date/time order, including shifts crossing midnight.
- Review iteration 2: fixed `no_show`, `incident_pending` and `cancelled` fixtures are marked display-only, appear with matching labels and event timelines in My Jobs, Schedule and Shift Detail, and expose no transition action. They do not create earnings. The adapter refuses transitions for these controlled fixtures.
- Wallet totals and transaction details are derived from fixed fictional income, withdrawal and completed-shift fixtures. Payout and bank controls are disabled; no payment or money movement occurs.
- Worker profile reads the same demo verification status as Worker Home. Skill edits use a working copy, so cancel/back discards changes and Save commits them in the current in-memory demo session.
- Worker date/time sorting uses normalized date/time keys rather than sorting display strings. Employer UI and request lifecycle are not redesigned.
- Worker and Employer destinations remain role-guarded. Changing role resets navigation to that role's home. CSS regression coverage checks the main `App.css` import.

## Validation

- Lint: PASS — `npm run lint`.
- Typecheck: PASS — `npm run typecheck`.
- Tests: PASS — `npm run test`; 9 files / 58 tests.
- Focused review-fix tests: PASS — 3 files / 31 tests. Covers event meaning/order/determinism, overnight schedules, all three read-only exceptional fixtures, jobs/schedule/detail navigation, offer outcomes/repeat-accept guard, wallet totals, and Employer isolation.
- Build: PASS — `npm run build`; Vite 8.3.4 emitted `dist/assets/index-DxuFTC6d.css` (47.14 kB) and `dist/assets/index-DbtRbAcj.js` (300.12 kB).
- CSS entry: PASS — `src/main.tsx` imports `App.css` once and the production build emitted the CSS asset.
- Visual viewports: NOT VERIFIED — the local app server started, but the in-app browser could not reach localhost, so no rendered screenshots at the requested viewport sizes were captured.
- Zalo runtime: NOT VERIFIED — no Zalo Mini App runtime was available.
- Git whitespace: PASS — `git diff --check` reported no whitespace errors.

## Review iteration 2

- Finding R5-01: fixed the planned-time/event-time confusion. For an 18:00–22:00 shift, lifecycle occurrences are 17:15 (en route), 18:00 (check-in), 22:00 (awaiting confirmation), and 22:10 (complete); 18:00–22:00 remains the planned shift window. Overnight tests verify next-day event ordering.
- Finding R5-02: added three controlled exceptional fixtures. My Jobs shows their event timelines; Schedule links to the same detail fixtures; Shift Detail labels them and omits actions. These fixtures are read-only and excluded from earned transactions.
- Offer, wallet, skills save/cancel, Employer lifecycle, role isolation and CSS regressions are included in the full passing suite. Employer source was not changed.
- Review-fix implementation commit: `97e2b73d2dd0d708f9996dbd73a90794d5f04ee6` (`fix(worker): correct shift timelines and exceptions`).

## Known limitations

- **DESIGN_APPROXIMATION:** No Figma file or prototype metadata was available; precise interactions and states beyond the static PNGs are approximations, not pixel-perfect claims.
- All data and workflow transitions are in-memory demo fixtures. There is no production API, real OTP, VNeID/eKYC, payment/payout, dispatch, job acceptance, geolocation or Zalo OA integration.
- Visual layout and responsive behavior were not screenshot-verified in a browser or Zalo runtime.
- No merge or R6 work is included. This branch is awaiting independent review.

## Delivery

- Review request: `JOBFREE-ZMP-R5`.
- Original R5 implementation commit: `37296e3` (`feat(worker): implement R5 work workflows`).
- Review-fix implementation commit: `97e2b73d2dd0d708f9996dbd73a90794d5f04ee6` (`fix(worker): correct shift timelines and exceptions`).
- PR: not created; the branch is ready for independent review through GitHub's [new pull request page](https://github.com/NguyenDucAnhTai/jobfree-zalo-miniapp/pull/new/feat/zmp-r5-worker-workflows).
