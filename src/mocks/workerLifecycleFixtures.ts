import { workerOpportunities } from './fixtures'
import type { WorkerAssignment, WorkerDecisionScenario, WorkerOffer, WorkerShift, WorkerTransaction } from '../types/workerLifecycle'

export const workerOffers: WorkerOffer[] = workerOpportunities.map((job, index) => ({
  id: `demo-offer-${String(index + 1).padStart(3, '0')}`,
  opportunityId: job.id,
  title: job.title,
  description: [
    'Hỗ trợ chuyển thùng hàng và sắp xếp đồ tại điểm nhận.',
    'Đóng gói đơn hàng theo danh sách có sẵn, giữ khu vực làm việc gọn gàng.',
    'Phân loại kiện hàng theo khu vực và hỗ trợ kiểm đếm cuối ca.',
  ][index] ?? 'Công việc hỗ trợ theo mô tả demo.',
  category: job.category,
  schedule: job.schedule,
  dateKey: ['2026-10-10', '2026-10-11', '2026-10-12'][index] ?? '2026-10-12',
  startTime: job.schedule.split(' · ')[1]?.split('–')[0] ?? '08:00',
  endTime: job.schedule.split(' · ')[1]?.split('–')[1] ?? '12:00',
  durationHours: job.durationHours,
  location: job.location,
  referencePay: Math.round(Number(job.pay.replace(/\D/g, '')) * 0.9),
  totalPay: Number(job.pay.replace(/\D/g, '')),
  employerName: ['Hộ kinh doanh Linh Trung', 'Shop Thời Trang Mia', 'Kho vận Express Quận 7'][index] ?? 'Đối tác demo',
  employerRating: ['4.9', '4.8', '4.7'][index] ?? '4.8',
  conditions: ['Có mặt đúng giờ theo lịch demo', 'Mang giày kín mũi và trang phục gọn gàng', 'Đây là thông tin minh họa, không phải điều khoản hợp đồng'],
  status: 'offered',
}))

export const offerDecisionScenarios: { value: WorkerDecisionScenario; label: string }[] = [
  { value: 'success', label: 'Chấp nhận demo thành công' },
  { value: 'expired', label: 'Offer đã hết hạn' },
  { value: 'taken', label: 'Worker khác đã nhận' },
  { value: 'withdrawn', label: 'Offer đã bị thu hồi' },
  { value: 'superseded', label: 'Offer không còn hiệu lực' },
  { value: 'invalid', label: 'Không đủ điều kiện demo' },
]

export const initialWorkerAssignments: WorkerAssignment[] = [
  { id: 'demo-assignment-existing-001', offerId: 'demo-offer-existing-001', jobId: 'demo-worker-job-001', shiftId: 'demo-shift-001', status: 'active' },
  { id: 'demo-assignment-existing-003', offerId: 'demo-offer-existing-003', jobId: 'demo-worker-job-003', shiftId: 'demo-shift-003', status: 'completed' },
  { id: 'demo-assignment-existing-002', offerId: 'demo-offer-existing-002', jobId: 'demo-worker-job-002', shiftId: 'demo-shift-002', status: 'active' },
]

export const initialWorkerShifts: WorkerShift[] = [
  { id: 'demo-shift-001', jobId: 'demo-worker-job-001', title: 'Phụ chuyển vật dụng', description: 'Hỗ trợ bốc xếp và sắp xếp vật dụng theo mô tả minh họa.', dateKey: '2026-10-10', schedule: '18:00 – 22:00', location: '12 Nguyễn Văn Linh, Quận 1, TP. HCM', pay: 280000, status: 'scheduled', timeline: [{ status: 'scheduled', label: 'Ca đã lên lịch', time: '18:00' }] },
  { id: 'demo-shift-002', jobId: 'demo-worker-job-002', title: 'Đóng gói đơn livestream', description: 'Đóng gói theo danh sách đơn hàng demo.', dateKey: '2026-10-11', schedule: '08:00 – 12:00', location: 'Shop Thời Trang Mia, Quận 3, TP. HCM', pay: 240000, status: 'pending_confirmation', timeline: [{ status: 'scheduled', label: 'Ca đã lên lịch', time: '08:00' }, { status: 'pending_confirmation', label: 'Chờ xác nhận', time: '12:00' }] },
  { id: 'demo-shift-003', jobId: 'demo-worker-job-003', title: 'Đóng gói đơn', description: 'Đóng gói đơn hàng trong ca demo đã hoàn tất.', dateKey: '2026-10-08', schedule: '08:00 – 12:00', location: 'Shop Thời Trang Mia, Quận 3, TP. HCM', pay: 220000, status: 'completed', timeline: [{ status: 'scheduled', label: 'Ca đã lên lịch', time: '08:00' }, { status: 'completed', label: 'Hoàn tất demo', time: '12:00' }] },
]

export const workerWalletTransactions: WorkerTransaction[] = [
  { id: 'demo-transaction-003', title: 'Rút tiền minh họa', dateLabel: '07/10/2026', dateKey: '2026-10-07', amount: -300000, status: 'completed', kind: 'withdrawal' },
  { id: 'demo-transaction-004', title: 'Hỗ trợ sự kiện', dateLabel: '05/10/2026', dateKey: '2026-10-05', amount: 600000, status: 'completed', kind: 'earning' },
  { id: 'demo-transaction-pending-001', title: 'Phụ kho quận 7', dateLabel: '10/10/2026', dateKey: '2026-10-10', amount: 270000, status: 'pending', kind: 'earning' },
]

export const offerOutcomeMessages: Record<WorkerDecisionScenario, string> = {
  success: 'Kịch bản demo ghi nhận offer đã được chấp nhận. Assignment và ca làm minh họa đã được tạo từ fixture.',
  expired: 'Offer demo đã hết hạn nên không thể chấp nhận.',
  taken: 'Kịch bản demo cho biết offer đã được người làm khác nhận. Không tạo assignment cho tài khoản này.',
  withdrawn: 'Offer demo đã bị thu hồi và không thể chấp nhận.',
  superseded: 'Offer demo không còn hiệu lực. Hãy xem trạng thái mới nhất trong danh sách demo.',
  invalid: 'Kịch bản demo đánh dấu offer không đủ điều kiện; không tạo assignment hoặc ca làm.',
}
