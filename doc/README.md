# JobFree Zalo Mini App — Project Handoff

Bộ tài liệu **tóm lược có truy vết** để copy vào repo `NguyenDucAnhTai/jobfree-zalo-miniapp` sau khi khởi tạo bằng template ZMP React + TypeScript. Đây **không phải** bản sao nguyên văn toàn bộ PRD/Sketch. `TriTin3011/harness-jobfree` chỉ là nguồn **read-only**.

## Cách dùng
1. Copy thư mục `docs/` và `src/theme/jobfree-tokens.css` vào project Vite/ZMP; **không** thay thế `package.json` hoặc cấu hình ZMP do template tạo.
2. Đọc `docs/00-product-context.md`, `01-business-rules.md`, `02-ui-design.md`, `03-screen-flows.md`, `04-mock-contract.md`, `05-implementation-plan.md`, `06-source-traceability.md`.
3. Tạo mock adapter và R1 shell trước; mọi hành vi có tiền/eKYC/định danh phải chỉ là UI demo không thu thập dữ liệu thật.
4. Tài liệu nguồn có các phần `DRAFT`, `PROPOSED`, `SUPERSEDED`; khi mâu thuẫn ưu tiên quyết định PO/DEC mới nhất, không xem UI prototype là API production.

**Chú ý khác biệt sản phẩm:** baseline harness nói hai app Android riêng và không có role switcher. Role switcher ở **Zalo Mini App mới** là quyết định phạm vi của PO trong cuộc trò chuyện, chỉ là chuyển ngữ cảnh giao diện, không thay đổi quy tắc quyền backend.

**Nguồn:** https://github.com/TriTin3011/harness-jobfree/tree/main/docs
