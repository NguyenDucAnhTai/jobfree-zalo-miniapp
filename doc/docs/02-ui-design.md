# UI design handoff

## Nguồn Sketch
- Employer: **66 frames**, viewport tham chiếu **393×852**.
- Worker: **21 frames**, viewport tham chiếu **402×874**.
- Sketch SHA-256: `21021133e2a39caea62f4d1a57673b9149ab7b581de9829e8aaabe3a2f7d7b36`.
- Bản render toàn bộ Sketch chưa được truy cập ở handoff này: **không tuyên bố pixel-perfect**.
- Worker: gắn `DESIGN_APPROXIMATION` trong các màn/PR tương ứng.

## Token đã xác minh
- Primary `#FFC400`; Employer pressed `#E6A900`, Worker pressed `#B77900`.
- Employer soft `#FFF4D1`, Worker soft `#FFF1B8`.
- Text `#111111`, secondary `#6B7280`, muted `#9CA3AF`.
- Surface `#FFFFFF`, soft `#FAFAFA`, border `#EDEDED`, divider `#F1F1F1`.
- Success `#22C55E`, info `#3B82F6`, warning `#F59E0B`, error `#EF4444`.
- Font Roboto; screen title 24/700 theo guide nhưng Sketch shared style 23/Medium; section 18; body 14; caption 12; button 15–16.
- Horizontal page padding 24px; spacing 8/12/16/24px.
- Card radius 12px, auth card 16px, button 14px, pill 27px.
- Icon: một hệ Lucide hoặc Material Symbols, không trộn.

## Yêu cầu UI
- Mobile-first, safe-area, điều hướng rõ ngữ cảnh Employer/Worker.
- Loading/empty/error/offline/permission-denied phải có state riêng, dù Worker Sketch không cung cấp frame cho các trạng thái đó.
- Màu vàng không là dấu hiệu ngữ nghĩa duy nhất; kèm label/icon.
- Không sử dụng font binary từ Sketch nếu không có quyền/license và không phát tán font.

Nguồn: `docs/06-ui/00-sketch-source.md`, `01-design-tokens.md`, `02-employer-screen-inventory.md`, `03-worker-screen-inventory.md`.
