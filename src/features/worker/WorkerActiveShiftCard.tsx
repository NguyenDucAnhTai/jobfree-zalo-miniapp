import type { WorkerShift } from '../../types/workerLifecycle'
import { workerShiftStatusLabels } from '../../utils/workerShiftLabels'

export function WorkerActiveShiftCard({ shift, onOpen }: { shift?: WorkerShift; onOpen: (id: string) => void }) {
  const heading = !shift || shift.status === 'scheduled'
    ? 'Ca sắp tới'
    : shift.status === 'en_route' || shift.status === 'checked_in'
      ? 'Ca đang diễn ra'
      : 'Ca theo dõi'

  return (
    <section className="worker-home-shift-section" aria-labelledby="worker-home-shift-heading">
      <div className="worker-home-section-heading"><div><span className="worker-dashboard-eyebrow">LỊCH LÀM DEMO</span><h2 id="worker-home-shift-heading">{heading}</h2></div><span className="worker-dashboard-section-mark" aria-hidden="true">◷</span></div>
      {!shift ? (
        <div className="worker-home-shift-empty" role="status"><strong>Chưa có ca sắp tới</strong><p>Lịch ca được hiển thị từ fixture demo.</p></div>
      ) : (
        <article className="worker-active-shift-card">
          <div className="worker-active-shift-heading"><span className="worker-active-shift-icon" aria-hidden="true">✦</span><span className={`worker-job-status status-${shift.status}`}>{shift.status === 'scheduled' ? 'Sắp tới · demo' : workerShiftStatusLabels[shift.status]}</span></div>
          <h3>{shift.title}</h3>
          <p className="worker-active-shift-location"><span aria-hidden="true">⌖</span>{shift.location}</p>
          <div className="worker-active-shift-schedule"><span>{shift.dateKey.split('-').reverse().join('/')}</span><strong>{shift.schedule}</strong></div>
          <div className="worker-shift-time-indicator" aria-label={`Giờ bắt đầu theo lịch ${shift.scheduledStartAt.slice(11, 16)}`}><span>GIỜ BẮT ĐẦU</span><strong>{shift.scheduledStartAt.slice(11, 16)}</strong><small>Theo lịch demo</small></div>
          <button type="button" className="worker-active-shift-cta" onClick={() => onOpen(shift.id)}>Xem chi tiết ca <span aria-hidden="true">→</span></button>
          <p className="worker-active-shift-note">Giờ hiển thị cố định theo lịch, không có đếm ngược trực tiếp.</p>
        </article>
      )}
    </section>
  )
}
