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

## Artwork and service catalog

- Asset: `public/images/employer-services-sprite.png`.
- Provenance: generated for this project with the built-in image-generation tool; a single 2×2 local sprite contains moving/logistics, cleaning, delivery and event-assistance illustrations. No external images, hotlinks, third-party brand assets or text/logo overlays are used.
- The sprite is cropped with CSS background positions into accessible service artwork elements. Each has a descriptive accessible name and a pastel background fallback if its local image cannot load.
- Existing service IDs, descriptions, reference labels and `onSelectService` behavior are preserved. The catalog uses the same illustrations and retains the fixture’s existing demo reference labels.

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

- Employer and Worker were inspected in the local browser at its default viewport. Employer hero and category artwork rendered; switching to Worker retained its existing dashboard, opportunity list and five-tab navigation.
- Exact Employer viewports 393×852 and 375×812, and Worker viewport 402×874: `NOT VERIFIED`; the browser viewport override was unavailable in this session.
- Zalo Mini App runtime: `NOT VERIFIED`.
- Lint: `PASS` — `npm run lint`.
- Typecheck: `PASS` — `npm run typecheck`.
- Tests: `PASS` — `npm run test`; 11 files / 83 tests. Targeted Employer refinement + Employer core: 16 passed. AppShell and Employer lifecycle suites also passed independently.
- Production build: `PASS` — `npm run build`; CSS emitted as `dist/assets/index-Bk9Uw6dV.css` (63.96 kB) and JavaScript as `dist/assets/index-_G1Hq-Ke.js` (312.69 kB).
- Public asset: `PASS` — `dist/images/employer-services-sprite.png` included (1,778,811 bytes); CSS remains imported through the existing main entry.

## Known limitations

- The generated sprite is a single 1.78 MB raster sheet rather than separate optimized WebP files; CSS crops each panel at render time. It is reused for the carousel and service cards, avoiding multiple network image requests, but a WebP conversion may reduce transfer size further.
- Browser inspection was at the environment’s default viewport, not the requested fixed mobile dimensions.
- Artwork is illustrative demo content and does not imply available workers, service guarantees, live pricing or matching results.
