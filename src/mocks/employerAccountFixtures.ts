import type { EmployerDemoProfile, EmployerNotification, EmployerSavedAddress } from '../types/employerAccount'
export const employerProfileFixture: EmployerDemoProfile = { displayName: 'Minh Anh', kind: 'individual', businessLabel: '' }
export const employerAddressFixtures: EmployerSavedAddress[] = [
  { id: 'JF-ADDR-001', label: 'Nhà', kind: 'home', area: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh' },
  { id: 'JF-ADDR-002', label: 'Cửa hàng demo', kind: 'store', area: 'Phường Đa Kao, Quận 1, TP. Hồ Chí Minh' },
]
export const employerDefaultAddressFixtureId = 'JF-ADDR-001'
export const employerNotificationFixtures: EmployerNotification[] = [
  { id: 'JF-NOTI-0105-ASSIGNED', type: 'assigned', title: 'Đã có Worker được ghép', detail: 'Yêu cầu JF-DEMO-0105 có hồ sơ Worker demo được liên kết.', requestId: 'JF-DEMO-0105', createdAt: '2026-10-10T12:10:00+07:00', read: false },
  { id: 'JF-NOTI-0105-UPCOMING', type: 'upcoming', title: 'Ca làm sắp đến', detail: 'Ca demo của yêu cầu JF-DEMO-0105 theo lịch đã lưu.', requestId: 'JF-DEMO-0105', createdAt: '2026-10-10T13:00:00+07:00', read: true },
  { id: 'JF-NOTI-0105-CHECKIN', type: 'checked_in', title: 'Worker đã check-in demo', detail: 'Trạng thái ca đến từ fixture, không xác minh vị trí.', requestId: 'JF-DEMO-0105', createdAt: '2026-10-10T14:02:00+07:00', read: true },
  { id: 'JF-NOTI-0105-EXTENSION', type: 'extension', title: 'Cập nhật đề nghị gia hạn', detail: 'Mở chi tiết để xem lịch sử gia hạn demo theo ca.', requestId: 'JF-DEMO-0105', createdAt: '2026-10-10T16:00:00+07:00', read: true },
  { id: 'JF-NOTI-0107-COMPLETION', type: 'completion', title: 'Yêu cầu cần xác nhận hoàn tất', detail: 'Mở tóm tắt ca demo để xem trạng thái.', requestId: 'JF-DEMO-0107', createdAt: '2026-10-10T18:05:00+07:00', read: false },
  { id: 'JF-NOTI-0108-REVIEW', type: 'review', title: 'Nhắc đánh giá dịch vụ', detail: 'Yêu cầu đã hoàn tất theo fixture demo.', requestId: 'JF-DEMO-0108', createdAt: '2026-10-10T18:30:00+07:00', read: true },
  { id: 'JF-NOTI-CASE-0107', type: 'case', title: 'Cập nhật hồ sơ hỗ trợ', detail: 'Case demo đang được xem xét.', requestId: 'JF-DEMO-0107', createdAt: '2026-10-10T18:20:00+07:00', read: true },
]
export const employerHelpArticles = [
  { id: 'create', title: 'Cách tạo yêu cầu', body: 'Chọn dịch vụ, nhập phạm vi, địa điểm và thời gian. Xem lại bản nháp trước khi tiếp tục. Bản demo không gửi yêu cầu thật.', destination: 'requestDraft' as const },
  { id: 'matching', title: 'Matching hoạt động thế nào?', body: 'Hệ thống backend quyết định Worker đủ điều kiện. Employer không chọn Worker từ danh sách ứng viên. Màn hình hiện tại chỉ minh họa fixture.', destination: 'history' as const },
  { id: 'contact', title: 'Liên hệ Worker đã được ghép', body: 'Nút liên hệ chỉ xuất hiện trong assignment demo phù hợp. Chat và gọi ở đây không kết nối người thật.', destination: 'history' as const },
  { id: 'extension', title: 'Yêu cầu thêm thời gian', body: 'Mở chi tiết yêu cầu đã ghép và chọn đề nghị gia hạn. Kết quả là fixture demo, không thay đổi lịch thật.', destination: 'history' as const },
  { id: 'completion', title: 'Xác nhận hoàn tất', body: 'Chỉ fixture đang chờ xác nhận mới cho phép ghi nhận quyết định cục bộ. Không phát sinh thanh toán.', destination: 'history' as const },
  { id: 'review', title: 'Gửi đánh giá', body: 'Sau khi đủ điều kiện, bạn có thể gửi một đánh giá demo gắn với request và assignment.', destination: 'employerReviews' as const },
  { id: 'incident', title: 'Báo cáo vấn đề', body: 'Báo cáo demo chỉ lưu trong phiên và không tải tệp thật hoặc mở ticket hỗ trợ.', destination: 'history' as const },
  { id: 'dispute', title: 'Theo dõi hồ sơ hỗ trợ', body: 'Trạng thái case chỉ là fixture hoặc dữ liệu local; không có phân xử hay cam kết hoàn tiền.', destination: 'employerCases' as const },
]
