# JobFree ZMP R4 implementation status

## Baseline and references

- Branch: `feat/zmp-r4-worker-core`.
- Base commit: `53cda5f5c79eef24a192557bb861ef94a0b0bb95` (approved R3 head).
- The base ancestry includes R2 CSS hotfix `2814687` and R3 review fixes.
- Worker references: `Trang chủ JobFree.png`, `Tài khoản.png`, `Thêm Kỹ Năng.png`, `Trang Việc của tôi.png`, `Lịch trình.png`, `Ví JobFree.png`, `Pop-up việc.png`, and the onboarding PNG exports in `doc/design-reference/worker-employer-wireframes/wireframes-complete-v4/`.
- The bundle contains PNG exports, not Figma source or prototype metadata. Opportunities listing hierarchy is inferred from the Worker Home cards; do not claim pixel-perfect implementation.

## R4 implementation

- Worker Home keeps the R2 layout and existing five Worker bottom tabs. Discovery CTAs now open a distinct Worker-only “Việc mới” screen; the “Việc của tôi”, “Lịch trình”, and “Ví” tabs remain clearly labeled R5 placeholders.
- Worker account screen follows the account PNG's profile card, rating/completed-work/reliability metrics and profile menu hierarchy. All data is fictitious and labeled demo; identity verification is not performed.
- Worker skills screen supports local search, skill selection and save-in-session behavior, with static certificate information only. It does not upload or verify documents.
- Worker availability/readiness is a local demo toggle only, reflected on Worker Home, and is not sent to dispatch.
- Opportunities use fixed fixtures and filters for all, nearby (fixture labels only), immediate, higher pay, and earlier start. Demo UI can show success, empty, loading, error, and offline states. No location lookup, acceptance, dispatch, or production API is called. Opportunity detail is a Round 5 placeholder.
- Iteration 2 review fixes: Worker Home cards now send the selected opportunity ID through an explicit callback and navigate to the Worker-only opportunity detail placeholder; the detail shows that ID and returns to opportunities. No acceptance action was added. The Home hero count is derived from the supplied fixture and has an explicit empty-fixture label.
- Employer screens and lifecycle logic are not redesigned. Existing Employer tests run with the Worker changes; a new AppShell regression covers role switching and Employer draft navigation.
- `src/main.tsx` imports `App.css` exactly once; stylesheet-entry regression checks the import and Worker selector families. Production build emits the CSS asset.

## Validation

- Typecheck: PASS — `node_modules/.bin/tsc -b --pretty false`.
- Build: PASS — `node_modules/.bin/vite build`; Vite 8.3.4 emitted `dist/assets/index-67atCP0O.css` and the production JS asset.
- CSS: PASS — `App.css` is imported once and emitted by the build.
- Lint: NOT VERIFIED — `npm run lint` / direct ESLint invocation stalled without diagnostics in this Windows/OneDrive workspace.
- Tests: NOT VERIFIED — Vitest stalled during worker startup (including a single-worker retry); the new source tests cover selected-ID detail navigation/back, Employer isolation, fixture-derived count, and empty fixture but did not finish executing in this iteration.
- Employer visual viewport: NOT VERIFIED — no rendered screenshot captured at 393×852.
- Worker visual viewport: NOT VERIFIED — no rendered screenshot captured at 402×874.
- Zalo runtime: NOT VERIFIED — no Zalo Mini App runtime was available.

## Known limitations

- Static PNG exports do not provide verified prototype routes, component metadata, or a dedicated opportunities listing frame.
- Demo profile and availability state are in-memory only. No real OTP, VNeID, eKYC, payment, dispatch, geolocation, job acceptance, or production API integration exists.
- Iteration 2 lint and test processes did not complete in the current environment; rerun them in a stable local checkout before treating these additions as validated.
- No PR or merge is part of this implementation status; R4 must receive independent review first.
