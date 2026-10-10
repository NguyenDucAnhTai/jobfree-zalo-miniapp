import type { WorkerShift, WorkerShiftStatus } from '../../types/workerLifecycle'
import { formatShiftEventTime } from '../../utils/workerShiftTimeline'
import { workerShiftStatusLabels } from '../../utils/workerShiftLabels'
import type { DemoConversationLink } from '../../types/jobfreeCommunications'
import { ContactActions } from '../shared/ConversationScreen'

const next: Partial<Record<WorkerShiftStatus, WorkerShiftStatus>> = { scheduled: 'en_route', en_route: 'checked_in', checked_in: 'pending_confirmation', pending_confirmation: 'completed' }
const actionLabels: Partial<Record<WorkerShiftStatus, string>> = { en_route: 'Mô phỏng bắt đầu di chuyển', checked_in: 'Mô phỏng check-in', pending_confirmation: 'Chuyển sang chờ xác nhận demo', completed: 'Hoàn tất ca demo' }

export function WorkerShiftDetail({ shift, onBack, onTransition, contactLink, onOpenChat, onOpenCall }: { shift: WorkerShift; onBack: () => void; onTransition: (nextStatus: WorkerShiftStatus) => void; contactLink?: DemoConversationLink; onOpenChat?: (link: DemoConversationLink) => void; onOpenCall?: (link: DemoConversationLink) => void }) {
  const nextStatus = next[shift.status]
  const finalState = ['completed', 'no_show', 'incident_pending', 'cancelled'].includes(shift.status)
  const timeline = [...shift.timeline].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
  return <main className="worker-core-page worker-shift-page">
    <button className="worker-back-button" type="button" onClick={onBack}>‹ Việc của tôi</button>
    <p className="worker-core-kicker">SHIFT {shift.id} · DEMO</p><h1>Chi tiết ca làm</h1>
    <section className="worker-shift-summary"><span className={`worker-job-status status-${shift.status}`}>{workerShiftStatusLabels[shift.status]}</span><h2>{shift.title}</h2><p>{shift.description}</p><strong>{formatMoney(shift.pay)}</strong><small>Thù lao tham khảo · hiển thị từ fixture</small></section>
    <section className="worker-core-card worker-shift-info"><h2>Thông tin ca</h2><dl><div><dt>Ngày</dt><dd>{shift.dateKey.split('-').reverse().join('/')}</dd></div><div><dt>Giờ theo lịch</dt><dd>{shift.schedule}</dd></div><div><dt>Địa điểm</dt><dd>{shift.location}</dd></div><div><dt>Trạng thái</dt><dd>{workerShiftStatusLabels[shift.status]}</dd></div></dl></section>
    {contactLink && onOpenChat && onOpenCall && <ContactActions onChat={() => onOpenChat(contactLink)} onCall={() => onOpenCall(contactLink)} />}
    <section className="worker-core-card worker-shift-timeline"><h2>Tiến trình demo</h2>{timeline.length ? <ol>{timeline.map((event, index) => <li key={`${event.status}-${index}`}><span aria-hidden="true">{index + 1}</span><div><strong>{event.label}</strong><time dateTime={event.occurredAt}>{formatShiftEventTime(event.occurredAt)}</time></div></li>)}</ol> : <p role="status">Chưa có sự kiện vòng đời. Giờ ca phía trên là giờ theo lịch.</p>}</section>
    {shift.displayOnly && <p className="worker-core-state" role="note">Kết quả fixture được cung cấp sẵn cho demo · chỉ đọc.</p>}
    {nextStatus && <button className="worker-core-primary" type="button" onClick={() => onTransition(nextStatus)}>{actionLabels[nextStatus]}</button>}
    {finalState && <p className="worker-core-state" role="status">Ca đang ở trạng thái kết thúc hoặc cần xử lý riêng: {workerShiftStatusLabels[shift.status]}.</p>}
    <p className="worker-core-disclaimer">Các bước là mô phỏng UI từ fixture. Check-in không dùng GPS/camera và không xác nhận sự hiện diện thật.</p>
  </main>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
