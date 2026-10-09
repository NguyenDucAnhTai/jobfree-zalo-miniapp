import { useState } from 'react'
import { employerRequestScenarios, getDemoQuote, getEmployerRequestsMock, statusLabel } from '../../mocks/employerRequestAdapter'
import type { AsyncState, EmployerRequestDraft, EmployerWorkRequest, WorkRequestStatus } from '../../types/domain'

const requestStatuses: WorkRequestStatus[] = [
  'draft',
  'funding_pending',
  'funding_failed',
  'matching',
  'assigned',
  'replacement_matching',
  'awaiting_employer_decision',
  'completed',
  'cancelled',
]

const listStates: { value: AsyncState; label: string }[] = [
  { value: 'success', label: 'Có dữ liệu' },
  { value: 'empty', label: 'Rỗng' },
  { value: 'loading', label: 'Đang tải' },
  { value: 'error', label: 'Lỗi' },
  { value: 'offline', label: 'Ngoại tuyến' },
]

const money = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const formatMoney = (value: number) => `${money.format(value)} ₫`

export function EmployerRequestSummary({
  request,
  draft,
  onEdit,
  onHistory,
}: {
  request: EmployerWorkRequest
  draft: EmployerRequestDraft
  onEdit: () => void
  onHistory: () => void
}) {
  const quote = getDemoQuote(draft)
  return (
    <main className="employer-page-content lifecycle-page request-summary-page">
      <p className="lifecycle-screen-id">E12A · TÓM TẮT YÊU CẦU</p>
      <div className="lifecycle-title-row"><div><span className="section-kicker">BẢN NHÁP DEMO</span><h1>Xem lại yêu cầu</h1></div><span className="request-status status-draft">{statusLabel.draft}</span></div>
      <section className="request-summary-card" aria-label="Thông tin yêu cầu demo">
        <div className="request-summary-line"><span>Mã yêu cầu</span><strong>{request.id}</strong></div>
        <div className="request-summary-line"><span>Dịch vụ</span><strong>{request.serviceLabel}</strong></div>
        <div className="request-summary-line"><span>Mô tả công việc</span><strong>{request.details}</strong></div>
        <div className="request-summary-line"><span>Địa điểm</span><strong>{draft.location} · địa điểm demo</strong></div>
        <div className="request-summary-line"><span>Thời gian</span><strong>{request.schedule}</strong></div>
        <div className="request-summary-line"><span>Thời lượng</span><strong>{quote.durationHours} giờ</strong></div>
      </section>
      <section className="quote-preview-card" aria-labelledby="quote-preview-heading">
        <div className="quote-preview-heading"><span aria-hidden="true">◷</span><div><span className="section-kicker">ƯỚC TÍNH THAM KHẢO</span><h2 id="quote-preview-heading">Báo giá mô phỏng</h2></div></div>
        <div className="quote-preview-row"><span>Đơn giá demo / giờ</span><strong>{formatMoney(quote.unitRate)}</strong></div>
        <div className="quote-preview-row"><span>Thời lượng</span><strong>{quote.durationHours} giờ</strong></div>
        <div className="quote-preview-total"><span>Ngân sách tham khảo</span><strong>{formatMoney(quote.referenceTotal)}</strong></div>
        <p role="note">{quote.disclaimer}</p>
      </section>
      <div className="lifecycle-actions">
        <button className="secondary-action" type="button" onClick={onEdit}>Chỉnh sửa yêu cầu</button>
        <button className="primary-button lifecycle-primary" type="button" onClick={onHistory}>Lưu và xem danh sách demo <span aria-hidden="true">→</span></button>
      </div>
    </main>
  )
}

