# Product context — JobFree ZMP

## Bản chất sản phẩm
JobFree là nền tảng điều phối **dịch vụ/công việc theo yêu cầu** tại Việt Nam, không phải sàn tuyển CV dài hạn. Employer đặt nhu cầu dịch vụ theo phạm vi, lịch và địa điểm; Worker đủ điều kiện nhận offer, thực hiện shift, hoàn thành và được quyết toán. Luồng khái quát: tạo nhu cầu → cấp tiền → matching → assignment → di chuyển → check-in → thực hiện → xác nhận → settlement.

## Phạm vi Zalo Mini App
- Zalo Mini App ID: `1683470079423719853`.
- Một app với **hai ngữ cảnh UI** Employer / Worker; switcher phải tường minh.
- Hai app Android Kotlin Employer/Worker của baseline vẫn riêng, không sửa.
- R1–R5 đạt mục tiêu **70% weighted workflow coverage** (không có nghĩa 70% backend hay 70% pixel-perfect screens).
- Frontend dùng deterministic synthetic fixtures, trạng thái `DEMO / NON-PRODUCTION` hiển thị rõ.
- Không có backend production, Supabase auth/session bridge, eKYC, payment, OA, dispatch, location tracking hay real chat.
- Worker UI là `DESIGN_APPROXIMATION` khi không có Sketch render gốc.

## Nguyên tắc kiến trúc
- Role UI ≠ quyền truy cập. Không trộn cache Employer/Worker, không tự gộp identity theo số điện thoại/email.
- Server sẽ là authority cho eligibility, trạng thái, tiền, assignment, verification; mock chỉ mô phỏng.
- Dữ liệu định danh nhạy cảm và tài chính thực không được đưa vào fixtures hoặc browser storage.

Nguồn: `docs/JOBFREE-PRD-CHI-TIET-VI.md`, `docs/01-domain/business-rules-vi.md`, `docs/02-workflows/lifecycle-state-machine-v2-vi.md`, DEC-012/013/014/074/083/084/088/113. ZMP-specific role switcher là chỉ đạo PO mới, không phải hành vi được chứng minh trong baseline Android.
