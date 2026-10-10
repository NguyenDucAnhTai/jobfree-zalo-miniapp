import { useState } from 'react'
import type { WorkerJob, WorkerJobGroup } from '../../types/workerLifecycle'

const groups: { value: WorkerJobGroup | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' }, { value: 'upcoming', label: 'Sắp làm' }, { value: 'in_progress', label: 'Đang làm' },
  { value: 'pending_confirmation', label: 'Chờ xác nhận' }, { value: 'completed', label: 'Đã xong' }, { value: 'history', label: 'Lịch sử' },
]

export function WorkerJobs({ jobs, onOpenShift }: { jobs: WorkerJob[]; onOpenShift: (shiftId: string) => void }) {
  const [active, setActive] = useState<WorkerJobGroup | 'all'>('all')
  const visible = jobs.filter((job) => active === 'all' || job.group === active)
  return <main className="worker-core-page worker-jobs-page">
    <p className="worker-core-kicker">CÔNG VIỆC CỦA BẠN · DEMO</p><h1>Việc của tôi</h1>
    <div className="worker-core-filters worker-job-filters" role="group" aria-label="Lọc việc của tôi">{groups.map((group) => <button key={group.value} type="button" aria-pressed={active === group.value} className={active === group.value ? 'is-selected' : ''} onClick={() => setActive(group.value)}>{group.label}</button>)}</div>
    {visible.length ? <section className="worker-my-job-list" aria-label="Danh sách việc demo">{visible.map((job) => <article className="worker-my-job-card" key={job.id}>
      <div className="worker-my-job-top"><span className={`worker-job-status status-${job.group}`}>{groupLabel(job.group)}</span><strong>{formatMoney(job.pay)}</strong></div>
      <h2>{job.title}</h2><p>{job.employerName} · đối tác demo</p><div className="worker-my-job-meta"><span>◷ &nbsp;{job.dateKey.split('-').reverse().join('/')} · {job.schedule}</span><span>⌖ &nbsp;{job.location}</span></div>
      {job.shiftId ? <button className="worker-core-secondary" type="button" onClick={() => onOpenShift(job.shiftId!)}>Xem chi tiết ca</button> : <button className="worker-core-secondary" type="button" disabled>Chi tiết chưa khả dụng trong demo</button>}
    </article>)}</section> : <div className="worker-core-state" role="status"><span aria-hidden="true">□</span><strong>Chưa có việc ở mục này</strong><p>Danh sách việc và trạng thái được tạo từ fixture demo.</p></div>}
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Không có assignment hoặc trạng thái việc thật.</p>
  </main>
}

function groupLabel(group: WorkerJobGroup) { return ({ upcoming: 'Sắp làm', in_progress: 'Đang thực hiện', pending_confirmation: 'Chờ xác nhận', completed: 'Đã hoàn thành', history: 'Lịch sử' })[group] }
function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
