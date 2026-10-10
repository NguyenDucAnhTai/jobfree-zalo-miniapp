import type { WorkerShiftStatus } from '../types/workerLifecycle'

export const workerShiftStatusLabels: Record<WorkerShiftStatus, string> = {
  scheduled: 'Sắp làm · demo',
  en_route: 'Đang di chuyển · demo',
  checked_in: 'Check-in demo',
  pending_confirmation: 'Chờ xác nhận',
  completed: 'Đã hoàn thành · demo',
  no_show: 'Không tham gia · demo fixture',
  incident_pending: 'Chờ xử lý sự cố · demo fixture',
  cancelled: 'Đã hủy · demo fixture',
}
