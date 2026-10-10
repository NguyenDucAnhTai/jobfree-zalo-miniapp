# Worker UI refinement status

## Iteration 2 review refinement

- The Product Owner confirmed the attached screenshot as the canonical reference. It is stored at `doc/design-reference/worker-dashboard/worker-home-target.png` and was inspected before visual changes.
- Shift-control tiles now use the screenshot's distinct warm amber COD, green Check-in, blue-gray Service, coral Report and ochre Break palette. Controls remain disabled and display-only.
- The shift section heading follows fixture status: `scheduled` → “Ca sắp tới”; `en_route` / `checked_in` → “Ca đang diễn ra”; no supplied shift → “Ca sắp tới”; other statuses → “Ca theo dõi”.
- Regression tests cover each heading, the empty state and the five per-control color classes. The screenshot values were not copied; the dashboard fixture remains separate from lifecycle and wallet data.
- Screenshot comparison can now use the saved confirmed target. Actual rendered viewport screenshots and responsive visual checks remain pending until captured; Zalo runtime remains unverified.

## Baseline and reference

- Branch: `feat/zmp-r5-worker-ui-refinement`.
- Base: approved R5 HEAD `366f8a658c5324d8747d1a79570138299211fc6f`; verified as an ancestor before branching.
- Implementation source commit: `be0d8d65f163201d825acd103149a315a4e8ccfb`.
- The Product Owner confirmed the newly supplied redesign image as the target; the image is saved at `doc/design-reference/worker-dashboard/worker-home-target.png`.
- Iteration 0 followed the written refinement specification. Iteration 2 compared the reference image directly for the shift-control palette; full rendered screenshot comparison remains pending.

## Worker Home refinement

- The shared Worker header now uses the existing `workerProfileDemo` identity and `workerReady` state, with a yellow background, initial avatar, readiness label and outlined demo notification action.
- Worker Home now presents a dashboard summary, current/upcoming shift card, disabled demo-only shift controls, and the preserved opportunity filters/job cards with an explicit “Khám phá việc mới” destination.
- Dashboard totals come from `src/mocks/workerDashboardFixtures.ts`, a fixed dashboard-only scenario separate from lifecycle shifts and wallet transactions. The pay amount is labeled as a reference fixture and not settled income. Break duration is shown as unavailable because the fixture does not contain it.
- Existing R5 scheduled shift `demo-shift-001` is shown as upcoming. The time circle displays its scheduled start time, not a live countdown. The detail CTA opens that existing Shift Detail and returns through My Jobs. No active shift or new assignment is fabricated.
- COD, check-in, service, report and break controls remain disabled with a demo explanation. No production API, GPS, camera, payment, incident reporting, overtime or dispatch behavior was added.

## Bottom navigation

- Worker still has five tabs: Trang chủ, Việc của tôi, Lịch trình, Ví and Tài khoản.
- Navigation now uses shared inline SVG icons for home, checklist, calendar, wallet and user profile, with equal-width tabs, active color/indicator, touch targets and safe-area bottom padding.
- Employer keeps its existing four routes and labels; its icons also use the shared SVG rendering.

## Preserved behavior and tests

- Worker opportunity filters, selected opportunity detail and discovery route remain available below the dashboard.
- Employer screens and lifecycle implementation were not redesigned.
- Added regression coverage for dashboard fixture totals (including empty fixture), scheduled/empty shift behavior, Shift Detail navigation, profile/readiness display, disabled controls, five Worker tabs, SVG icons, Employer tabs and AppShell role isolation.
- The existing stylesheet-entry regression checks that `src/main.tsx` imports `App.css` exactly once.

## Verification

- Screenshot reference: `ACCESSIBLE` — `doc/design-reference/worker-dashboard/worker-home-target.png`; inspected for iteration 2 color/layout comparison.
- Local browser: app opened at `http://localhost:5173/`; the initial visible screen was Employer. Exact Worker viewport screenshots at 402×874, 375×812 and 393×852 were not captured.
- Worker visual 402×874: `NOT VERIFIED`.
- Employer visual 393×852: `NOT VERIFIED`.
- Responsive visual 375×812: `NOT VERIFIED`.
- Zalo Mini App runtime: `NOT VERIFIED`.
- Lint: `PASS` — `npm run lint`.
- Typecheck: `PASS` — `npm run typecheck`.
- Tests: `PASS` — `npm run test`; 10 files / 67 tests. Includes the `App.css` single-import regression, Worker/Employer navigation and lifecycle tests.
- Build: `PASS` — `npm run build`; Vite 8.3.4 emitted `dist/assets/index-B0D-FnBR.css` (55.10 kB) and `dist/assets/index-cW3WOPsV.js` (306.74 kB).
- CSS entry and production asset: `PASS` — `src/main.tsx` imports `App.css` once; `src/styles-entry.test.ts` passed in the full suite; production CSS is bundled.

## Known limitations

- DESIGN_APPROXIMATION: targeted comparison was made from the supplied PNG, but no actual rendered app screenshots were captured; exact visual alignment is not verified.
- Dashboard is an explicitly isolated fixed demo scenario; it is not a wallet settlement, lifecycle assignment or real-time “today” feed.
- No merge and no R6 work are included.
