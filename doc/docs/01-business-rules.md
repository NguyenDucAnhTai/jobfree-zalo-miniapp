# Business rules cho frontend mock

| Nhóm | Quy tắc sản phẩm | Hệ quả UI mock |
|---|---|---|
| Identity | Một identity có thể có profile Employer và Worker riêng; không tự merge qua phone/email | Role switch chỉ đổi context và dataset giả lập; auth/permission backend chưa có |
| Verification | Worker cần verification hợp lệ trước protected offer/shift; Employer cần verification trước publish/fund; tuổi tối thiểu 18 theo kết quả eKYC | Chỉ hiển thị locked/readiness demo; **không tạo luồng thu CCCD/selfie hoặc bypass** |
| Catalog | Chọn service template active; note không được mở rộng việc cấm | Chỉ mock catalog có version; validate input UI cơ bản |
| Pricing | Floor ≤ suggested ≤ ceiling; bước giá 5.000 VND tính từ floor | Mock preview; không tự khẳng định giá cuối hoặc thu tiền |
| Publish | Backend quyết định eligibility, funding mode, idempotency, 1 Worker/job trong MVP | Draft/quote/publish preview mô phỏng; không tạo giao dịch |
| Matching | Ranked waves; Worker đủ điều kiện đầu tiên accept hợp lệ thắng atomically; không phải Employer chọn applicant | Mock offer accepted/expired/superseded; không giả lập phân công thật |
| Shift | Assignment khác Shift; check-in cần server verification/geofence/liveness | Trạng thái UI demo, không gọi camera/GPS thật |
| Cancellation | Snapshot policy theo version; phí/cửa sổ do backend quyết định | Hiển thị ví dụ được dán nhãn, không tính phí production |
| Money | payOS/cọc, hoa hồng, settlement và ledger là server authoritative | Chỉ hiển thị số liệu giả, không thu tiền/rút tiền |
| Data | Không lưu raw CCCD, face/liveness, dữ liệu nhạy cảm trong app | Fixtures phải synthetic, không dùng thông tin người thật |

## Phân biệt baseline cũ và v2
`docs/02-workflows/job-lifecycle.md` và `shift-state-machine.md` được đánh dấu **SUPERSEDED**. Không triển khai Application → Employer chọn Worker, multi-slot hay wallet hold theo hai tài liệu cũ. Dùng `lifecycle-state-machine-v2-vi.md`, DEC-074, DEC-083, DEC-084, và business rules mới hơn.

Nguồn: `docs/01-domain/business-rules-vi.md`, `docs/02-workflows/lifecycle-state-machine-v2-vi.md`, `docs/04-api/employer-api-contracts-v1-vi.md`, `docs/04-api/worker-api-contracts-v1-vi.md`. Các nguồn vẫn có nhãn draft/unverified; không khẳng định API đã triển khai.
