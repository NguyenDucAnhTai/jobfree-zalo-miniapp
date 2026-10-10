# Employer UI refinement status

## Branch and baseline

- Branch: `feat/zmp-employer-ui-refinement`.
- Baseline: `60e4f51b04afce5ff37f58f2ca8eaa5304efc7c9` (`feat/zmp-r5-worker-ui-refinement`), verified clean before branching and containing the approved Worker refinement.
- Scope: Employer Home and service catalog presentation; no R6, merge, framework change, backend call or production integration.

## Home layout and banner inventory

Employer Home now follows a mobile service-marketplace hierarchy:

1. Visible `DEMO · NON-PRODUCTION` marker.
2. Three fixed local carousel banners with JobFree yellow styling, concise service copy, locally stored service illustration and direct CTA.
3. Two-column service discovery cards.
4. Four quick utilities.
5. Existing request preview, with status, location, scheduled time, budget and history navigation.

Banner fixtures in `src/mocks/employerHomeFixtures.ts`:

| Banner | Copy | CTA destination | Illustration |
|---|---|---|---|
| Primary support | “Tìm người phù hợp, việc xong nhẹ nhàng.” | Existing Employer request draft | Event-assistance scene |
| Moving | “Cần hỗ trợ bốc xếp?” | Existing service catalog | Moving and logistics scene |
| More help | “Thêm người hỗ trợ, công việc gọn hơn.” | Existing service catalog | Cleaning scene |

The carousel supports horizontal touch gestures, previous/next buttons and selectable indicators. It does not auto-rotate. Banner copy contains no discount or matching guarantee.

## Review fix: mobile banner and artwork (Iteration 2)

- Review baseline: `99cf4ad33d5a84609ec099485c96f51decb3d1ce`; branch remains `feat/zmp-employer-ui-refinement`.
- Banner root cause: the copy used a 67% width while art was absolutely positioned at roughly 46–49%; these independent widths overlapped. The heading was also rendered with forced `<br>` elements from title arrays.
- Banner fix: the banner is now a two-column CSS grid with separate text and art tracks. All three titles are ordinary text and wrap naturally; the copy has `min-width: 0`. At narrow widths the art track shrinks. Carousel indicators, arrows, swipe and CTA destinations remain unchanged.
- Image root cause: one 2×2 sprite was painted at `background-size: 200% 200%` in containers with different aspect ratios, stretching each crop.
- Image fix: extracted four 623×623 crops from the project-generated source, preserving each panel's square aspect ratio. Encoded locally as JPEG quality 88 because no WebP encoder is available in the environment. Original source is retained at `doc/design-reference/employer-services/employer-services-sprite.png`; it is no longer a public runtime asset.
- Assets: `employer-moving.jpg` 53,668 bytes; `employer-cleaning.jpg` 62,468 bytes; `employer-delivery.jpg` 60,756 bytes; `employer-events.jpg` 57,899 bytes (234,791 bytes combined vs 1,778,811-byte source sprite, about 87% smaller).
- `ServiceArtwork` now uses local `<img>` elements, `object-fit: contain`, centered positioning, lazy loading and async decoding. Informative images retain descriptive alt/fallback labels; category/catalog/recent-request art is marked decorative because adjacent controls already name the service. Failed loads show a contained pastel fallback.
- Existing service IDs, descriptions, demo reference labels and `onSelectService` behavior are unchanged.

## Utilities and request preview

- `Tạo yêu cầu` opens the existing request draft.
- `Theo dõi công việc` opens existing request history.
- `Xem dịch vụ` opens the existing service catalog.
- `Hướng dẫn sử dụng` opens a local informational panel; its CTA starts the existing draft flow. It states that no request or payment is sent.
- Recent request title, location, time, budget and status continue to come from `employerJobs`; its CTA opens history/detail navigation.
- Existing empty, loading, error and offline mock states remain labeled demo UI.

## UX and regression decisions

- Styling is scoped to Employer classes; Worker layout selectors were left unchanged.
- Existing Employer four-tab and Worker five-tab SVG navigation are preserved.
- Employer Home tests cover banner inventory/content, CTA navigation, indicators, previous/next controls, touch gestures, category IDs and selection, artwork labels/fallback colors, quick utilities, guide panel, recent request data and mock states.
- Existing Employer draft/summary/history/detail and Worker R4/R5 regression suites are included in the full test run.
- The `src/main.tsx` single-`App.css` import regression remains in place.

## Verification

- Tests: `PASS` — `npm run test`; 11 files / 87 tests. Employer refinement coverage includes all three banner copy/CTA destinations, local image mappings, ratio-safe image treatment, broken-image fallback, service selection, Employer flow regression, Worker regression and a single `App.css` import guard.
- Lint: `PASS` — `npm run lint`.
- Typecheck: `PASS` — `npm run typecheck`.
- Production build: `PASS` — `npm run build`; CSS emitted as `dist/assets/index-Dd7SDsMU.css` (64.05 kB) and JavaScript as `dist/assets/index-Da6KCKqF.js` (312.97 kB).
- Production CSS/assets: `PASS` — stylesheet import count is one; built CSS contains grid and `object-fit` declarations. Four local image files are emitted to `dist/images/` (234,791 bytes combined); the source sprite is not emitted to runtime assets.
- Employer/Worker viewport matrix requested by review: `NOT VERIFIED` pending real screenshots. The available in-app browser control in this session does not expose an explicit viewport override, so no fixed-size screenshot is claimed. Employer 320×700, 360×780, 375×812, 393×852, 402×874 and 440×956; Worker 375×812 and 402×874 remain unverified.
- Banner text/art separation and image aspect treatment are covered at source/test level only; JSDOM does not establish rendered geometry.
- No rendered screenshots were captured in this iteration; the local preview URL did not load in the available browser. No screenshot evidence path is available.
- Zalo Mini App runtime: `NOT VERIFIED`.

## Known limitations

- WebP was preferred by the review but no local encoder was available; optimized JPEG crops are used instead.
- Fixed mobile viewport screenshot verification remains outstanding.
- Artwork is illustrative demo content and does not imply available workers, service guarantees, live pricing or matching results.
