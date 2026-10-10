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
- Incident UI validates a neutral description, records category and metadata-only evidence placeholder. It does not select or upload files.
- Dispute detail shows incident summary, case timeline and controlled status choices (`submitted`, `under_review`, `needs_information`, `resolved_demo`, `closed_demo`). Status changes are explicit demo controls; there are no automatic adjudication or compensation outcomes.

## Fixture links and authorization

- `src/mocks/jobfreeCommunicationsFixtures.ts` explicitly defines role-specific links: `requestId/jobId -> assignmentId -> shiftId -> conversationId`.
- Employer E1 links use `JF-E1-ASSIGN-*` and `JF-E1-SHIFT-*`; Worker R5 links use `demo-assignment-existing-*` and `demo-shift-*`. The IDs are deliberately separate. Similar names or services do not imply the same real transaction.
- `authorizeDemoCommunication` requires a valid assignment, matching conversation role and request/job references. Active assignment permits local demo chat/call. Replaced/cancelled/unavailable links are blocked. Completed links allow read-only chat history and block calls/new messages.
- Local message state is keyed by conversation ID and is displayed only in the current role context. Switching roles resets navigation and closes the active chat/call route. No production notification or delivery is claimed.

## Completion, review, incident and case models

- `src/types/employerCompletion.ts` keeps completion decisions, reviews, incidents and dispute cases distinct.
- `src/mocks/employerCompletionAdapter.ts` creates stable request/assignment-linked demo records and prevents repeated completion/review records.
- Fixed dispute and incident fixtures show under-review and resolved-demo states. User-submitted incidents produce local `submitted` cases with deterministic per-request sequence IDs.
- No adjudication, guilt finding, refund, compensation, payout, account penalty, funding, or Worker lifecycle mutation is performed.

## Test and build evidence

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS, 15 files / 110 tests.
- `npm run build`: PASS; production CSS emitted (`dist/assets/index-BynFYyE1.css`, 77.53 kB) and JS emitted (`dist/assets/index-bT4G238I.js`, 354.14 kB).
- `src/main.tsx` CSS entry check: `App.css` imported exactly once.
- Regression coverage includes communication authorization and role mismatch, completed/replaced/cancelled gating, local-only message append, empty/read-only chat, call-unavailable state, completion duplicate guard, review validation/duplicate guard, deterministic incident IDs, Employer E1 and Worker R5 navigation/state, role isolation, carousel/home and lifecycle existing tests.

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
