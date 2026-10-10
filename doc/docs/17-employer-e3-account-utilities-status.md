# Employer E3 — Account & Utilities

## Baseline and scope

- Project: `JobFree_zalo_mini_app`.
- Branch: `feat/zmp-employer-lifecycle-e3`.
- Base: `0007d8c2f271ad10e53f818edcec9c8e7c54760c` (approved E2 + Worker Jobs UI hotfix).
- Scope: Employer Account, local profile and address management, rebooking, notifications, review/dispute history, support, informational settings and Home utilities.
- No E3 backend, production auth, payment, push, dispatch, GPS, live support or R6 work.

## Screen inventory

- Account home: synthetic profile hero, activity shortcuts, grouped account/service/support menu and unread notification indicator.
- Profile editor: validates display name, employer kind and optional display-only business label; save/cancel are session-local.
- Saved addresses: synthetic fixtures; add/edit/delete confirmation/default selection; a selected address pre-fills only the existing draft location field.
- Rebook: only completed/cancelled requests are eligible; opens an unsaved new draft with service, description and location copied. Date/start/end are cleared for fresh review. No assignment, Worker, communications, extension, review, case or completion state is copied.
- Notifications: fixed synthetic assignment, upcoming shift, check-in, extension, completion, review and case records; unread count derives from Employer records; mark-one/all-read and request link navigation are local.
- Review history: reads the existing E2 session review list and validates its displayed request/assignment relationship.
- Incident/dispute history: combines existing E2 fixture and session records. Opening a case uses the selected `disputeId`; detail checks the case, incident, request and assignment IDs together.
- Support: FAQ index and article details for request creation, matching, assigned contact, extension, completion, review, incident and dispute. Actions open only existing demo flows.
- Payment/privacy/terms/notification-preference/about pages are explicitly informational/demo-only.
- Employer Home retains carousel, service art, categories and prior utilities; adds request-derived pending-confirmation action and account utility shortcuts.

## State and fixture rules

- `src/types/employerAccount.ts` defines session profile, address and notification models.
- `src/mocks/employerAccountFixtures.ts` contains synthetic profile, addresses, a default address ID, linked notification fixtures and help articles.
- `src/mocks/employerAccountAdapter.ts` validates profile/address input, applies immutable address operations and derives unread counts/read state.
- Profile, address, notification-read and notification-preference state lives only in `AppShell` memory and resets on reload.
- Address default is a single explicit ID. Deleting it selects the first remaining address or clears the ID when none remain. New IDs use a stable in-session sequence; edits replace only the matching ID.
- Address selection updates only `EmployerRequestDraft.location`; it does not submit or modify a saved request.
- Rebooking creates a new draft with blank schedule fields; quote/budget is recalculated only after the user supplies a schedule in the existing draft flow.
- Incident submission now counts existing fixture records when generating IDs, avoiding collisions with the E2 controlled scenarios.
- Employer and Worker routes/data remain separated; Worker Account and bell behavior are unchanged.

## E1/E2 integration

- Existing Employer E1 assignment, matching, extension, tracking and shift fixtures are reused without candidate selection or state mutation.
- E2 review and dispute lists reuse the same session arrays already owned by `AppShell`; no duplicate review fixtures or rating updates are introduced.
- Dispute list navigation stores a selected case ID. Case detail rejects incomplete or mismatched request/assignment/incident/case links.
- Employer Home's “Cần bạn xử lý” list is derived from requests whose current status is `awaiting_employer_decision`.
- E2 extension, chat/call, completion, incident and Worker R4/R5 flows remain in the shared regression suite.

## Validation

Results from final implementation checks:

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run test`: attempted with the default worker configuration, but the run was stopped after more than four minutes when a failure was reported during the earlier iteration. It was not reported as PASS.
- `npx vitest run --maxWorkers=1`: PASS — 16 files / 133 tests, duration 346.10 seconds.
- `npm run build`: PASS — Vite 8.3.4; production CSS 86.44 kB and JavaScript 385.73 kB before gzip.
- CSS entry: `src/main.tsx` is the sole `src/App.css` importer; stylesheet regression test passed in the full suite. The production CSS asset contains the E3 account, hero and menu selectors.
- Production stylesheet asset: `dist/assets/index-EtNtJf3c.css`.
- Responsive viewports: Employer 375×812, 393×852, 440×956 and Worker 402×874 are `NOT VERIFIED`. The local Vite preview could not be opened in the available in-app browser (`ERR_CONNECTION_TIMED_OUT`), so there are no real-render screenshots.
- Zalo Mini App runtime: `NOT VERIFIED`.

## Design and limitations

- Account uses JobFree yellow, grouped warm-white cards, touch-sized rows, color-coded inline SVG icons, and existing safe-area/bottom-navigation shell.
- All menus navigate to an E3 screen, the existing request/history flow, or a clearly labeled informational state.
- Notification scenarios and settings are local demo state; they do not control real push.
- “Tin nhắn công việc” opens request history; conversations are opened only through a valid assignment detail.
- No real address lookup, map, payment method, support agent, ticket, review rating recalculation, adjudication or notification delivery exists.
- Visual layout and Zalo container compatibility require Product Owner/device review.

## Latest revision

- Latest commit SHA: pending commit.