export function EmployerRequestHistory({
  requests,
  onOpen,
}: {
  requests: EmployerWorkRequest[]
  onOpen: (id: string) => void
}) {
  const [filter, setFilter] = useState<WorkRequestStatus | 'all'>('all')
  const [listState, setListState] = useState<AsyncState>('success')
  const result = getEmployerRequestsMock(listState)
  const source = result.state === 'success' ? requests : result.data ?? []
  const visibleRequests = filter === 'all' ? source : source.filter((request) => request.status === filter)

  return (
    <main className="employer-page-content lifecycle-page request-history-page">
      <p className="lifecycle-screen-id">E24 · YÊU CẦU CÔNG VIỆC</p>
      <div className="lifecycle-title-row"><div><span className="section-kicker">DEMO · NON-PRODUCTION</span><h1>Lịch sử yêu cầu</h1></div><span className="request-count">{visibleRequests.length} mục</span></div>
      <label className="demo-state-field"><span>Tình huống danh sách demo</span><select aria-label="Tình huống danh sách demo" value={listState} onChange={(event) => setListState(event.target.value as AsyncState)}>
        {listStates.map((state) => <option value={state.value} key={state.value}>{state.label}</option>)}
      </select></label>
      <div className="request-filter-row" role="group" aria-label="Lọc trạng thái yêu cầu">
        <button type="button" className={`request-filter${filter === 'all' ? ' is-selected' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Tất cả</button>
        {requestStatuses.map((status) => <button type="button" key={status} className={`request-filter${filter === status ? ' is-selected' : ''}`} aria-pressed={filter === status} onClick={() => setFilter(status)}>{statusLabel[status]}</button>)}
      </div>
      {result.state === 'loading' ? <div className="lifecycle-state-card" role="status"><span className="loading-mark" aria-hidden="true" />Đang tải danh sách demo…</div>
        : result.state === 'error' || result.state === 'offline' ? <div className="lifecycle-state-card is-error" role="status"><strong>{result.state === 'offline' ? 'Đang ngoại tuyến' : 'Chưa thể tải danh sách'}</strong><p>{result.message} Dữ liệu không được gửi tới server.</p></div>
          : visibleRequests.length ? <div className="request-history-list">{visibleRequests.map((request) => <button type="button" className="request-history-card" key={request.id} onClick={() => onOpen(request.id)}>
            <span className="history-card-top"><span className="history-service-icon" aria-hidden="true">▤</span><span className={`request-status status-${request.status}`}>{statusLabel[request.status]}</span></span>
            <strong className="history-card-title">{request.serviceLabel} · {request.details}</strong>
            <span className="history-card-meta">{request.id} · {request.createdAt}</span>
            <span className="history-card-bottom"><span>{request.location}</span><b>{formatMoney(request.referenceBudget)} <span aria-hidden="true">›</span></b></span>
          </button>)}</div>
            : <div className="lifecycle-state-card is-empty" role="status"><span aria-hidden="true">⌕</span><strong>{result.state === 'empty' ? 'Chưa có yêu cầu demo' : 'Không có yêu cầu theo bộ lọc'}</strong><p>Thử chọn trạng thái khác hoặc quay lại tạo bản nháp demo.</p></div>}
      <p className="lifecycle-disclaimer">Danh sách và trạng thái đều là fixture cố định; không phản ánh công việc thật.</p>
    </main>
  )
}

export function EmployerRequestDetail({
  request,
  onBack,
  onSelectScenario,
}: {
  request: EmployerWorkRequest
  onBack: () => void
  onSelectScenario: (id: string) => void
}) {
  return (
    <main className="employer-page-content lifecycle-page request-detail-page">
      <button className="back-link" type="button" onClick={onBack}>← Lịch sử yêu cầu</button>
      <p className="lifecycle-screen-id">E13–E16 · CHI TIẾT VÀ TRẠNG THÁI</p>
      <div className="lifecycle-title-row"><div><span className="section-kicker">MÃ CÔNG VIỆC DEMO</span><h1>{request.id}</h1></div><span className={`request-status status-${request.status}`}>{statusLabel[request.status]}</span></div>
      <section className="request-detail-card">
        <h2>{request.serviceLabel}</h2><p>{request.details}</p>
        <div className="request-summary-line"><span>Địa điểm</span><strong>{request.location}</strong></div>
        <div className="request-summary-line"><span>Thời gian</span><strong>{request.schedule}</strong></div>
        <div className="request-summary-line"><span>Thời lượng</span><strong>{request.durationHours} giờ</strong></div>
        <div className="request-summary-line"><span>Ngân sách tham khảo</span><strong>{formatMoney(request.referenceBudget)}</strong></div>
        <p className="quote-disclaimer">DEMO · NON-PRODUCTION. Không có funding hoặc thanh toán thật.</p>
      </section>
      <section className="assignment-preview" aria-labelledby="assignment-heading">
        <span className="section-kicker">KẾT QUẢ GHÉP MÔ PHỎNG</span><h2 id="assignment-heading">Người làm</h2>
        {request.assignment && request.status !== 'replacement_matching' ? <div className="assignment-worker-card">
          <span className="assignment-avatar" aria-hidden="true">A</span><div><strong>{request.assignment.displayName}</strong><span>★ {request.assignment.rating} · {request.assignment.completedJobs} job demo</span></div>
          <span className="assignment-status">{request.assignment.status === 'active' ? 'Đang phân công demo' : 'Đã thay thế'}</span>
        </div> : <div className="assignment-empty" role="status"><strong>{request.status === 'replacement_matching' ? 'Đang tìm người thay thế' : 'Chưa có người làm'}</strong><span>Frontend chỉ hiển thị kết quả mock; Employer không chọn ứng viên.</span></div>}
        {request.assignment?.shiftSchedule && request.status !== 'replacement_matching' && <p className="assignment-shift">Ca làm demo: {request.assignment.shiftSchedule}</p>}
      </section>
      <section className="request-timeline" aria-labelledby="timeline-heading"><span className="section-kicker">THEO DÕI DEMO</span><h2 id="timeline-heading">Tiến trình yêu cầu</h2>
        <ol>{request.timeline.map((item) => <li className={item.completed ? 'is-complete' : 'is-pending'} key={item.id}>
          <span className="timeline-marker" aria-hidden="true">{item.completed ? '✓' : '·'}</span><div><strong>{item.label}</strong><time>{item.occurredAt}</time><p>{item.note}</p></div>
        </li>)}</ol>
      </section>
      <label className="demo-state-field scenario-picker"><span>Chọn tình huống mẫu để xem UI</span><select aria-label="Chọn tình huống mẫu" value={request.id} onChange={(event) => onSelectScenario(event.target.value)}>
        {!employerRequestScenarios.some((scenario) => scenario.id === request.id) && <option value={request.id}>{request.id} · {statusLabel[request.status]}</option>}
        {employerRequestScenarios.map((scenario) => <option value={scenario.id} key={scenario.id}>{scenario.id} · {statusLabel[scenario.status]}</option>)}
      </select></label>
      <button className="primary-button lifecycle-primary" type="button" onClick={onBack}>Quay về lịch sử <span aria-hidden="true">→</span></button>
      <p className="lifecycle-disclaimer">Các thao tác funding, matching, assignment và hoàn tất không gọi backend.</p>
    </main>
  )
}
