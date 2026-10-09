import type { JobPreview, ServiceSummary, ShiftPreview } from '../types/domain'

export const employerServices: ServiceSummary[] = [
  { id: 'moving', title: 'Bốc xếp', description: 'Hỗ trợ chuyển đồ, hàng hóa', icon: '↗', countLabel: 'Từ 80.000đ/giờ' },
  { id: 'cleaning', title: 'Dọn dẹp', description: 'Nhà cửa, văn phòng', icon: '✦', countLabel: 'Từ 60.000đ/giờ' },
  { id: 'delivery', title: 'Giao nhận', description: 'Giao hàng trong khu vực', icon: '⌁', countLabel: 'Việc linh hoạt' },
  { id: 'events', title: 'Phụ sự kiện', description: 'Hỗ trợ setup, phục vụ', icon: '◇', countLabel: 'Nhận việc theo ca' },
]

export const employerJobs: JobPreview[] = [
  { id: 'demo-employer-job-01', title: 'Hỗ trợ chuyển đồ', location: 'Phường Bến Nghé · 2,4 km', schedule: 'Hôm nay, 14:00', pay: '320.000đ', tag: 'Đang tìm người' },
]

export const workerOffers: JobPreview[] = [
  { id: 'demo-worker-offer-01', title: 'Phụ sắp xếp cửa hàng', location: 'Phường Tân Định · 1,8 km', schedule: 'Ngày mai, 08:00–12:00', pay: '280.000đ', tag: 'Việc mới' },
  { id: 'demo-worker-offer-02', title: 'Hỗ trợ chuyển văn phòng', location: 'Phường Đa Kao · 3,1 km', schedule: 'Thứ bảy, 09:00–13:00', pay: '360.000đ', tag: 'Việc mới' },
]

export const workerShift: ShiftPreview = {
  id: 'demo-worker-shift-01',
  title: 'Đóng gói hàng hóa',
  location: 'Phường Nguyễn Thái Bình',
  schedule: 'Hôm nay, 13:30–17:30',
  status: 'Ca làm sắp bắt đầu',
}
