# Employer lifecycle E1 implementation status

## Baseline and branch

- Project: `JobFree_zalo_mini_app`
- Branch: `feat/zmp-employer-lifecycle-e1`
- Base: `0aeab2fa0626e2a0a04af0e6dc7d7f3d914fa00e` (Employer visual hotfix and approved prior frontend work)
- Scope: E1 only. E2, E3, R6 and merge are out of scope.

## Implemented screens and flow

- E13 matching progress, awaiting-result, no-Worker and unavailable demo states are selectable from Employer Request Detail. No candidate list or Worker selection is shown.
- E14 assigned Worker presentation uses synthetic initials/avatar, display name, demo rating and completed-job count after an explicit assignment fixture exists.
- Replacement matching continues to show only the ended Worker as former and says that no replacement is present in the fixture.
- E15/E16 display an Employer shift status card, planned start/end and a separate chronological event timeline. Employer controls cannot set check-in or completion status.
- E18 extension bottom sheet offers +30 minutes, +1 hour and +2 hours, a proposed end time and a fixed reference fee labeled demo. Submission only creates a local demo request. Only `approved_demo` presents a separate effective end time; the source schedule remains intact.
- The existing Home → History → Request Detail navigation is retained. Scenario selection remains within Request Detail, and the sheet is dismissible.

## Fixture relationships and IDs

`src/mocks/employerLifecycleFixtures.ts` contains separate Employer E1 read models rather than joining unrelated Worker lifecycle records:

| Request | Assignment | Shift | Scenario |
|---|---|---|---|
| `JF-DEMO-0105` | `JF-E1-ASSIGN-0105` | `JF-E1-SHIFT-0105` | Checked in / working |
| `JF-DEMO-0107` | `JF-E1-ASSIGN-0107` | `JF-E1-SHIFT-0107` | Pending Employer confirmation |
| `JF-DEMO-0108` | `JF-E1-ASSIGN-0108` | `JF-E1-SHIFT-0108` | Completed read-only scenario |

All event times are fixed ISO timestamps. The fixture scheduled times are separate from event times. These synthetic IDs intentionally do not imply a backend relationship or real Worker identity.

## Matching and extension semantics

- Matching outcomes are view-only local demo state, not an algorithm or dispatch operation.
- Assignment profile values and avatar art are synthetic. No phone number, CCCD, face recognition or live GPS is exposed.
- Extension result scenarios are internal frontend demo labels, not production API states or approved business rules.
- Demo reference fees: 25,000 VND / 30 minutes, 50,000 VND / 60 minutes, 100,000 VND / 120 minutes. These are controlled fixture values, not production pricing.
- A submitted/pending extension does not update `scheduledEndAt` or the Worker shift fixture. Duplicate pending requests for the same shift are blocked. Only an explicit `approved_demo` result includes a separate effective end time for presentation.
- No payment, funding, Worker consent, matching, location or production API is simulated as a real action.

## Tests and verification

- E1 tests cover matching states, absence of selectable candidates, synthetic assigned Worker, replaced Worker presentation, explicit linked IDs, chronological shift events, all three extension durations, midnight crossing, duplicate/invalid requests, immutable original schedule and approved-versus-submitted outcomes.
- Employer Request lifecycle tests cover draft/summary/history/detail and role isolation. Existing Worker and Employer marketplace suites remain part of the full run.
- CSS entry validation remains covered by the pre-existing single `App.css` import regression; production build asset verification will be recorded with final delivery.
- Commands and final counts are recorded after the complete validation run below.

## UX approximation and limitations

- Existing JobFree yellow palette, rounded cards, status colors and mobile layout are reused.
- There is no Employer E13–E23 Figma/frame inventory in the checked-in docs, so these screens are implementation approximations based on the current design system and approved behavior, not pixel-matched designs.
- Worker identity and status are fixtures for demo presentation only. No real-time event updates are present.
- Browser viewport screenshots and Zalo Mini App runtime are not claimed unless separately captured/verified.

## Final validation

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npx vitest run --maxWorkers=1 --reporter=dot`: PASS — 12 files / 96 tests. Serial execution is used because this environment intermittently timed out one long AppShell test under concurrent load; its test timeout is set to 15 seconds, matching the existing long navigation test.
- `npm run build`: PASS — Vite emitted `dist/assets/index-BFSaNXKu.css` (70.66 kB) and `dist/assets/index-DpwWXqNO.js` (325.76 kB).
- CSS entry check: PASS — `src/main.tsx` imports `App.css` once; the built CSS contains the new Employer E1 selectors.
- `git diff --check`: PASS.
- Employer 393×852, Employer 440×956, Worker 402×874: NOT VERIFIED. A local Vite server started, but the in-app browser could not connect (`ERR_CONNECTION_TIMED_OUT`), so no rendered screenshots or viewport evidence were captured.
- Zalo Mini App runtime: NOT VERIFIED.
