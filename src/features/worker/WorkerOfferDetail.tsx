import { useState } from 'react'
import { offerDecisionScenarios } from '../../mocks/workerLifecycleFixtures'
import type { WorkerDecisionScenario, WorkerOffer, WorkerOfferStatus } from '../../types/workerLifecycle'
import type { WorkerOfferDecisionResult } from '../../mocks/workerLifecycleAdapter'

const statusLabel: Record<WorkerOfferStatus, string> = { offered: 'Đang mời · demo', accepted: 'Đã nhận trong kịch bản demo', declined: 'Đã từ chối · demo', expired: 'Đã hết hạn', withdrawn: 'Đã thu hồi', superseded: 'Không còn hiệu lực' }

export function WorkerOfferDetail({ offer, status, onBack, onDecision, onAccepted }: {
  offer: WorkerOffer
  status: WorkerOfferStatus
  onBack: () => void
  onDecision: (decision: 'accept' | 'decline', scenario: WorkerDecisionScenario) => WorkerOfferDecisionResult
  onAccepted: () => void
}) {
  const [scenario, setScenario] = useState<WorkerDecisionScenario>('success')
  const [message, setMessage] = useState('')
  function decide(decision: 'accept' | 'decline') {
    const result = onDecision(decision, scenario)
    setMessage(result.message)
    if (result.result === 'accepted') onAccepted()
  }
  return <main className="worker-core-page worker-offer-page">
    <button className="worker-back-button" type="button" onClick={onBack}>‹ Quay lại</button>
    <p className="worker-core-kicker">OFFER {offer.id} · DEMO</p><h1>Chi tiết công việc</h1>
    <section className="worker-offer-summary"><div className="worker-offer-title-row"><span>{offer.category}</span><strong>{statusLabel[status]}</strong></div><h2>{offer.title}</h2><p>{offer.description}</p><strong className="worker-offer-pay">{formatMoney(offer.totalPay)}</strong><small>Thù lao tham khảo · không phải cam kết thanh toán</small></section>
    <section className="worker-core-card worker-offer-info"><h2>Thông tin công việc</h2><dl><div><dt>Thời gian</dt><dd>{offer.schedule} · {offer.durationHours} giờ</dd></div><div><dt>Địa điểm demo</dt><dd>{offer.location}</dd></div><div><dt>Đối tác demo</dt><dd>{offer.employerName} · ★ {offer.employerRating}</dd></div><div><dt>Mã cơ hội</dt><dd>{offer.opportunityId}</dd></div></dl></section>
    <section className="worker-core-card"><h2>Điều kiện tham khảo</h2><ul className="worker-offer-conditions">{offer.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></section>
    <label className="worker-demo-state-control worker-offer-scenario"><span>Kịch bản quyết định demo</span><select value={scenario} onChange={(event) => setScenario(event.target.value as WorkerDecisionScenario)}>{offerDecisionScenarios.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
    {message && <p className="worker-decision-message" role="status">{message}</p>}
    <div className="worker-offer-actions"><button className="secondary-action" type="button" disabled={status !== 'offered'} onClick={() => decide('decline')}>Từ chối demo</button><button className="worker-core-primary" type="button" disabled={status !== 'offered'} onClick={() => decide('accept')}>{status === 'offered' ? 'Nhận việc demo' : 'Offer đã đóng'}</button></div>
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Kết quả chỉ là fixture UI, không phân công thật hoặc tạo giao dịch.</p>
  </main>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
