# Worker design inventory — PNG handoff reference

## Source/access status

- Product Owner selected the saved wireframe PNG exports as the visual source for this implementation.
- Reference bundle: `doc/design-reference/worker-employer-wireframes/wireframes-complete-v4/`.
- The ZIP contains exported PNGs only; no Figma `.fig` file, URL, page/frame IDs, component metadata, or prototype links were available to inspect.
- Therefore `Figma page/frame ID` is `unavailable` for every row and navigation behavior is based on visible controls and the product requirements, not a verified Figma prototype.
- Do not describe the implementation as pixel-perfect or the inventory as a direct Figma API audit.

## Screen inventory

| Figma page/frame ID | Exported screen | Purpose | Visible components | Prototype/interaction evidence | UI state visible | Source | Implementation |
|---|---|---|---|---|---|---|---|
| unavailable | `Trang chủ JobFree.png` | Worker job discovery home | Greeting/header, notification icon, yellow hero, profile status/rating/readiness, filter chips, job cards, bottom nav | Static export only; filters and navigation are inferred from labels | Populated jobs; verified/ready profile | Local PNG export | Implemented in R2, approximation from image |
| unavailable | `Trang Việc của tôi.png` | Worker job list/history | Job tabs, upcoming job, pending confirmation, recent history, bottom nav | Static export only | Upcoming, pending, completed | Local PNG export | Deferred to R4/R5 |
| unavailable | `Lịch trình.png` | Worker availability and shifts | Calendar strip, scheduled shift cards, status chips, bottom nav | Static export only | Scheduled; awaiting confirmation | Local PNG export | Deferred to R5 |
| unavailable | `Ví JobFree.png` | Worker earnings view | Balance summary, withdrawal/bank actions, income metrics, transaction list, bottom nav | Static export only | Pending and completed transactions | Local PNG export | Deferred to R5; no real money behavior |
| unavailable | `Tài khoản.png` | Worker profile and settings | Profile card, rating/jobs/reliability, skill/availability/verification menus, settings, bottom nav | Static export only | Profile with verification indicator | Local PNG export | Deferred to R4; no real identity data |
| unavailable | `Thêm Kỹ Năng.png` | Worker skill profile editor | Search, selected skill chips, skill groups, certificate cards, save button | Static export only | Selected skills and certificates | Local PNG export | Deferred to R4 |
| unavailable | `Pop-up việc.png` | New job offer overlay | Offer summary, pay, schedule/location, defer and accept actions | Static export only; no verified prototype edge | Offer available, confirm/defer choices | Local PNG export | Deferred to R5; no offer acceptance in R2 |
| unavailable | `Đăng ký.png` | Worker sign-up | Registration form and continue control | Static export only | Onboarding | Local PNG export | Deferred; no authentication |
| unavailable | `Xác thực.png` | Phone verification entry | Verification explanation and actions | Static export only | Onboarding | Local PNG export | Deferred; no OTP/network calls |
| unavailable | `Xác thực OTP.png` | OTP entry | Six code cells, timer, confirm, VNeID alternative | Static export only | OTP pending | Local PNG export | Deferred; no OTP/network calls |
| unavailable | `18. Xác thực danh tính.png` | Identity verification choice | Benefits, VNeID and manual identity actions | Static export only | Verification choice | Local PNG export | Deferred; no eKYC |
| unavailable | `19. Đồng ý liên kết VNeID.png` | VNeID consent | Data access list, continue action | Static export only | Consent pending | Local PNG export | Deferred; no VNeID connection |
| unavailable | `20. Đang kết nối VNeID.png` | VNeID connection | Loading/connection view | Static export only | Connecting | Local PNG export | Deferred |
| unavailable | `20. Đang kết nối VNeID Loading 1.png` | VNeID loading variant | Loading state | Static export only | Loading variant 1 | Local PNG export | Deferred |
| unavailable | `20. Đang kết nối VNeID Loading 2.png` | VNeID loading variant | Loading state | Static export only | Loading variant 2 | Local PNG export | Deferred |
| unavailable | `20. Đang kết nối VNeID Loading 3.png` | VNeID loading variant | Loading state | Static export only | Loading variant 3 | Local PNG export | Deferred |
| unavailable | `21. Xác thực thành công.png` | Verification success | Success message, worker profile summary, continue action | Static export only | Verified success | Local PNG export | Deferred; display only if later scoped |
| unavailable | `22. Hoàn tất hồ sơ.png` | Finish worker onboarding | Profile completion and start-work action | Static export only | Onboarding completion | Local PNG export | Deferred; no auth/verification |
| unavailable | `Hoàn tất hồ sơ.png` | Profile completion export | Profile summary and completion CTA | Static export only | Completion | Local PNG export | Deferred |
| unavailable | `Xác Thực Gương mặt.png` | Face verification scan | Face camera frame and scan guidance | Static export only | Ready to scan | Local PNG export | Deferred; no camera, biometrics, or eKYC |
| unavailable | `Rectangle 2.png`, `Navigation Shell.png` | Small auxiliary exports | No reliably inspectable screen/component structure | No prototype evidence | N/A | Local PNG exports | Not treated as standalone screens |

## R2 Worker implementation notes

- R2 implements only Worker Home and its navigation shell, as requested. The page follows the exported hierarchy: greeting, job hero, profile indicators, filters, job cards, and bottom tabs.
- Filters sort/filter the deterministic local Worker fixtures. They do not query location or dispatch services.
- Navigation destinations outside this scope remain explicit demo placeholders.
- The export contains a small portrait/avatar image inside a screenshot but no separate source asset. The implementation uses a synthetic initial avatar instead of cropping an image out of the screenshot.
- Worker job dates are fixed at 10–12 October 2026 so fixture schedules remain consistent and do not depend on the machine clock.
