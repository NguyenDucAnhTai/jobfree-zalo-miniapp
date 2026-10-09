import type { EmployerProfileItem, EmployerRequestDraft, JobPreview, ServiceSummary, ShiftPreview, WorkerHomeJob, WorkerOpportunity, WorkerProfileDemo, WorkerSkillDemo } from '../types/domain'

export const employerServices: ServiceSummary[] = [
  { id: 'moving', category: 'Kho vận & Logistics', title: 'Bốc xếp', description: 'Hỗ trợ chuyển đồ, hàng hóa', icon: '↗', countLabel: 'Từ 80.000đ/giờ' },
  { id: 'cleaning', category: 'Nhà cửa & văn phòng', title: 'Dọn dẹp', description: 'Nhà cửa, văn phòng', icon: '✦', countLabel: 'Từ 60.000đ/giờ' },
  { id: 'delivery', category: 'Giao nhận', title: 'Giao nhận', description: 'Giao hàng trong khu vực', icon: '⌁', countLabel: 'Việc linh hoạt' },
  { id: 'events', category: 'Sự kiện', title: 'Phụ sự kiện', description: 'Hỗ trợ setup, phục vụ', icon: '◇', countLabel: 'Nhận việc theo ca' },
]

export const employerProfileItems: EmployerProfileItem[] = [
  { id: 'requests', label: 'Yêu cầu công việc', description: 'Theo dõi các yêu cầu đã tạo' },
  { id: 'addresses', label: 'Địa điểm của tôi', description: 'Quản lý địa điểm demo' },
  { id: 'payments', label: 'Phương thức thanh toán', description: 'Chưa kết nối thanh toán thật' },
  { id: 'support', label: 'Trợ giúp & hỗ trợ', description: 'Thông tin hỗ trợ demo' },
]

export const emptyEmployerRequestDraft: EmployerRequestDraft = {
  serviceId: '',
  details: '',
  location: '',
  date: '2026-10-10',
  startTime: '08:00',
  endTime: '12:00',
}

export const employerJobs: JobPreview[] = [
  { id: 'demo-employer-job-01', title: 'Hỗ trợ chuyển đồ', location: 'Phường Bến Nghé · 2,4 km', schedule: '10/10/2026 · 14:00', pay: '320.000đ', tag: 'Đang tìm người · DEMO' },
]

export const workerOffers: JobPreview[] = [
  { id: 'demo-worker-offer-01', title: 'Phụ sắp xếp cửa hàng', location: 'Phường Tân Định · 1,8 km', schedule: '11/10/2026 · 08:00–12:00', pay: '280.000đ', tag: 'Việc mới' },
  { id: 'demo-worker-offer-02', title: 'Hỗ trợ chuyển văn phòng', location: 'Phường Đa Kao · 3,1 km', schedule: '12/10/2026 · 09:00–13:00', pay: '360.000đ', tag: 'Việc mới' },
]

export const workerShift: ShiftPreview = {
  id: 'demo-worker-shift-01',
  title: 'Đóng gói hàng hóa',
  location: 'Phường Nguyễn Thái Bình',
  schedule: '10/10/2026 · 13:30–17:30',
  status: 'Ca làm sắp bắt đầu',
}

export const workerHomeJobs: WorkerHomeJob[] = [
  {
    id: 'demo-worker-home-job-01',
    title: 'Phụ chuyển tối nay',
    location: 'Quận 1, TP. HCM',
    schedule: '10/10/2026 · 18:00–22:00',
    pay: '280.000đ',
    tag: 'NHẬN NGAY',
    rating: '4.9',
    distanceLabel: 'Gần bạn',
    category: 'moving',
  },
  {
    id: 'demo-worker-home-job-02',
    title: 'Đóng gói đơn livestream',
    location: 'Quận 3, TP. HCM',
    schedule: '11/10/2026 · 08:00–12:00',
    pay: '240.000đ',
    tag: 'GẦN BẠN',
    rating: '4.7',
    distanceLabel: 'Gần bạn',
    category: 'packing',
  },
  {
    id: 'demo-worker-home-job-03',
    title: 'Phụ kho phân loại hàng',
    location: 'Bình Thạnh, TP. HCM',
    schedule: '12/10/2026 · 08:00–12:00',
    pay: '200.000đ',
    tag: '',
    rating: '4.5',
    distanceLabel: '3,2 km',
    category: 'warehouse',
  },
]

export const workerProfileDemo: WorkerProfileDemo = {
  displayName: 'Nguyễn Minh Nam', initials: 'N', rating: '4.8', completedJobs: 12,
  reliability: 92, serviceArea: 'Quận 1, TP. HCM', phoneLabel: 'Số điện thoại demo',
}

export const workerSkillOptions: WorkerSkillDemo[] = [
  { id: 'moving', label: 'Bốc xếp, chuyển đồ', group: 'Kho vận & Logistics' },
  { id: 'packing', label: 'Đóng gói hàng hóa', group: 'Kho vận & Logistics' },
  { id: 'warehouse', label: 'Phân loại hàng', group: 'Kho vận & Logistics' },
  { id: 'cleaning', label: 'Dọn dẹp nhà cửa', group: 'Nhà cửa & văn phòng' },
  { id: 'event', label: 'Hỗ trợ sự kiện', group: 'Sự kiện' },
  { id: 'delivery', label: 'Giao nhận', group: 'Giao nhận' },
]

export const workerSavedSkillIds = ['moving', 'packing']

export const workerOpportunities: WorkerOpportunity[] = workerHomeJobs.map((job, index) => ({
  ...job,
  durationHours: 4,
  distanceLabel: ['Gần bạn', '1,8 km', '3,2 km'][index] ?? job.distanceLabel,
}))
