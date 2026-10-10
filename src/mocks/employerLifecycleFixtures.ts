import type { EmployerAssignmentView, EmployerShiftTracking } from '../types/employerLifecycle'

/** Separate controlled E1 read models; never inferred from similarly named Worker records. */
export const employerAssignmentViews: EmployerAssignmentView[] = [
  {
    requestId: 'JF-DEMO-0105', assignmentId: 'JF-E1-ASSIGN-0105', shiftId: 'JF-E1-SHIFT-0105',
    status: 'active', displayName: 'Người làm demo An N.', initials: 'AN', rating: '4.9', completedJobs: 28,
    serviceLabel: 'Phụ sự kiện', shiftSchedule: '10/10/2026 · 14:00–18:00',
  },
  {
    requestId: 'JF-DEMO-0107', assignmentId: 'JF-E1-ASSIGN-0107', shiftId: 'JF-E1-SHIFT-0107',
    status: 'active', displayName: 'Minh T. · Worker demo', initials: 'MT', rating: '4.8', completedJobs: 16,
    serviceLabel: 'Dọn dẹp', shiftSchedule: '10/10/2026 · 14:00–18:00',
  },
  {
    requestId: 'JF-DEMO-0108', assignmentId: 'JF-E1-ASSIGN-0108', shiftId: 'JF-E1-SHIFT-0108',
    status: 'active', displayName: 'Linh P. · Worker demo', initials: 'LP', rating: '5.0', completedJobs: 12,
    serviceLabel: 'Phụ sự kiện', shiftSchedule: '10/10/2026 · 14:00–18:00',
  },
]

export const employerShiftTrackingFixtures: EmployerShiftTracking[] = [
  {
    requestId: 'JF-DEMO-0105', assignmentId: 'JF-E1-ASSIGN-0105', shiftId: 'JF-E1-SHIFT-0105',
    requestStatus: 'assigned', shiftStatus: 'checked_in', scheduledStartAt: '2026-10-10T14:00:00+07:00',
    scheduledEndAt: '2026-10-10T18:00:00+07:00', effectiveEndAt: '2026-10-10T18:00:00+07:00',
    events: [
      { id: 'e1-0105-scheduled', label: 'Ca đã lên lịch', occurredAt: '2026-10-09T09:25:00+07:00', note: 'Giờ ca theo lịch: 14:00–18:00.' },
      { id: 'e1-0105-en-route', label: 'Worker đang di chuyển', occurredAt: '2026-10-10T13:35:00+07:00', note: 'Trạng thái vị trí tổng quát trong fixture demo; không dùng GPS.' },
      { id: 'e1-0105-check-in', label: 'Đã check-in (demo)', occurredAt: '2026-10-10T14:02:00+07:00', note: 'Không xác minh camera, GPS hoặc danh tính.' },
      { id: 'e1-0105-working', label: 'Ca đang thực hiện', occurredAt: '2026-10-10T14:05:00+07:00', note: 'Trạng thái fixture chỉ để minh họa tiến trình.' },
    ],
  },
  {
    requestId: 'JF-DEMO-0107', assignmentId: 'JF-E1-ASSIGN-0107', shiftId: 'JF-E1-SHIFT-0107',
    requestStatus: 'awaiting_employer_decision', shiftStatus: 'pending_confirmation', scheduledStartAt: '2026-10-10T14:00:00+07:00',
    scheduledEndAt: '2026-10-10T18:00:00+07:00', effectiveEndAt: '2026-10-10T18:00:00+07:00',
    events: [
      { id: 'e1-0107-scheduled', label: 'Ca đã lên lịch', occurredAt: '2026-10-09T09:25:00+07:00', note: 'Giờ ca theo lịch: 14:00–18:00.' },
      { id: 'e1-0107-en-route', label: 'Worker bắt đầu di chuyển', occurredAt: '2026-10-10T13:35:00+07:00', note: 'Sự kiện demo tổng quát.' },
      { id: 'e1-0107-check-in', label: 'Đã check-in (demo)', occurredAt: '2026-10-10T13:55:00+07:00', note: 'Không xác minh camera, GPS hoặc danh tính.' },
      { id: 'e1-0107-pending', label: 'Chờ xác nhận hoàn tất', occurredAt: '2026-10-10T18:05:00+07:00', note: 'Trạng thái chỉ đọc do fixture cung cấp.' },
    ],
  },
  {
    requestId: 'JF-DEMO-0108', assignmentId: 'JF-E1-ASSIGN-0108', shiftId: 'JF-E1-SHIFT-0108',
    requestStatus: 'completed', shiftStatus: 'completed', scheduledStartAt: '2026-10-10T14:00:00+07:00',
    scheduledEndAt: '2026-10-10T18:00:00+07:00', effectiveEndAt: '2026-10-10T18:00:00+07:00',
    events: [
      { id: 'e1-0108-scheduled', label: 'Ca đã lên lịch', occurredAt: '2026-10-09T09:25:00+07:00', note: 'Giờ ca theo lịch: 14:00–18:00.' },
      { id: 'e1-0108-completed', label: 'Ca hoàn tất (demo)', occurredAt: '2026-10-10T18:05:00+07:00', note: 'Fixture hoàn thành, không có thanh toán hoặc quyết toán.' },
    ],
  },
]

export function getEmployerAssignmentView(requestId: string) {
  return employerAssignmentViews.find((item) => item.requestId === requestId)
}

export function getEmployerShiftTracking(requestId: string) {
  return employerShiftTrackingFixtures.find((item) => item.requestId === requestId)
}
