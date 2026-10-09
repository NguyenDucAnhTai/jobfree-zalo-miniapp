import { useMemo, useState } from 'react'
import { getWorkerOpportunityMock } from '../../mocks/workerMockClient'
import type { AsyncState, Destination, WorkerOpportunityFilter } from '../../types/domain'

const filters: WorkerOpportunityFilter[] = ['Tất cả', 'Gần tôi', 'Nhận ngay', 'Lương cao', 'Bắt đầu sớm']
const states: { value: AsyncState; label: string }[] = [
  { value: 'success', label: 'Có dữ liệu demo' }, { value: 'empty', label: 'Trống' },
  { value: 'loading', label: 'Đang tải (mô phỏng)' }, { value: 'error', label: 'Lỗi (mô phỏng)' },
  { value: 'offline', label: 'Ngoại tuyến (mô phỏng)' },
]

export function WorkerOpportunities({ onNavigate, onSelect }: {
  onNavigate: (destination: Destination) => void
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState<WorkerOpportunityFilter>('Tất cả')
  const [state, setState] = useState<AsyncState>('success')
  const result = getWorkerOpportunityMock(state)
  const items = useMemo(() => {
    const list = [...result.items]
    if (filter === 'Nhận ngay') return list.filter((job) => job.tag === 'NHẬN NGAY')
    if (filter === 'Gần tôi') return list.filter((job) => job.distanceLabel.includes('Gần') || job.distanceLabel.includes('km'))
    if (filter === 'Lương cao') return list.sort((a, b) => amount(b.pay) - amount(a.pay))
    if (filter === 'Bắt đầu sớm') return list.sort((a, b) => a.schedule.localeCompare(b.schedule))
    return list
  }, [filter, result.items])

  return <main className="worker-core-page worker-opportunities-page">
    <button className="worker-back-button" type="button" onClick={() => onNavigate('home')}>‹ Trang chủ</button>
    <p className="worker-core-kicker">CƠ HỘI DÀNH CHO BẠN · DEMO</p><h1>Việc mới</h1>
    <div className="worker-opportunity-controls"><div className="worker-core-filters" role="group" aria-label="Lọc cơ hội demo">{filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} className={filter === item ? 'is-selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <label className="worker-demo-state-control"><span>Trạng thái giao diện demo</span><select value={state} onChange={(event) => setState(event.target.value as AsyncState)}>{states.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label></div>
    {state === 'loading' ? <div className="worker-core-state" role="status"><span className="worker-core-spinner"/><strong>Đang tải cơ hội demo…</strong></div> : state === 'error' ? <div className="worker-core-state is-error" role="alert"><strong>Chưa thể hiển thị dữ liệu demo</strong><p>Đây là trạng thái lỗi minh họa, không có yêu cầu nào được gửi đi.</p></div> : state === 'offline' ? <div className="worker-core-state" role="status"><strong>Đang ngoại tuyến</strong><p>Danh sách demo chưa tải. Kết nối mạng không được kiểm tra.</p></div> : items.length ? <section className="worker-opportunity-list" aria-label="Danh sách cơ hội demo" aria-live="polite">{items.map((job) => <article className="worker-opportunity-card" key={job.id}>
      <div className="worker-opportunity-heading"><div><span className={`worker-opportunity-tag${job.tag === 'NHẬN NGAY' ? ' is-urgent' : ''}`}>{job.tag || job.category}</span><h2>{job.title}</h2></div><strong className="worker-opportunity-rating">★ {job.rating}</strong></div>
      <div className="worker-opportunity-meta"><span>◷ &nbsp;{job.schedule}</span><span>⌖ &nbsp;{job.location} · {job.distanceLabel}</span><span>⌛ &nbsp;{job.durationHours} giờ dự kiến</span></div>
      <div className="worker-opportunity-footer"><strong>{job.pay}</strong><button type="button" onClick={() => { onSelect(job.id); onNavigate('opportunityDetail') }}>Xem chi tiết</button></div>
    </article>)}</section> : <div className="worker-core-state" role="status"><span aria-hidden="true">⌕</span><strong>Chưa có việc mới phù hợp</strong><p>Thử đổi bộ lọc hoặc quay lại sau. Danh sách này dùng dữ liệu demo cố định.</p></div>}
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Không có nhận việc, điều phối hoặc định vị thật.</p>
  </main>
}

function amount(pay: string) { return Number(pay.replace(/\D/g, '')) }
