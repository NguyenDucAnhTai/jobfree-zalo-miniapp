# JobFree ZMP R2 implementation status

## Baseline and branch

- R2 branch: `feat/zmp-r2-employer-worker-figma`
- Baseline commit: `5c54164fb163c0c235f2895c561e64b25c553ed6`
- Baseline descends from R1 commit `7db1d72` and contains the saved wireframe archives.
- `main` is still at `1887442`; R1 is not merged into `main`. R2 was branched from the current `dev` commit that contains all R1 code and the later wireframe handoff, not from the stale `main` scaffold.
- No unrelated repositories are in scope.

## Implemented in R2

### Employer Core

- Employer Home: service cards, active request preview, routeable CTAs, and mock empty/loading/error states.
- Service Catalog: fixed categories and service summaries; selecting a service opens the request draft with that service selected.
- Employer Profile: synthetic account and menu; unsupported payment/address features are explicitly disabled, while the requests item navigates to its planned placeholder.
- Request Draft: service, work description, fictional location, date and time inputs, validation, live summary and in-memory demo save state.
- Employer draft state survives Employer/Worker context switches in the mounted app and is never rendered in Worker context.

### Worker Home from selected PNG reference

- Worker Home now follows `Trang chủ JobFree.png`: greeting, yellow job hero, verification/rating/readiness indicators, filter chips, job previews and Worker tab labels.
- PNG reference was selected by the Product Owner after a Figma URL was unavailable. No Figma page/frame IDs or prototype flow could be inspected; the implementation is an image-based approximation.
- Only Worker Home and navigation are implemented in R2. The inventory lists the rest of the exported Worker flows and which round they belong to.
- No camera, OTP, VNeID, eKYC, payment, payout, dispatch, GPS, or production API behavior was added.

## R1 follow-up findings

- CTAs: connected to in-scope local navigation/actions; out-of-scope notification/account controls are disabled with a clear demo label.
- Fixture schedule: fixed Worker dates use 10–12 October 2026; Employer preview is dated 10 October 2026; request draft defaults to 10 October 2026 with an 08:00–12:00 range.
- Validation record: populate below after this branch's validation. Responsive browser review remains pending if the local server cannot be opened in the browser.
- Visual verification must not be marked PASS based on source review alone.

## Known design/business notes

- Wireframe archive filename says Worker & Employer, but the available screens are Worker flows. Employer keeps the R1 design/tokens.
- Screenshot prototype edges are not available. Button navigation outside the implemented Worker Home uses explicit planned placeholders.
- The home illustration uses CSS and a synthetic initial avatar because no separate source artwork was included. This is an approximation, not a pixel-perfect claim.
- Draft state is held in app memory only; it is not stored to browser storage or a backend.

## Validation record

- Tests: PASS — `npm.cmd test -- --reporter=dot`, 4 files / 13 tests.
- Lint: PASS — `npm.cmd run lint`.
- Typecheck: PASS — `npm.cmd run typecheck`; production build also reruns `tsc -b`.
- Build: PASS — `npm.cmd run build`, Vite 8.3.4 emitted production assets.
- Employer 393×852 visual check: NOT VERIFIED — in-app browser could not open local preview (timeout).
- Worker 402×874 visual check: NOT VERIFIED — in-app browser could not open local preview (timeout).
- Zalo runtime verification: not performed; no compatible ZMP plugin/runtime configured.
- C2C review: blocked. C2C doctor did not recognize the current workspace and could not read local config. The required persistent sandbox allowlist command was rejected by automatic approval review, so no C2C INIT was sent.
- Implementation commit SHA: `2921b76` (`feat: implement JobFree R2 employer and worker home`).
- PR: not created. GitHub connector returned HTTP 403 `Resource not accessible by integration` for PR creation. Branch is pushed; manual PR form: `https://github.com/NguyenDucAnhTai/jobfree-zalo-miniapp/pull/new/feat/zmp-r2-employer-worker-figma` (base should be `dev`).

Do not mark R2 approved or begin R3/R4 until independent review.
