import type { WorkerShift, WorkerShiftStatus } from '../../types/workerLifecycle'

const labels: Record<WorkerShiftStatus, string> = { scheduled: 'Đã lên lịch', en_route: 'Đang di chuyển', checked_in: 'Đã check-in demo', pending_confirmation: 'Chờ xác nhận', completed: 'Hoàn tất demo', no_show: 'Không tham gia', incident_pending: 'Chờ xử lý sự cố', cancelled: 'Đã hủy' }
const next: Partial<Record<WorkerShiftStatus, WorkerShiftStatus>> = { scheduled: 'en_route', en_route: 'checked_in', checked_in: 'pending_confirmation', pending_confirmation: 'completed' }
const actionLabels: Partial<Record<WorkerShiftStatus, string>> = { en_route: 'Mô phỏng bắt đầu di chuyển', checked_in: 'Mô phỏng check-in', pending_confirmation: 'Chuyển sang chờ xác nhận demo', completed: 'Hoàn tất ca demo' }

export function WorkerShiftDetail({ shift, onBack, onTransition }: { shift: WorkerShift; onBack: () => void; onTransition: (nextStatus: WorkerShiftStatus) => void }) {
  const nextStatus = next[shift.status]
  const finalState = ['completed', 'no_show', 'incident_pending', 'cancelled'].includes(shift.status)
  return <main className="worker-core-page worker-shift-page">
    <button className="worker-back-button" type="button" onClick={onBack}>‹ Việc của tôi</button>
    <p className="worker-core-kicker">SHIFT {shift.id} · DEMO</p><h1>Chi tiết ca làm</h1>
    <section className="worker-shift-summary"><span className={`worker-job-status status-${shift.status}`}>{labels[shift.status]}</span><h2>{shift.title}</h2><p>{shift.description}</p><strong>{formatMoney(shift.pay)}</strong><small>Thù lao tham khảo · hiển thị từ fixture</small></section>
    <section className="worker-core-card worker-shift-info"><h2>Thông tin ca</h2><dl><div><dt>Ngày</dt><dd>{shift.dateKey.split('-').reverse().join('/')}</dd></div><div><dt>Giờ</dt><dd>{shift.schedule}</dd></div><div><dt>Địa điểm</dt><dd>{shift.location}</dd></div><div><dt>Trạng thái</dt><dd>{labels[shift.status]}</dd></div></dl></section>
    <section className="worker-core-card worker-shift-timeline"><h2>Tiến trình demo</h2><ol>{shift.timeline.map((event, index) => <li key={`${event.status}-${index}`}><span aria-hidden="true">{index + 1}</span><div><strong>{event.label}</strong><time>{event.time}</time></div></li>)}</ol></section>
    {nextStatus && <button className="worker-core-primary" type="button" onClick={() => onTransition(nextStatus)}>{actionLabels[nextStatus]}</button>}
    {finalState && <p className="worker-core-state" role="status">Ca đang ở trạng thái kết thúc hoặc cần xử lý riêng: {labels[shift.status]}.</p>}
    <p className="worker-core-disclaimer">Các bước là mô phỏng UI từ fixture. Check-in không dùng GPS/camera và không xác nhận sự hiện diện thật.</p>
  </main>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
