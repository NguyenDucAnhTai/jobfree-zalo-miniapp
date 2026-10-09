# JobFree ZMP R3 implementation status

## Baseline

- Branch: `feat/zmp-r3-employer-lifecycle`.
- Base commit: `2814687` on `feat/zmp-r2-employer-worker-figma`.
- `dev` did not contain R2 or CSS hotfix `2814687` when this branch was created.
- R2 and Worker PNG-based home are included in the branch ancestry; no Worker home redesign is part of R3.

## Employer screens and screen IDs

| Screen / flow | Handoff ID | Implementation |
|---|---|---|
| Employer request draft | E10 | Existing R2 form; valid local save now opens the summary |
| Request summary and quote preview | E12A | Service, details, demo location, date/time, duration, mock hourly rate and reference budget; edit returns to the draft |
| Employer request history | E24 | Fixed request fixtures, one status filter per lifecycle state, plus all/empty/loading/error/offline views |
| Request detail / matching | E13, E13A–C | Request ID, details, current state and deterministic timeline |
| Assignment preview / in progress | E14–E16 | Synthetic Worker and shift shown only in assigned/awaiting/completed scenarios; matching has no Worker |
| Completed / cancelled history | E22, E25–E26 | Read-only fixture states in history and detail |

The handoff's many Sketch variants are grouped into the matching/detail view for this R3 scope. Messaging, overtime, incident requests, checkout, ratings, vouchers, address/payment management and production actions remain deferred.

## Mock contract and navigation

- Status union follows the requested v2 values: `draft`, `funding_pending`, `funding_failed`, `matching`, `assigned`, `replacement_matching`, `awaiting_employer_decision`, `completed`, `cancelled`.
- `src/mocks/employerRequestAdapter.ts` owns fixed IDs, dates, mock quote rates, status labels, timeline events and the `getEmployerRequestsMock` state adapter. No runtime random or production API is used.
- Employer flow: Home → Service Catalog → Request Draft → Summary → History → Detail. Summary can return to edit; detail can return to history or switch among fixed demo scenarios.
- Funding, matching, assignment and completion are presentation-only scenarios. The UI never lets an Employer select a Worker and never reports a real payment.
- Employer draft/history/detail destinations are guarded to Employer context. Switching role returns to the role's home; Worker state remains separate.

## Worker and CSS regression protection

- Worker Home, filters, Worker tab labels, PNG-inspired layout and Worker fixtures were left unchanged.
- Existing Worker tests and role-switch tests are run with the new Employer lifecycle tests.
- R2 stylesheet entry regression remains in `src/styles-entry.test.ts`; App.css must be imported exactly once by `src/main.tsx`.

## Deferred / known limits

- All quote values, Worker assignment details and lifecycle state transitions are deterministic fixtures, not server decisions.
- The local draft is in-memory and one current demo draft is shown; it is not persisted after refresh.
- No production funding, payment, matching, Worker selection, messaging, GPS, identity or ZMP runtime has been added.
- Employer Sketch originals and prototype links were not available for visual diff. Employer screens follow the saved UI handoff and current JobFree tokens; do not claim pixel-perfect fidelity.
- Browser visual checks at Employer 393×852 and Worker 402×874 are pending if local preview cannot be reached from the browser sandbox.
- C2C INIT/review was not sent: the `c2c` CLI is unavailable in this environment and the connected workspace MCP returned an internal error. Do not treat the attachment text as a C2C plan/review response.

## Validation record

- Tests: PASS — Vitest 6 files / 22 tests.
- Lint: PASS — `npm run lint`.
- Typecheck: PASS — `npm run typecheck`.
- Build: PASS — `npm run build` (Vite 8.3.4; CSS 29.21 kB, JS 257.62 kB).
- Production CSS asset check: PASS — `dist/index.html` links the CSS asset and 12 required selector families are present.
- Employer visual 393×852: NOT VERIFIED — local preview was not reachable from the browser tool.
- Worker visual 402×874: NOT VERIFIED — local preview was not reachable from the browser tool.
- ZMP runtime: NOT VERIFIED — only browser production build was available; no Zalo client runtime check.
- Commit SHA: `4300f54f2569160b6ee1486c44da98ce8b5bd67d`.
- PR URL / base: PR creation via the connected GitHub integration returned HTTP 403 (`Resource not accessible by integration`). Create manually at `https://github.com/NguyenDucAnhTai/jobfree-zalo-miniapp/compare/feat/zmp-r2-employer-worker-figma...feat/zmp-r3-employer-lifecycle?expand=1`; base is `feat/zmp-r2-employer-worker-figma` because R2 is not merged into `dev`.

Wait for independent Product Owner/reviewer inspection before opening R4.
