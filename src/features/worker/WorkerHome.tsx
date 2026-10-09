import { useMemo, useState } from 'react'
import { workerHomeJobs } from '../../mocks/fixtures'
import type { Destination } from '../../types/domain'

type JobFilter = 'Gần tôi' | 'Nhận ngay' | 'Lương cao' | 'Bắt đầu sớm'

export function WorkerHome({ onNavigate, jobs = workerHomeJobs }: { onNavigate: (destination: Destination) => void; jobs?: typeof workerHomeJobs }) {
  const [filter, setFilter] = useState<JobFilter>('Gần tôi')
  const visibleJobs = useMemo(() => {
    if (filter === 'Nhận ngay') return jobs.filter((job) => job.tag === 'NHẬN NGAY')
    if (filter === 'Lương cao') return [...jobs].sort((a, b) => amountFromPay(b.pay) - amountFromPay(a.pay))
    if (filter === 'Bắt đầu sớm') return [...jobs].sort((a, b) => dateKey(a.schedule).localeCompare(dateKey(b.schedule)))
    return jobs.filter((job) => job.distanceLabel.includes('Gần') || job.distanceLabel.includes('km'))
  }, [filter, jobs])

  return (
    <main className="worker-home">
      <section className="worker-hero-card">
        <div className="worker-hero-copy">
          <h1 aria-label="Sẵn sàng nhận việc hôm nay">Sẵn sàng nhận việc<br aria-hidden="true" />hôm nay?</h1>
          <p>Có 8 job phù hợp gần bạn</p>
          <button className="worker-hero-button" type="button" onClick={() => onNavigate('jobs')}>
            Xem job gần tôi <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="worker-hero-art" aria-hidden="true"><span /><i /></div>
      </section>

      <section className="worker-stats" aria-label="Thông tin hồ sơ demo">
        <div className="worker-stat"><span className="stat-symbol verified-symbol" aria-hidden="true">✦</span><strong>Đã xác thực</strong></div>
        <div className="worker-stat"><span className="stat-rating"><span aria-hidden="true">★</span> 4.8</span><strong>Rating</strong></div>
        <div className="worker-stat"><span className="stat-symbol ready-symbol" aria-hidden="true">✓</span><strong>Sẵn sàng làm</strong></div>
      </section>

      <section className="worker-job-section" aria-labelledby="worker-job-heading">
        <div className="worker-filter-row" role="group" aria-label="Lọc việc demo">
          {(['Gần tôi', 'Nhận ngay', 'Lương cao', 'Bắt đầu sớm'] as const).map((option) => (
            <button key={option} type="button" className={`worker-filter${filter === option ? ' is-selected' : ''}`} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>
          ))}
        </div>
        <div className="worker-section-heading">
          <h2 id="worker-job-heading">Job phù hợp với bạn</h2>
          <button className="worker-link-button" type="button" onClick={() => onNavigate('jobs')}>Xem tất cả</button>
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
              <button className="worker-detail-button" type="button" onClick={() => onNavigate('jobs')}>Xem chi tiết</button>
            </article>
          )) : (
            <div className="worker-empty-state" role="status">
              <span aria-hidden="true">⌕</span><strong>Chưa có job theo bộ lọc này</strong><p>Thử chọn bộ lọc khác nhé. Đây là dữ liệu demo.</p>
            </div>
          )}
        </div>
      </section>
      <p className="worker-demo-note">Dữ liệu mô phỏng · Lịch tham chiếu 10–12/10/2026</p>
    </main>
  )
}

function amountFromPay(pay: string) {
  return Number(pay.replace(/\D/g, ''))
}

function dateKey(schedule: string) {
  const [day, month, year] = schedule.split(' · ')[0].split('/')
  return `${year}-${month}-${day}`
}
