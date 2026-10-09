# JobFree Zalo Mini App — R1 implementation status

## Scope delivered

This branch implements the frontend shell and R1 home previews. Employer home includes service category cards and one active request preview. Worker home includes an upcoming shift, two available offer previews, and a no-offer UI state component. Navigation destinations outside this round show an explicit planning placeholder. Changing demo context resets navigation to that context's home.

All displayed names and jobs are fixed fictional data. The context switch is a UI demo only; it does not authenticate or authorize a user. There is no production API, Zalo identity, payment, payout, eKYC, real dispatch, live location, or production Zalo OA integration.

## ZMP integration status

The existing scaffold uses React 19, Vite 8, and TypeScript 6. The official `zmp-vite-plugin@1.1.6` declares a Vite 4/5 peer range, while the official Zalo blank template's Vite 5 variant uses React 18 and Vite 5. This implementation therefore preserves the existing framework versions and does not force-install or configure the incompatible plugin. No ZMP SDK/UI, ZMP tooling, or App ID has been configured yet. The app is a browser demo until an official compatible toolchain is selected and verified.

## Design and source notes

Tokens were copied from `doc/src/theme/jobfree-tokens.css` into `src/theme/jobfree-tokens.css` and loaded at startup. Sketch exports were not present in this handoff, so these screens are design approximations and are not claimed to be pixel-perfect. Full Employer home workflows belong to R2 and full Worker home workflows belong to R4 per the product delivery plan; this branch includes only the previews requested for R1.

## Validation record

Fill in only after the commands and viewport checks have actually run:

- Lint:
- Typecheck:
- Unit tests:
- Production build:
- Browser viewport 393×852:
- Browser viewport 402×874:
- Zalo runtime verification: not performed in this browser-only environment.
