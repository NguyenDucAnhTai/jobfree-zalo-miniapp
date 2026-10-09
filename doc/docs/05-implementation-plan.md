# Frontend delivery plan — weighted coverage

| Round | Scope | Weight | Cumulative |
|---|---|---:|---:|
| R1 | Shell, theme, navigation, explicit context switch, demo indicator | 10% | 10% |
| R2 | Employer home, catalog, profile, request draft | 16% | 26% |
| R3 | Employer quote preview, request history/detail, mock matching states | 14% | 40% |
| R4 | Worker home, profile/readiness, opportunity listing | 16% | 56% |
| R5 | Worker offer detail/accept simulation, job/shift states | 14% | 70% |
| R6 | Accessibility, responsive, error states, regression, documentation | 30% | 100% |

## R1 acceptance
- Official ZMP React/TS/Vite scaffold initialized separately.
- Both contexts render their own home shell and navigation.
- Switcher is explicit; no role state/cache leakage.
- Design tokens wired into theme; demo indicator visible.
- Loading/empty/error baseline components.
- Tests for context switch and isolation; lint/typecheck/build where configured.

## Review gates
- Each round requires a PR and independent review before next round.
- Report screen IDs covered, state variants, tests, known design approximations and weighted coverage.
- No live backend/auth/payment/eKYC/OA/dispatch, no secrets, no production deployment.
- Do not claim pixel-perfect without visual reference exports.

Coverage weights are **planning allocations**, not measured progress until screens and tests are independently reviewed.
