# Screen / workflow inventory cho ZMP

## Employer (Sketch labels; không phải route API)
- E07 Trang chủ → E08 dịch vụ phổ biến → E09 công việc con.
- E10 tạo yêu cầu, E10A bốc vác, E11 mức ưu tiên, E12 set giá, E12A duyệt yêu cầu, E12B/C xác nhận/hoàn tất funding (demo-only).
- E13/A/B/C đang tìm người → E14 thông tin Worker ghép → E15 theo dõi → E16 chi tiết đang làm.
- E17 tin nhắn, E18 làm thêm giờ, E19 yêu cầu phát sinh, E20 checkout, E21 tóm tắt, E22 hoàn thành, E23 đánh giá.
- E24 danh sách yêu cầu → E25 hoàn thành / E26 hủy; E27 tin nhắn; E28/29 ưu đãi/voucher; E30 tài khoản; E31 hồ sơ; E32 địa chỉ; E33 thanh toán; E34 lịch sử; E35 Worker gần nhất.
- Employer còn có các biến thể loading/error/keyboard/pending/success; không gom biến thể thành một màn duy nhất khi tính coverage.

## Worker
- W01 trang chủ, W00 đăng nhập SĐT, W00A OTP, W01 hoàn thiện hồ sơ.
- W03–W05A đào tạo; W06/07 thiết lập nhận việc; W08 COD (policy uncertain).
- W09 check-in (demo-only); W10 tạm nghỉ; W11 việc đang làm.
- W12 việc mới → W13 chi tiết offer; W01A popup job.
- W14 thu nhập → W15 quản lý tiền → W16 rút / W17 nạp (UI-only).
- Worker source chỉ có 19 default, 1 success, 1 overlay; thiếu loading/error/empty/offline/permission states. Thiết kế thêm nhưng ghi approximation.

## Critical flow correction
Hotspot W13 → W11 của Sketch **không đủ để chứng minh** mọi offer tự động thành shift. Chính sách mới DEC-074 xác định backend chọn Worker accept hợp lệ đầu tiên và tạo Assignment + Shift nguyên tử. Frontend mock chỉ thể hiện kết quả mô phỏng, không tự ra quyết định.

## Traceability template
`screen_id | actor | user_action | mock_state | auth_gate | error/empty/loading | source_doc | test | implementation_status`.

Nguồn: `docs/06-ui/02-employer-screen-inventory.md`, `03-worker-screen-inventory.md`, `04-prototype-flows.md`, `05-screen-backend-map.md`.
