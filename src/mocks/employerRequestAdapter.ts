import { employerServices } from './fixtures'
import type { AsyncState, DemoQuotePreview, EmployerRequestDraft, EmployerWorkRequest, WorkRequestStatus, WorkRequestTimelineEvent } from '../types/domain'

const lifecycle: WorkRequestStatus[] = [
  'draft',
  'funding_pending',
  'funding_failed',
  'matching',
  'assigned',
  'replacement_matching',
  'awaiting_employer_decision',
  'completed',
  'cancelled',
]

const quoteRates: Record<string, number> = {
  moving: 80_000,
  cleaning: 60_000,
  delivery: 70_000,
  events: 75_000,
}

const syntheticWorker = {
  displayName: 'Người làm demo An N.',
  rating: '4.9',
  completedJobs: 28,
  status: 'active' as const,
  shiftSchedule: '10/10/2026 · 14:00–18:00',
}

function event(id: string, label: string, occurredAt: string, note: string, completed = true): WorkRequestTimelineEvent {
  return { id, label, occurredAt, note, completed }
}

function timelineFor(status: WorkRequestStatus): WorkRequestTimelineEvent[] {
  const base = [event('draft', 'Đã lưu bản nháp', '09/10/2026 · 09:10', 'Yêu cầu mẫu được lưu trong phiên demo.')]
  if (status === 'draft') return base
  if (status === 'cancelled') return [...base, event('cancelled', 'Đã hủy', '09/10/2026 · 09:18', 'Trạng thái huỷ được dựng sẵn để xem UI.')]

  const funded = [...base, event('funding', 'Đang chuẩn bị funding', '09/10/2026 · 09:12', 'Trạng thái mô phỏng; không có giao dịch.')]
  if (status === 'funding_pending') return [...funded, event('funding_pending', 'Funding đang chờ', '09/10/2026 · 09:13', 'Không gửi yêu cầu thanh toán.', false)]
  if (status === 'funding_failed') return [...funded, event('funding_failed', 'Funding thất bại', '09/10/2026 · 09:14', 'Lỗi mẫu, không đại diện kết quả cổng thanh toán.')]

  const matching = [...funded, event('matching', 'Đang tìm người phù hợp', '09/10/2026 · 09:20', 'Backend được mô phỏng; chưa ghép Worker thật.')]
  if (status === 'matching') return matching
  const assigned = [...matching, event('assigned', 'Đã có người làm demo', '09/10/2026 · 09:25', 'Assignment chỉ là dữ liệu fixture.')]
  if (status === 'assigned') return assigned
  if (status === 'replacement_matching') return [...assigned, event('replacement_matching', 'Đang tìm người thay thế', '10/10/2026 · 12:00', 'Worker cũ đã rời scenario; chưa có người thay thế.', false)]
  if (status === 'awaiting_employer_decision') return [...assigned, event('decision', 'Chờ người thuê xác nhận', '10/10/2026 · 18:00', 'Trạng thái giao diện mẫu.', false)]
  if (status === 'completed') return [...assigned, event('decision', 'Đã xác nhận hoàn tất', '10/10/2026 · 18:00', 'Fixture hoàn thành; không có quyết toán thật.')]
  return matching
}

function scenario(
  id: string,
  status: WorkRequestStatus,
  serviceId: string,
  serviceLabel: string,
  details: string,
  options: { assignment?: EmployerWorkRequest['assignment']; createdAt?: string; location?: string } = {},
): EmployerWorkRequest {
  return {
    id,
    status,
    serviceId,
    serviceLabel,
    details,
    location: options.location ?? 'Phường Bến Nghé, Quận 1 · địa điểm demo',
    schedule: '10/10/2026 · 14:00–18:00',
    durationHours: 4,
    referenceBudget: (quoteRates[serviceId] ?? 80_000) * 4,
    createdAt: options.createdAt ?? '09/10/2026 · 09:10',
    timeline: timelineFor(status),
    ...(options.assignment ? { assignment: options.assignment } : {}),
  }
}

