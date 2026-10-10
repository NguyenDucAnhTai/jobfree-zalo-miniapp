import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { WorkerOffer, WorkerOfferStatus } from '../../types/workerLifecycle'
import type { WorkerOfferDecisionResult } from '../../mocks/workerLifecycleAdapter'

export function WorkerNewJobModal({ offer, status, resultMessage, onClose, onViewDetails, onDecision }: {
  offer: WorkerOffer
  status: WorkerOfferStatus
  resultMessage: string
  onClose: () => void
  onViewDetails: () => void
  onDecision: () => WorkerOfferDecisionResult
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.querySelector<HTMLElement>('button:not(:disabled)')?.focus()
    return () => previousFocus?.focus()
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
    if (event.key !== 'Tab') return
    const buttons = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)')
    if (!buttons?.length) return
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return <div className="worker-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="worker-new-job-modal" role="dialog" aria-modal="true" aria-labelledby="worker-new-job-title" ref={dialogRef} onKeyDown={handleKeyDown}>
      <button className="worker-modal-close" type="button" aria-label="Đóng thông báo việc mới" onClick={onClose}>×</button>
      <p className="worker-core-kicker">THÔNG BÁO · DEMO</p><h2 id="worker-new-job-title">Công việc mới cho bạn</h2>
      <section className="worker-modal-offer"><div className="worker-modal-offer-heading"><h3>{offer.title}</h3><strong>{formatMoney(offer.referencePay)}</strong></div><small>Tổng thù lao tham khảo: {formatMoney(offer.totalPay)}</small><p>◷ &nbsp;{offer.schedule} · {offer.durationHours} giờ</p><p>⌖ &nbsp;{offer.location}</p></section>
      {resultMessage && <p className="worker-decision-message" role="status">{resultMessage}</p>}
      <div className="worker-modal-actions"><button className="secondary-action" type="button" onClick={onClose}>Để sau</button><button className="secondary-action" type="button" onClick={onViewDetails}>Xem chi tiết</button><button className="worker-core-primary" type="button" disabled={status !== 'offered'} onClick={onDecision}>{status === 'offered' ? 'Xác nhận nhận việc demo' : 'Offer đã đóng'}</button></div>
      <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Đây không phải xác nhận phân công thật.</p>
    </div>
  </div>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
