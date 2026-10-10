import { useCallback, useEffect, useRef, useState } from 'react'
import { employerRequestScenarios, getDemoQuote, getEmployerRequestsMock, statusLabel } from '../../mocks/employerRequestAdapter'
import { addMinutesToIso, createEmployerExtensionRequest, employerExtensionScopeKey, formatDemoClock } from '../../mocks/employerLifecycleAdapter'
import { getEmployerAssignmentView, getEmployerShiftTracking } from '../../mocks/employerLifecycleFixtures'
import type { EmployerExtensionDuration, EmployerExtensionScenario, EmployerExtensionSessionState } from '../../types/employerLifecycle'
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
  extensionState: externalExtensionState,
  onExtensionStateChange,
}: {
  request: EmployerWorkRequest
  onBack: () => void
  onSelectScenario: (id: string) => void
  extensionState?: EmployerExtensionSessionState
  onExtensionStateChange?: (state: EmployerExtensionSessionState) => void
}) {
  const [matchingScenario, setMatchingScenario] = useState<'progress' | 'awaiting' | 'empty' | 'unavailable'>('progress')
  const [openExtensionScope, setOpenExtensionScope] = useState<string | null>(null)
  const [extensionDuration, setExtensionDuration] = useState<EmployerExtensionDuration>(30)
  const [extensionScenario, setExtensionScenario] = useState<EmployerExtensionScenario>('submitted')
  const [localExtensionStates, setLocalExtensionStates] = useState<Record<string, EmployerExtensionSessionState>>({})
  const extensionTriggerRef = useRef<HTMLButtonElement>(null)
  const extensionDialogRef = useRef<HTMLElement>(null)
  const e1Assignment = getEmployerAssignmentView(request.id)
  const shift = getEmployerShiftTracking(request.id)
  const extensionScope = shift ? employerExtensionScopeKey(request.id, shift.shiftId) : `${request.id}::no-shift`
  const extensionState = externalExtensionState ?? localExtensionStates[extensionScope] ?? {
    requestId: request.id,
    assignmentId: shift?.assignmentId ?? e1Assignment?.assignmentId ?? '',
    shiftId: shift?.shiftId ?? '',
    requests: [],
  }
  const extensionOpen = openExtensionScope === extensionScope
  const latestExtension = extensionState.requests.at(-1)
  const extensionError = extensionState.error ?? ''

  function updateExtensionState(next: EmployerExtensionSessionState) {
    if (onExtensionStateChange) onExtensionStateChange(next)
    else setLocalExtensionStates((current) => ({ ...current, [extensionScope]: next }))
  }

  const closeExtensionSheet = useCallback((restoreFocus = true) => {
    setOpenExtensionScope(null)
    if (restoreFocus) extensionTriggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!extensionOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    extensionDialogRef.current?.querySelector<HTMLElement>('[data-extension-autofocus]')?.focus()
    function handleModalKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeExtensionSheet()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = extensionDialogRef.current
      if (!dialog) return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleModalKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleModalKeyDown)
    }
  }, [extensionOpen, closeExtensionSheet])
  const matchingLabels = {
    progress: ['Đang tìm người làm phù hợp', 'Hệ thống demo đang xử lý theo các đợt. Employer không chọn ứng viên.'],
    awaiting: ['Đang chờ kết quả ghép', 'Chưa có assignment trong fixture hiện tại.'],
    empty: ['Chưa tìm thấy người làm phù hợp', 'Đây là trạng thái rỗng demo; bạn có thể xem lịch sử hoặc thử yêu cầu khác.'],
    unavailable: ['Tạm thời chưa thể hiển thị kết quả', 'Tình huống matching không khả dụng trong bộ dữ liệu demo.'],
  } as const
  const shiftStatusLabel: Record<string, string> = {
    scheduled: 'Sắp diễn ra', en_route: 'Đang di chuyển (demo)', checked_in: 'Đang làm việc (demo)',
    pending_confirmation: 'Chờ xác nhận', completed: 'Đã hoàn tất (demo)', no_show: 'Không đến (fixture)',
    incident_pending: 'Có sự cố chờ xử lý (fixture)', cancelled: 'Ca đã hủy (fixture)',
  }
  function submitExtension() {
    if (!shift) return
    const result = createEmployerExtensionRequest(shift, extensionDuration, extensionScenario, extensionState.requests)
    if (!result.ok) {
      updateExtensionState({ ...extensionState, error: result.reason === 'duplicate_pending' ? 'Đã có yêu cầu demo đang chờ cho ca này.' : 'Tình huống này không nhận yêu cầu gia hạn demo.' })
      return
    }
    updateExtensionState({
      requestId: request.id,
      assignmentId: shift.assignmentId,
      shiftId: shift.shiftId,
      requests: [...extensionState.requests, result.request],
    })
    closeExtensionSheet()
  }
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
        <span className="section-kicker">KẾT QUẢ GHÉP MÔ PHỎNG</span><h2 id="assignment-heading">{request.status === 'matching' ? 'Tiến trình tìm người' : 'Người làm'}</h2>
        {request.status === 'matching' ? <div className={`matching-state-card matching-${matchingScenario}`} role="status">
          <span className="matching-progress-mark" aria-hidden="true">{matchingScenario === 'progress' ? '⌕' : matchingScenario === 'unavailable' ? '!' : '…'}</span>
          <div><strong>{matchingLabels[matchingScenario][0]}</strong><span>{matchingLabels[matchingScenario][1]}</span></div>
          {matchingScenario === 'progress' && <div className="matching-progress-track" aria-label="Tiến trình matching demo"><span /></div>}
          <label className="demo-state-field"><span>Tình huống matching demo</span><select aria-label="Tình huống matching demo" value={matchingScenario} onChange={(event) => setMatchingScenario(event.target.value as typeof matchingScenario)}>
            <option value="progress">Đang tìm</option><option value="awaiting">Chờ kết quả</option><option value="empty">Không có Worker phù hợp</option><option value="unavailable">Tạm không khả dụng</option>
          </select></label>
          <small>Employer không chọn ứng viên; không có danh sách ứng viên để chọn.</small>
        </div> : request.status === 'replacement_matching' ? <>
          {request.assignment?.status === 'replaced' && <div className="assignment-worker-card is-replaced-worker">
            <span className="assignment-avatar" aria-hidden="true">A</span><div><strong>{request.assignment.displayName}</strong><span>Worker cũ · assignment đã kết thúc</span></div>
            <span className="assignment-status">Đã thay thế</span>
          </div>}
          <div className="assignment-empty is-replacement-search" role="status"><strong>Đang tìm người làm mới</strong><span>Worker cũ không còn active. Chưa có Worker mới trong dữ liệu demo.</span></div>
        </> : e1Assignment && e1Assignment.status === 'active' ? <div className="assignment-worker-card assignment-worker-card-rich">
          <span className="assignment-avatar assignment-avatar-photo" aria-hidden="true">{e1Assignment.initials}</span><div><strong>{e1Assignment.displayName}</strong><span>★ {e1Assignment.rating} · {e1Assignment.completedJobs} việc demo</span><span>{e1Assignment.serviceLabel} · {e1Assignment.shiftSchedule}</span></div>
          <span className="assignment-status">Worker đã ghép · DEMO</span>
          <small className="assignment-demo-note">Hồ sơ tổng hợp giả lập sau assignment. Không có liên hệ cá nhân hoặc vị trí trực tiếp.</small>
        </div> : request.assignment ? <div className="assignment-worker-card">
          <span className="assignment-avatar" aria-hidden="true">A</span><div><strong>{request.assignment.displayName}</strong><span>★ {request.assignment.rating} · {request.assignment.completedJobs} job demo</span></div>
          <span className="assignment-status">{request.assignment.status === 'active' ? 'Đang phân công demo' : request.assignment.status === 'replaced' ? 'Worker cũ · đã thay thế' : 'Assignment đã hủy'}</span>
        </div> : <div className="assignment-empty" role="status"><strong>Chưa có người làm</strong><span>Frontend chỉ hiển thị kết quả mock; Employer không chọn ứng viên.</span></div>}
        {request.assignment?.shiftSchedule && request.status !== 'replacement_matching' && <p className="assignment-shift">Ca làm demo: {request.assignment.shiftSchedule}</p>}
      </section>
      {shift && e1Assignment?.status === 'active' && <section className="employer-shift-card" aria-labelledby="employer-shift-heading">
        <div className="employer-shift-heading"><div><span className="section-kicker">E15 · E16 · THEO DÕI CA DEMO</span><h2 id="employer-shift-heading">Trạng thái ca</h2></div><span className={`shift-state-pill shift-state-${shift.shiftStatus}`}>{shiftStatusLabel[shift.shiftStatus]}</span></div>
        <div className="shift-schedule-pair"><div><small>Giờ bắt đầu theo lịch</small><strong>{formatDemoClock(shift.scheduledStartAt)}</strong></div><div><small>Kết thúc theo lịch</small><strong>{formatDemoClock(shift.scheduledEndAt)}</strong></div></div>
        <ol className="employer-shift-timeline" aria-label="Tiến trình ca demo">{shift.events.map((item) => <li key={item.id}><span className="shift-event-dot" aria-hidden="true" /><div><strong>{item.label}</strong><time dateTime={item.occurredAt}>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(item.occurredAt))}</time><p>{item.note}</p></div></li>)}</ol>
        {shift.shiftStatus === 'checked_in' && <button ref={extensionTriggerRef} className="primary-button extension-open-button" type="button" onClick={() => setOpenExtensionScope(extensionScope)}>Đề nghị gia hạn ca <span aria-hidden="true">→</span></button>}
        {latestExtension && <div className={`extension-result extension-result-${latestExtension.scenario}`} role="status"><strong>Kết quả gia hạn demo · {latestExtension.scenario}</strong><span>{latestExtension.message}</span><small>Mã yêu cầu demo: {latestExtension.id}</small><small>Giờ kết thúc gốc: {formatDemoClock(latestExtension.originalEndAt)} · đề xuất: {formatDemoClock(latestExtension.proposedEndAt)}{latestExtension.effectiveEndAt ? ` · hiệu lực demo: ${formatDemoClock(latestExtension.effectiveEndAt)}` : ''}</small></div>}
        {extensionError && <p className="field-error" role="alert">{extensionError}</p>}
        <p className="extension-disclaimer">Chỉ là dữ liệu demo. Không gửi yêu cầu thật, không thu phí và không đổi ca Worker.</p>
      </section>}
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
      {extensionOpen && shift && <div className="employer-sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeExtensionSheet() }}>
        <section ref={extensionDialogRef} className="employer-extension-sheet" role="dialog" aria-modal="true" aria-labelledby="extension-sheet-title" tabIndex={-1}>
          <div className="sheet-grabber" aria-hidden="true" /><button type="button" className="sheet-close" aria-label="Đóng" data-extension-autofocus onClick={() => closeExtensionSheet()}>×</button>
          <span className="section-kicker">E18 · ĐỀ NGHỊ THỜI GIAN DEMO</span><h2 id="extension-sheet-title">Gia hạn ca làm</h2>
          <p>Giờ kết thúc theo lịch <strong>{formatDemoClock(shift.scheduledEndAt)}</strong></p>
          <fieldset className="extension-options"><legend>Chọn thời lượng thêm</legend>{([30, 60, 120] as const).map((minutes) => <label key={minutes} className={extensionDuration === minutes ? 'is-selected' : ''}><input type="radio" name="extension-duration" value={minutes} checked={extensionDuration === minutes} onChange={() => setExtensionDuration(minutes)} /><span>+{minutes === 30 ? '30 phút' : `${minutes / 60} giờ`}</span></label>)}</fieldset>
          <div className="extension-proposal"><span>Giờ kết thúc đề xuất</span><strong>{formatDemoClock(addMinutesToIso(shift.effectiveEndAt, extensionDuration))}</strong><span>Phí tham khảo demo <b>{formatMoney(({ 30: 25_000, 60: 50_000, 120: 100_000 } as const)[extensionDuration])}</b></span></div>
          <label className="demo-state-field"><span>Kết quả fixture nội bộ</span><select aria-label="Kết quả extension demo" value={extensionScenario} onChange={(event) => setExtensionScenario(event.target.value as EmployerExtensionScenario)}><option value="submitted">Đã gửi (demo)</option><option value="pending">Đang chờ (demo)</option><option value="approved_demo">Được duyệt (demo)</option><option value="rejected_demo">Bị từ chối (demo)</option><option value="unavailable">Không khả dụng</option><option value="expired">Hết hạn</option></select></label>
          {extensionError && <p className="field-error" role="alert">{extensionError}</p>}
          <p className="extension-disclaimer">Không phải báo giá production. Gửi lựa chọn không tự động đổi lịch; chỉ fixture “Được duyệt (demo)” hiển thị giờ hiệu lực minh họa.</p>
          <div className="sheet-actions"><button className="secondary-action" type="button" onClick={() => closeExtensionSheet()}>Để sau</button><button className="primary-button" type="button" onClick={submitExtension}>Gửi đề nghị demo</button></div>
        </section>
      </div>}
    </main>
  )
}