export const employerRequestScenarios: EmployerWorkRequest[] = [
  scenario('JF-DEMO-0101', 'draft', 'moving', 'Bốc xếp', 'Hỗ trợ chuyển thùng hàng lên tầng hai.'),
  scenario('JF-DEMO-0102', 'funding_pending', 'cleaning', 'Dọn dẹp', 'Dọn khu vực văn phòng sau sự kiện.'),
  scenario('JF-DEMO-0103', 'funding_failed', 'delivery', 'Giao nhận', 'Giao bộ tài liệu mẫu trong khu vực.'),
  scenario('JF-DEMO-0104', 'matching', 'moving', 'Bốc xếp', 'Hỗ trợ sắp xếp hàng hóa tại cửa hàng.'),
  scenario('JF-DEMO-0105', 'assigned', 'events', 'Phụ sự kiện', 'Hỗ trợ chuẩn bị khu vực đón khách.', { assignment: syntheticWorker }),
  scenario('JF-DEMO-0106', 'replacement_matching', 'moving', 'Bốc xếp', 'Sắp xếp các thùng hàng theo khu vực.', {
    assignment: { ...syntheticWorker, status: 'replaced' },
    createdAt: '10/10/2026 · 11:30',
  }),
  scenario('JF-DEMO-0107', 'awaiting_employer_decision', 'cleaning', 'Dọn dẹp', 'Vệ sinh văn phòng sau ca làm.', { assignment: syntheticWorker }),
  scenario('JF-DEMO-0108', 'completed', 'events', 'Phụ sự kiện', 'Hỗ trợ sắp xếp bàn ghế cho buổi gặp mặt.', { assignment: syntheticWorker }),
  scenario('JF-DEMO-0109', 'cancelled', 'delivery', 'Giao nhận', 'Chuyển hồ sơ giữa hai địa điểm demo.'),
]

export const statusLabel: Record<WorkRequestStatus, string> = {
  draft: 'Bản nháp',
  funding_pending: 'Funding đang chờ',
  funding_failed: 'Funding thất bại',
  matching: 'Đang tìm người',
  assigned: 'Đã phân công (demo)',
  replacement_matching: 'Đang tìm người thay thế',
  awaiting_employer_decision: 'Chờ người thuê xác nhận',
  completed: 'Đã hoàn thành (demo)',
  cancelled: 'Đã hủy (demo)',
}

export function getEmployerRequestsMock(state: AsyncState = 'success') {
  if (state === 'success') return { state, data: employerRequestScenarios } as const
  if (state === 'empty') return { state, data: [] as EmployerWorkRequest[] } as const
  const message = state === 'offline' ? 'Danh sách demo đang ở trạng thái ngoại tuyến.' : 'Không thể tải danh sách demo lúc này.'
  return { state, data: null, message } as const
}

export function getDemoQuote(draft: EmployerRequestDraft): DemoQuotePreview {
  const [startHour, startMinute] = draft.startTime.split(':').map(Number)
  const [endHour, endMinute] = draft.endTime.split(':').map(Number)
  const durationHours = Math.max(0, (endHour * 60 + endMinute - startHour * 60 - startMinute) / 60)
  const unitRate = quoteRates[draft.serviceId] ?? 80_000
  return {
    unitRate,
    durationHours,
    referenceTotal: unitRate * durationHours,
    currency: 'VND',
    disclaimer: 'Báo giá tham khảo DEMO · không phải báo giá production, không thu tiền và không tạo funding.',
  }
}

export function createDraftRequest(draft: EmployerRequestDraft): EmployerWorkRequest {
  const service = employerServices.find((item) => item.id === draft.serviceId)
  const quote = getDemoQuote(draft)
  const [year = '2026', month = '10', day = '10'] = (draft.date || '2026-10-10').split('-')
  const scheduleDate = `${day}/${month}/${year}`
  return {
    id: 'JF-DEMO-DRAFT-LOCAL',
    serviceId: draft.serviceId,
    serviceLabel: service?.title ?? 'Chưa chọn dịch vụ',
    details: draft.details,
    location: `${draft.location} · địa điểm demo`,
    schedule: `${scheduleDate} · ${draft.startTime}–${draft.endTime}`,
    durationHours: quote.durationHours,
    referenceBudget: quote.referenceTotal,
    status: 'draft',
    createdAt: '09/10/2026 · 09:10',
    timeline: [event('draft', 'Đã lưu bản nháp', '09/10/2026 · 09:10', 'Bạn có thể chỉnh sửa nội dung demo.')],
  }
}

export function getEmployerRequestById(id: string, localDraft?: EmployerWorkRequest) {
  if (localDraft?.id === id) return localDraft
  return employerRequestScenarios.find((request) => request.id === id)
}

export function getNextDemoStatuses(status: WorkRequestStatus) {
  const index = lifecycle.indexOf(status)
  return lifecycle.slice(Math.max(0, index), Math.min(lifecycle.length, index + 3))
}
