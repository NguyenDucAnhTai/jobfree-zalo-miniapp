# Employer E2 + assignment communication demo status

## Baseline and branch

- Project/repository: `JobFree_zalo_mini_app` / `NguyenDucAnhTai/jobfree-zalo-miniapp`.
- Branch: `feat/zmp-employer-lifecycle-e2`.
- Base: approved E1 HEAD `1b2daac01d8a03c0ecbeb9887b3deb345edda9ab`.
- Scope: Employer E2 completion/review/incident/dispute UI and role-scoped assignment communication demo. E3, R6, merge and production integrations are out of scope.
- Framework versions were not changed. No additional dependencies were installed.

## Screens and navigation

- Employer Request Detail keeps E1 matching, assigned Worker, shift tracking and extension. For an active assignment only, it presents `Gọi` and `Nhắn tin` plus E20–E26 workflow entry points.
- Worker My Jobs and Worker Shift Detail present contact controls only when an explicit Worker assignment-to-shift communication link exists. The Worker My Jobs route opens the selected shift before showing chat/call, so back navigation returns to that shift detail and then the job list.
- Shared chat includes synthetic participant header, job and conversation IDs, fixed timeline timestamps, incoming/outgoing bubbles, quick messages, empty/read-only states, a 500-character composer and a role-specific local demo disclaimer. React renders submitted message content as text; it does not interpret HTML.
- Demo call presents idle/dialing/connecting/connected/ended UI states and unavailable states. No phone numbers, `tel:` navigation, microphone, WebRTC, audio capture or Zalo call APIs are used. Production VoIP/Zalo calling needs a separate feasibility review.
- Employer completion screen summarizes request, assignment, Worker fixture, schedule, event and reference budget. A pending-confirmation fixture can be confirmed or marked as an issue once. This changes only session-local Employer state; it creates no Worker earnings, payment or settlement.
- Review UI allows 1–5 stars, optional tags and feedback for an eligible completed request with a linked active assignment. Submission is local, duplicate guarded and does not recalculate the historical Worker rating.
- From a confirmed completion, `Tiếp tục đến đánh giá` now opens the review route directly while retaining the selected request and its session-local completion decision. A submitted review is read-only and cannot be submitted twice.
- Incident UI validates a neutral description, records category and metadata-only evidence placeholder. It does not select or upload files.
- Dispute detail shows incident summary, case timeline and controlled status choices (`submitted`, `under_review`, `needs_information`, `resolved_demo`, `closed_demo`). Status changes are explicit demo controls; there are no automatic adjudication or compensation outcomes.

## Fixture links and authorization

- `src/mocks/jobfreeCommunicationsFixtures.ts` explicitly defines role-specific links: `requestId/jobId -> assignmentId -> shiftId -> conversationId`.
- Employer E1 links use `JF-E1-ASSIGN-*` and `JF-E1-SHIFT-*`; Worker R5 links use `demo-assignment-existing-*` and `demo-shift-*`. The IDs are deliberately separate. Similar names or services do not imply the same real transaction.
- `resolveDemoCommunicationAuthorization` is a pure resolver called from `AppShell` using the current role and assignment/shift read models. It validates the canonical full ID tuple (`role`, `requestId/jobId`, `assignmentId`, `shiftId`, `conversationId`) before authorization. Employer uses explicitly linked E1 assignment and shift fixtures; Worker uses the current assignment and shift arrays in AppShell. Conversation `assignmentStatus` is descriptive fixture metadata, never proof of current authorization.
- Policy: no/mismatched assignment is unavailable; active assignment permits local demo chat/call; replaced/cancelled assignment denies both; completed assignment permits chat history only and denies new messages/calls. Chat rendering and send/call are guarded at action/timer boundaries. Employer and Worker namespaces remain separate; message state stays keyed by role-specific conversation ID.
- Employer completion decision remains distinct from the E1 assignment/shift read model and does not mutate Worker records. Production completion authority is not modeled.
- Local message state is keyed by conversation ID and is displayed only in the current role context. Switching roles resets navigation and closes the active chat/call route. No production notification or delivery is claimed.

## Completion, review, incident and case models

- `src/types/employerCompletion.ts` keeps completion decisions, reviews, incidents and dispute cases distinct.
- `src/mocks/employerCompletionAdapter.ts` creates stable request/assignment-linked demo records and prevents repeated completion/review records.
- Fixed dispute and incident fixtures show under-review and resolved-demo states. User-submitted incidents produce local `submitted` cases with deterministic per-request sequence IDs.
- No adjudication, guilt finding, refund, compensation, payout, account penalty, funding, or Worker lifecycle mutation is performed.

## Test and build evidence

### Review iteration 2 fixes

- Employer authorization reads explicitly linked E1 assignment/shift fixtures; Worker authorization reads current AppShell assignment/shift state. Invalid ID relationships and wrong-role links are denied. Current completed state is read-only for chat and blocks calls/messages; cancelled/replaced states deny access even when a conversation fixture still says active.
- Completion-to-review navigation uses an explicit callback and keeps request/assignment context. AppShell regression now follows confirmation → review → submit → read-only review.
- Demo call timers are held in refs and cleared on End, unmount, conversation identity change and authorization loss. Each delayed transition rechecks current authorization and attempt identity; End terminates that attempt.
- Added regression coverage for live Employer/Worker authorization, invalid request/assignment and assignment/shift pairs, cross-role links, current state transitions, send denial, role-scoped message isolation and call timer cleanup.

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS, 15 files / 121 tests on the review-fix working tree.
- `npm run build`: PASS; production CSS emitted (`dist/assets/index-BynFYyE1.css`, 77.53 kB) and JS emitted (`dist/assets/index-8tquU5C0.js`, 356.30 kB).
- `src/main.tsx` CSS entry check: `App.css` imported exactly once.
- Regression coverage includes communication authorization and role mismatch, completed/replaced/cancelled gating, local-only message append, empty/read-only chat, call-unavailable state, completion duplicate guard, review validation/duplicate guard, deterministic incident IDs, Employer E1 and Worker R5 navigation/state, role isolation, carousel/home and lifecycle existing tests.
- Final review-fix validation: `npm run lint` PASS; `npm run typecheck` PASS; `npm run test` PASS (15 files / 121 tests); `npm run build` PASS. CSS remains imported once from `src/main.tsx` and is included in production output.

## Design and runtime limitations

- Screens use the current JobFree yellow/warm-white design and responsive CSS. They are frontend mock approximations, not pixel-matched reference designs.
- Employer 393×852, Employer 440×956, Worker 402×874 and small 375×812 actual rendered screenshot checks: **NOT VERIFIED**.
- Zalo Mini App runtime: **NOT VERIFIED**. No Zalo device/runtime was available for this validation.
- Browser keyboard resize behavior and device safe-area behavior should be visually reviewed by the Product Owner.
- Production communication authorization, secure message transport/storage, VoIP/Zalo call compatibility, completion authority, review moderation and dispute policy remain backend/product decisions.

## Files added or changed

- Added communication and completion types, fixtures, mock adapters and adapter tests under `src/types/` and `src/mocks/`.
- Added shared `ConversationScreen` and `DemoCallScreen`, with component tests under `src/features/shared/`.
- Added Employer completion/review/incident/dispute screens and AppShell navigation/state integration.
- Added contact actions to Employer Request Detail and Worker My Jobs/Shift Detail.
- Added E2 styles in `src/App.css` and E2 route labels in `src/navigation/navigation.ts`.
- Extended `src/app/AppShell.test.tsx` with Employer/Worker chat isolation, call demo, completion/review and incident/dispute paths.
