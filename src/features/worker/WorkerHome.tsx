import { useMemo, useState } from 'react'
import { workerHomeJobs } from '../../mocks/fixtures'
import type { Destination, WorkerHomeJob } from '../../types/domain'
import type { WorkerShift } from '../../types/workerLifecycle'
import { workerScheduleKey } from '../../utils/workerDate'
import { WorkerActiveShiftCard } from './WorkerActiveShiftCard'
import { WorkerDashboardOverview } from './WorkerDashboardOverview'
import { WorkerShiftControls } from './WorkerShiftControls'

type JobFilter = 'Gần tôi' | 'Nhận ngay' | 'Lương cao' | 'Bắt đầu sớm'

export function WorkerHome({ onNavigate, onSelectOpportunity, onOpenNewOffer, onOpenShift, jobs = workerHomeJobs, shift }: {
  onNavigate: (destination: Destination) => void
  onSelectOpportunity: (id: string) => void
  onOpenNewOffer?: () => void
  onOpenShift?: (id: string) => void
  jobs?: WorkerHomeJob[]
  shift?: WorkerShift
}) {
  const [filter, setFilter] = useState<JobFilter>('Gần tôi')
  const visibleJobs = useMemo(() => {
    if (filter === 'Nhận ngay') return jobs.filter((job) => job.tag === 'NHẬN NGAY')
    if (filter === 'Lương cao') return [...jobs].sort((a, b) => amountFromPay(b.pay) - amountFromPay(a.pay))
    if (filter === 'Bắt đầu sớm') return [...jobs].sort((a, b) => workerScheduleKey(a.schedule).localeCompare(workerScheduleKey(b.schedule)))
    return jobs.filter((job) => job.distanceLabel.includes('Gần') || job.distanceLabel.includes('km'))
  }, [filter, jobs])

  return (
    <main className="worker-home worker-dashboard-home">
      <p className="worker-demo-pill"><span aria-hidden="true">●</span> DEMO · NON-PRODUCTION</p>
      <WorkerDashboardOverview />
      <WorkerActiveShiftCard shift={shift} onOpen={(id) => onOpenShift?.(id)} />
      <WorkerShiftControls />

      <section className="worker-job-section" aria-labelledby="worker-job-heading">
        <div className="worker-discovery-callout"><div><span className="worker-dashboard-eyebrow">CƠ HỘI DÀNH CHO BẠN</span><h2>Khám phá việc mới</h2><p>{jobs.length ? `${jobs.length} công việc trong dữ liệu demo` : 'Chưa có công việc mới trong dữ liệu demo'}</p></div><button type="button" onClick={() => onNavigate('opportunities')}>Xem việc mới <span aria-hidden="true">→</span></button></div>
        <div className="worker-filter-row" role="group" aria-label="Lọc việc demo">
          {(['Gần tôi', 'Nhận ngay', 'Lương cao', 'Bắt đầu sớm'] as const).map((option) => (
            <button key={option} type="button" className={`worker-filter${filter === option ? ' is-selected' : ''}`} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>
          ))}
        </div>
        <div className="worker-section-heading">
          <h2 id="worker-job-heading">Job phù hợp với bạn</h2>
          <div className="worker-home-actions"><button className="worker-link-button" type="button" onClick={() => onNavigate('opportunities')}>Xem tất cả</button>{onOpenNewOffer && <button className="worker-link-button" type="button" onClick={onOpenNewOffer}>Việc mới</button>}</div>
        </div>
        <div className="worker-job-list" aria-live="polite">
          {visibleJobs.length ? visibleJobs.map((job) => (
            <article className="worker-job-card" key={job.id}>
              <div className="worker-job-heading">
                <div className="worker-job-title-wrap">
                  {job.tag && <span className={`worker-job-tag${job.tag === 'NHẬN NGAY' ? ' is-urgent' : ''}`}>{job.tag}</span>}
                  <span className="worker-job-rating"><span aria-hidden="true">★</span> {job.rating}</span>
                  <h3>{job.title}</h3>
                </div>
                <div className="worker-job-pay"><strong>{job.pay}</strong><small>4 giờ làm việc</small></div>
              </div>
              <div className="worker-job-meta"><span aria-hidden="true">◷</span>{job.schedule}</div>
              <div className="worker-job-meta"><span aria-hidden="true">⌖</span>{job.location}</div>
              <button className="worker-detail-button" type="button" onClick={() => { onSelectOpportunity(job.id); onNavigate('opportunityDetail') }}>Xem chi tiết</button>
            </article>
          )) : (
            <div className="worker-empty-state" role="status" aria-label="Không có việc theo bộ lọc"><span aria-hidden="true">⌕</span><strong>Chưa có job theo bộ lọc này</strong><p>Thử chọn bộ lọc khác nhé. Đây là dữ liệu demo.</p></div>
          )}
        </div>
      </section>
      <p className="worker-demo-note">Cơ hội và lịch ca dùng dữ liệu mô phỏng cố định, không có điều phối thật.</p>
    </main>
  )
}

function amountFromPay(pay: string) {
  return Number(pay.replace(/\D/g, ''))
}
