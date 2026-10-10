import { useState } from 'react'
import type { WorkerJob, WorkerJobGroup } from '../../types/workerLifecycle'
import { workerShiftStatusLabels } from '../../utils/workerShiftLabels'
import { formatShiftEventTime } from '../../utils/workerShiftTimeline'
import type { DemoConversationLink } from '../../types/jobfreeCommunications'
import { ContactActions } from '../shared/ConversationScreen'
import type { CommunicationAction, CommunicationAuthorization } from '../../mocks/jobfreeCommunicationsAdapter'

const groups: { value: WorkerJobGroup | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' }, { value: 'upcoming', label: 'Sắp làm' }, { value: 'in_progress', label: 'Đang làm' },
  { value: 'pending_confirmation', label: 'Chờ xác nhận' }, { value: 'completed', label: 'Đã xong' }, { value: 'history', label: 'Lịch sử' },
]

export function WorkerJobs({ jobs, onOpenShift, getContactLink, getContactAuthorization, onOpenChat, onOpenCall }: { jobs: WorkerJob[]; onOpenShift: (shiftId: string) => void; getContactLink?: (shiftId: string) => DemoConversationLink | undefined; getContactAuthorization?: (link: DemoConversationLink, action: CommunicationAction) => CommunicationAuthorization; onOpenChat?: (link: DemoConversationLink) => void; onOpenCall?: (link: DemoConversationLink) => void }) {
  const [active, setActive] = useState<WorkerJobGroup | 'all'>('all')
  const visible = jobs.filter((job) => active === 'all' || job.group === active)
  return <main className="worker-core-page worker-jobs-page">
    <p className="worker-core-kicker">CÔNG VIỆC CỦA BẠN · DEMO</p><h1>Việc của tôi</h1>
    <div className="worker-core-filters worker-job-filters" role="group" aria-label="Lọc việc của tôi">{groups.map((group) => <button key={group.value} type="button" aria-pressed={active === group.value} className={active === group.value ? 'is-selected' : ''} onClick={() => setActive(group.value)}>{group.label}</button>)}</div>
    {visible.length ? <section className="worker-my-job-list" aria-label="Danh sách việc demo">{visible.map((job) => {
      const link = job.shiftId ? getContactLink?.(job.shiftId) : undefined
      const chatAccess = link && getContactAuthorization ? getContactAuthorization(link, 'chat') : undefined
      const mode = !chatAccess?.allowed ? 'disabled' : chatAccess.readOnly ? 'readOnly' : 'active'
      const helperText = chatAccess?.readOnly ? 'Công việc đã kết thúc; chỉ xem được lịch sử demo.' : chatAccess?.reason
      const openChat = () => { if (link && getContactAuthorization?.(link, 'chat').allowed) onOpenChat?.(link) }
      const openCall = () => { if (link && getContactAuthorization?.(link, 'call').allowed && getContactAuthorization(link, 'call').currentAssignmentStatus === 'active') onOpenCall?.(link) }
      return <article className="worker-my-job-card" key={job.id}>
      <div className="worker-my-job-top"><span className={`worker-job-status status-${job.status}`}>{workerShiftStatusLabels[job.status]}</span><strong>{formatMoney(job.pay)}</strong></div>
      <div className="worker-my-job-info"><h2>{job.title}</h2><p>{job.employerName} · đối tác demo</p><div className="worker-my-job-meta"><span><CalendarIcon />{job.dateKey.split('-').reverse().join('/')} · {job.schedule}</span><span><LocationIcon />{job.location}</span></div></div>
      {job.timeline.length > 0 && <section className="worker-job-timeline-wrap"><h3>Tiến trình ca · Demo</h3><ol className="worker-job-timeline" aria-label={`Tiến trình demo ${job.title}`}>{job.timeline.map((event, index) => <li key={`${event.status}-${index}`}><span>{event.label}</span><time dateTime={event.occurredAt}>{formatShiftEventTime(event.occurredAt)}</time></li>)}</ol></section>}
      {link && getContactAuthorization && onOpenChat && onOpenCall && <ContactActions variant="worker" mode={mode} helperText={helperText} onChat={openChat} onCall={openCall} />}
      {job.shiftId ? <button className="worker-core-secondary worker-job-detail-cta" type="button" onClick={() => onOpenShift(job.shiftId!)}>Xem chi tiết ca</button> : <button className="worker-core-secondary worker-job-detail-cta" type="button" disabled>Chi tiết chưa khả dụng trong demo</button>}
    </article>})}</section> : <div className="worker-core-state" role="status"><span aria-hidden="true">□</span><strong>Chưa có việc ở mục này</strong><p>Danh sách việc và trạng thái được tạo từ fixture demo.</p></div>}
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Không có assignment hoặc trạng thái việc thật.</p>
  </main>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
function CalendarIcon() { return <svg className="worker-job-meta-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M4 9h16"/></svg> }
function LocationIcon() { return <svg className="worker-job-meta-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10.2c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></svg> }
